import { Controller, Post, Body, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUser: CreateUserDto) {    
    return this.authService.create(createUser);
  }

  @Post('login')
  loginUser(@Body() loginUser: LoginUserDto) {    
    return this.authService.login(loginUser);
  }

  @Get('privatee')
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  testPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: User
  ) {

    console.log({user });
    
    return {
      ok: true,
      msg: user,
      email: userEmail
    }
  }
}
