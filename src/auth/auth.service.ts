import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {email: dto.email,},
        });

        if(!user) {
            throw new UnauthorizedException("Invalid email or password")
        }

       const passwordMatched = await bcrypt.compare(
      dto.password,
      user.password,
    );

        if(!passwordMatched) {
            throw new UnauthorizedException("Invalid email or password")
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

       const accessToken = this.jwtService.sign(payload);

      return {
  message: 'Login successful',
  accessToken,
  user: {
    id: user.id,
    email: user.email,
    role: user.role,
  },
};

    }
}
