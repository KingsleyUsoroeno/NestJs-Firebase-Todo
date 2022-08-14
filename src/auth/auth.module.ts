import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    exports: [PassportModule, AuthService],
    imports: [
        PassportModule.register({ defaultStrategy: 'firebase-jwt' }),
        JwtModule.register({ secret: 'JWT_SECRET' }),
    ]
})
export class AuthModule { }