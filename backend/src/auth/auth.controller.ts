import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserResponseDto } from '../user/dtos/user-response.dto';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, type: AuthUserResponseDto })
  async register(@Body() dto: RegisterDto): Promise<AuthUserResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @Public()
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: AuthUserResponseDto })
  async login(@Body() dto: LoginDto): Promise<AuthUserResponseDto> {
    return this.authService.login(dto);
  }
}
