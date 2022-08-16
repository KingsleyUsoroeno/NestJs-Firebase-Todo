import { JwtService } from "@nestjs/jwt";

export function getUserEmailFromToken(token: string, jwtService: JwtService): string {
    const bearerToken = token.replace(/ /g, "").substring(6, token.length);

    const decodedJwtAccessToken = jwtService.decode(bearerToken);
    console.log("bearer token is", decodedJwtAccessToken);

    if (decodedJwtAccessToken == null) {
        return null;
    }
    if (typeof decodedJwtAccessToken === "string") {
        return null;
    }
    if (decodedJwtAccessToken['claims'] != null
        && decodedJwtAccessToken['claims']['email'] != null) {
        return decodedJwtAccessToken['claims']['email'];
    }
    return null;
}