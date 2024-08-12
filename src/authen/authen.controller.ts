import { Body, Controller, Post } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('authen')
export class AuthenController {
  constructor(
    private readonly authenService: AuthenService
  ) {}

  @Post('register')
  register(
    @Body() registerDto: RegisterDto
  ) {
    return this.authenService.register(registerDto);
  }

  @Post('login')
  login(
    @Body() loginDto: LoginDto
  ) {
    return this.authenService.login(loginDto);
  }
}
