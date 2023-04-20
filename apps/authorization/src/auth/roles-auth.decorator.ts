import { SetMetadata } from "@nestjs/common/decorators/core/set-metadata.decorator";

export const ROLES_KEY = 'roles'; // константа-ключ
// по данному ключу получаем метаданные 

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); //Roles функция-декоратор