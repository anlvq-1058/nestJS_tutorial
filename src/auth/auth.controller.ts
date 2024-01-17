import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authDto: AuthDto): Promise<string> {
    return this.authService.createUser(authDto);
  }

  @Post('/signin')
  signIn(@Body() authDto: AuthDto): Promise<string> {
    return this.authService.signIn(authDto);
  }
}
