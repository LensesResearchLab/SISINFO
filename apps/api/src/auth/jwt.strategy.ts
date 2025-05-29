import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import jwtConstants from '../shared/security/constants';

interface JwtPayload {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request | undefined): string | null => {
          const cookies = req?.cookies as Record<string, unknown> | undefined;
          const token = cookies?.['auth-token'];

          if (typeof token === 'string') {
            return token;
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.JWT_SECRET,
      algorithms: ['HS256'],
    });
  }

  validate(payload: JwtPayload) {
    if (!payload.id || !payload.email) {
      console.error('[JWT Strategy] JWT payload inválido:', payload);
      throw new Error('Invalid JWT payload');
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      roles: payload.roles,
    };
  }
}
