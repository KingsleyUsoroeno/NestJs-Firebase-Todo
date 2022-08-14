import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;

    @IsNotEmpty()
    displayName: string
}