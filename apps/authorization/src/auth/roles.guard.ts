import { CanActivate, ExecutionContext, UnauthorizedException, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { ROLES_KEY } from "./roles-auth.decorator";
import { Reflector } from "@nestjs/core";


@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private jwtService: JwtService,
                // для получения ролей нужен Reflector
                private reflector: Reflector) {
  
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const reg = context.switchToHttp().getRequest()
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]); //первый параметр ключ, второй - из контекста (рефлектор понимает какие данные доставлять)
            if (!requiredRoles) {
                return true;// если ролей нет, функция доступна всем пользователям 
            }
            const reg = context.switchToHttp().getRequest();
            const authHeader = reg.headers.authorization;
            const bearer = authHeader.split( ' ') [0];
            const token = authHeader.split( ' ') [1];

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException( {message: 'Пользователь не авторизован'})
            }
            const user = this.jwtService.verify(token);
            reg.user = user;
            //проверка при помощи some есть ли данная роль у пользователя
            //если у пользователя необходимая для данного endpointa роль (есть - true, нет -false) 
            return user.roles.some(role => requiredRoles.includes(role.value));
        } catch(e) {
            throw new HttpException( 'Нет доступа', HttpStatus.FORBIDDEN);
        }
        
    }

}