import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role, User, UserRoles } from '@app/common';

// Генарация модуля
// nest generate module roles
@Module({
    controllers: [RoleController],
    providers: [RoleService],
    imports: [
        SequelizeModule.forFeature([Role, User, UserRoles]),
    ],
    exports: [
        RoleService,
    ],
})
export class RoleModule {}
