import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from "bcryptjs";
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUser: CreateUserDto) {
      const userExist = await this.userRepository.findOneBy({email: createUser.email})
      
      if (userExist) {
        throw new BadRequestException("Email already exists");
      }
      const hashedPaswword = await bcrypt.hashSync(createUser.password, 10)
      const user = this.userRepository.create( {...createUser, password: hashedPaswword} )
      await this.userRepository.save(user)
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      }
  }

  async login(loginUser: LoginUserDto) {
      const { password, email} = loginUser

      const user = await this.userRepository.findOne({
        where: {email},
        select: { email: true, password: true, id: true}
      })

      if (!user) {
        throw new UnauthorizedException("Credentials are not valid")
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException("Credentials are not valid")
      }

      delete user.password

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      }
  }


  private getJwtToken (payload: JwtPayload) {    
    const token = this.jwtService.sign(payload)
    return token
  }
}
