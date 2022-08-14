import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "./model/user";

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    console.log("req is", req);

    return req.user;
})