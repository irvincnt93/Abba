import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from "bcryptjs";
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.userService.findOneByEmail(registerDto.email);
    
    if (user) {
      throw new BadRequestException('User already exists')
    }
    return await this.userService.create({
      ...registerDto,
      password: await bcrypt.hash(registerDto.password, 10)
    })
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmailWithPassword(loginDto.email);

    if (!user) {
      throw new UnauthorizedException("Credentials are not valid")
    }

    if (!bcrypt.compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException("Credentials are not valid")
    }

    const payload = { email: user.email, roles: user.roles };
    const token = await this.jwtService.signAsync(payload)

    return {
      token,
      email: loginDto.email
    }
  }
}
