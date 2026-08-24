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
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatched = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    const { password, ...userWithoutPassword } = user;
    return {
      message: 'Login successful',
      ...tokens,
      user: userWithoutPassword,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(sub: string, email: string, role: string) {
    const payload = { sub, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }
}


// import * as bcrypt from 'bcrypt';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { LoginDto } from './dto/login.dto';

// @Injectable()
// export class AuthService {
//     constructor(
//         private readonly prisma: PrismaService,
//         private readonly jwtService: JwtService,
//     ) {}

//     async login(dto: LoginDto) {
//         const user = await this.prisma.user.findUnique({
//             where: {email: dto.email,},
//         });

//         if(!user) {
//             throw new UnauthorizedException("Invalid email or password")
//         }

//        const passwordMatched = await bcrypt.compare(
//       dto.password,
//       user.password,
//     );

//         if(!passwordMatched) {
//             throw new UnauthorizedException("Invalid email or password")
//         }

//         const payload = {
//             sub: user.id,
//             email: user.email,
//             role: user.role,
//         };

//        const accessToken = this.jwtService.sign(payload);


//       return {
//   message: 'Login successful',
//   accessToken,
//   user: {
//     id: user.id,
//     email: user.email,
//     role: user.role,
//   },
// };

//     }
// }
