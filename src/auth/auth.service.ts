import { Injectable, InternalServerErrorException, HttpStatus, NotFoundException, ConflictException } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { UserRecord } from "firebase-admin/lib/auth/user-record";

// Gotta work on my exception and messages sent back to the client
@Injectable()
export class AuthService {

    async signUp({ email, password, displayName }: CreateUserDto): Promise<any> {
        try {
            const userRecord = await admin.auth().createUser({
                email: email,
                password: password,
                displayName: displayName,
                emailVerified: false,
            });
            return {
                statusCode: HttpStatus.CREATED,
                message: "User created successfully",
                uid: userRecord.uid
            }

        } catch (e) {
            // Not a good approach, the error might not always be that of a conflic thus misleading to the client
            console.log(`error creating user ${e}`);
            throw new ConflictException({
                statusCode: HttpStatus.CONFLICT,
                message: "The email address is already in use by another account"
            });
        }
    }

    async login({ email }: LoginUserDto): Promise<any> {
        try {
            const additionalClaims = { email: email, uid: "" };
            const user = await this.getUser(email);
            additionalClaims['uid'] = user.uid;

            const token = await admin.auth().createCustomToken(user.uid, additionalClaims);
            return {
                statusCode: HttpStatus.OK, token: token
            }

        } catch (e) {
            console.log(`Error creating custom token: ${e}`);
            throw new InternalServerErrorException();
        }
    }

    async getUser(requirement: string): Promise<UserRecord> {
        try {
            let userRecord: UserRecord
            if (requirement.includes("@")) {
                userRecord = await admin.auth().getUserByEmail(requirement)
            } else {
                userRecord = await admin.auth().getUser(requirement);
            }
            return userRecord;

        } catch (e) {
            console.log(`error getting user record ${e}`);
            throw new NotFoundException()
        }
    }
}