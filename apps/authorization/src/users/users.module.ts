import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from 'src/roles/roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { UserRoles } from 'src/roles/user-roles.model';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
//import { Post } from 'src/posts/posts.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature( [User, Role, UserRoles]), //,Post добавление моделей
    RolesModule,
    forwardRef( () => AuthModule), // forwardRef - для исключения кольцевой зависимости
  ],
    exports: [
      UsersService, // экспорт в auth.module      
    ]
})
export class UsersModule {}
