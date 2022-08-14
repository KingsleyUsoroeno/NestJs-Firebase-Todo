import { Controller, Post, Body, Get, Param, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create.user.dto";
import { LoginUserDto } from "./dto/login.user.dto";
import { UserRecord } from "firebase-admin/lib/auth/user-record";


@Controller("auth")
export class AuthController {
    constructor(private readonly authSerice: AuthService) { }

    @Post('/signUp')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<any> {
        return this.authSerice.signUp(createUserDto);
    }


    @Post('/login')
    async login(@Body() loginUserDto: LoginUserDto): Promise<void> {
        return this.authSerice.login(loginUserDto);
    }

    @Get("/user/:id")
    async getUser(@Param("id") id: string): Promise<UserRecord> {
        return this.authSerice.getUser(id);
    }
}