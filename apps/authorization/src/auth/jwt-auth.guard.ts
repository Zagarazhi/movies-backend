import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

// Guard ограничивают доступ неавторизованным пользователям (к endpoint)
@Injectable()
export class JwtAuthGuard implements CanActivate {

    // втавить JwtService
    constructor(private jwtService: JwtService) {
    }

// возвращает true/false доступ разрешен/запрещен
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const reg = context.switchToHttp().getRequest()
        try {
            const authHeader = reg.headers.authorization; //состоит из 2-х частей bearer/token
            const bearer = authHeader.split( ' ') [0];
            const token = authHeader.split( ' ') [1];

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException( {message: 'Пользователь не авторизован'})
            }
            const user = this.jwtService.verify(token); // разкодирование токена 
            reg.user = user;
            return true; // доступ к endpoint разрешен
        } catch(e) {
            throw new UnauthorizedException( {message: 'Пользователь не авторизован'})
        }
        
    }

}