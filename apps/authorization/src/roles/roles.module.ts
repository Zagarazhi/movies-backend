import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { User } from 'src/users/users.model';
import { UserRoles } from './user-roles.model';

// импортируется внутрь => users.module => users.service
@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    SequelizeModule.forFeature( [Role, User, UserRoles]) // добавление моделей
  ],
  exports: [
    RolesService  // экспорт модуля в providers
  ]
})
export class RolesModule {}
