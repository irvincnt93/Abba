import { Body, Controller, Get, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthenGuard } from './guard/authen.guard';
import { Request } from 'express';
import { RolesGuard } from './guard/roles.guard';
import { ValidRoles } from './interfaces/valid-roles';
import { AuthRoles } from './decorators/authRoles.decorators';

interface RequestUser extends Request {
  user: { user: string, roles: string[]}
}

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

  @Get('profile')
  @AuthRoles(ValidRoles.admin, ValidRoles.user)
  profilee(@Req() req: RequestUser) {
    return req.user
  }
}
