import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtPayload } from '../common/types/jwt-payload.interface';
import { UserResponseBaseDto } from '../user/dtos/user-response.dto';

@Injectable()
export class AuthService {
  private ACCESS_TTL = 15 * 60; // 15 phút
  private REFRESH_TTL = 7 * 24 * 60 * 60; // 7 ngày
  private REFRESH_HASH_SALT_ROUNDS = 10;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private signAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: this.ACCESS_TTL });
  }

  private signRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: this.REFRESH_TTL });
  }

  private async saveHashedRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, this.REFRESH_HASH_SALT_ROUNDS);
    await this.userService.updateRefreshToken(userId, hash);
  }

  private async buildJwtPayload(
    userId: string,
    email: string,
  ): Promise<JwtPayload> {
    return { id: userId, email };
  }

  async register(
    dto: RegisterDto,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserResponseBaseDto;
  }> {
    const user = await this.userService.createUser(dto);
    const payload = await this.buildJwtPayload(user.id, user.email);

    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    await this.saveHashedRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user };
  }

  async login(
    dto: LoginDto,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserResponseBaseDto;
  }> {
    const userRecord = await this.userService.findByEmail(dto.email);
    if (!userRecord) throw new UnauthorizedException('Email not found');

    const match = await bcrypt.compare(dto.password, userRecord.password);
    if (!match) throw new UnauthorizedException('Wrong password');

    const payload = await this.buildJwtPayload(userRecord.id, userRecord.email);
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    await this.saveHashedRefreshToken(userRecord.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: this.userService.buildBaseUserResponse(userRecord),
    };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    if (!refreshToken)
      throw new BadRequestException('refreshToken is required');

    let decoded: JwtPayload;
    try {
      decoded = this.jwtService.verify<JwtPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userService.findById(decoded.id);
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new UnauthorizedException('Invalid refresh token');

    const payload = await this.buildJwtPayload(user.id, user.email);
    const accessToken = this.signAccessToken(payload);
    const newRefreshToken = this.signRefreshToken(payload);

    await this.saveHashedRefreshToken(user.id, newRefreshToken);

    return { accessToken, newRefreshToken };
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
  }
}
