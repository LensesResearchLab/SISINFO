import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import jwtConstants from '../shared/security/constants';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.register({
      secret: jwtConstants.JWT_SECRET,
      signOptions: { expiresIn: jwtConstants.JWT_EXPIRES_IN },
    }),
  ],
  providers: [JwtStrategy, RolesGuard],
  exports: [JwtModule],
})
export class AuthModule {}