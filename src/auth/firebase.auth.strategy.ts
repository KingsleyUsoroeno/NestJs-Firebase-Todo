import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as admin from 'firebase-admin';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';


@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, "firebase-auth") {

    constructor(private readonly jwtService: JwtService, private readonly authService: AuthService) {
        super({
            secretOrKey: 'JWT_SECRET',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // tells our strategy how to get the json web token
        })
    }

    async validate(token: string): Promise<boolean> {
        const decodedJwtAccessToken = this.jwtService.decode(token);
        if (decodedJwtAccessToken == null) {
            throw new UnauthorizedException();
        }

        if (typeof decodedJwtAccessToken === "string") {
            throw new UnauthorizedException();
        }
        if (decodedJwtAccessToken['claims'] != null
            && decodedJwtAccessToken['claims']['email'] != null) {

            const expiresAt = decodedJwtAccessToken['exp'];
            const email = decodedJwtAccessToken['claims']['email'];

            try {
                await this.authService.getUser(email);
                return true;
            } catch (e) {
                throw new UnauthorizedException({
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: e
                });
            }
        }
    }
}