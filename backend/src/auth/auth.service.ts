import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtPayload } from '../common/types/jwt-payload.interface';
import {
  UserResponseBaseDto,
  AuthUserResponseDto,
} from '../user/dtos/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  //REGISTER
  async register(dto: RegisterDto): Promise<AuthUserResponseDto> {
    const user: UserResponseBaseDto = await this.userService.createUser(dto);

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      // TODO: rolesByWorkspace, rolesByChannel sau này để check quyền trong nhóm
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  //LOGIN
  async login(dto: LoginDto): Promise<AuthUserResponseDto> {
    const userRecord = await this.userService.findByEmail(dto.email);
    if (!userRecord) throw new UnauthorizedException('Email not found');

    const match = await bcrypt.compare(dto.password, userRecord.password);
    if (!match) throw new UnauthorizedException('Wrong password');

    const payload: JwtPayload = {
      id: userRecord.id,
      email: userRecord.email,
      // TODO: rolesByWorkspace, rolesByChannel sau này để check quyền trong nhóm
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: this.userService.buildBaseUserResponse(userRecord),
    };
  }
}
