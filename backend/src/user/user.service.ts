import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dtos/register.dto';
import { UserResponseBaseDto } from './dtos/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: RegisterDto): Promise<UserResponseBaseDto> {
    const {
      email,
      username,
      password,
      fullName,
      gender,
      dateOfBirth,
      avatarUrl,
    } = dto;

    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) throw new ConflictException('Email hoặc username đã tồn tại');

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: passwordHash,
        fullName,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        avatarUrl,
      },
    });

    return this.buildBaseUserResponse(user);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  buildBaseUserResponse(user): UserResponseBaseDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
    };
  }
}
