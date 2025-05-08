import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import jwtConstants from '../shared/security/constants';

// ... existing code ...
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.JWT_SECRET,
      algorithms: ['HS256'], 
    });
  }

  async validate(payload: any) {
    return { 
      id: payload.id,
      email: payload.email,
      name: payload.name,
      roles: payload.roles 
    };
  }
}
