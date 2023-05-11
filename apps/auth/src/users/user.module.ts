import { Role, User, UserRoles } from "@app/common";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { RoleModule } from "../roles/role.module";

@Module({
    imports: [
        RoleModule,
        SequelizeModule.forFeature([User, Role, UserRoles])
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}