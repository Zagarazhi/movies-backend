"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const dist_1 = require("@nestjs/swagger/dist");
const api_use_tags_decorator_1 = require("@nestjs/swagger/dist/decorators/api-use-tags.decorator");
const create_user_dto_1 = require("./dto/create-user.dto");
const users_model_1 = require("./users.model");
const users_service_1 = require("./users.service");
const roles_auth_decorator_1 = require("../auth/roles-auth.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const add_role_dto_1 = require("./dto/add-role.dto");
let UsersController = class UsersController {
    constructor(userService) {
        this.userService = userService;
    }
    create(userDto) {
        return this.userService.createUser(userDto);
    }
    getAll() {
        return this.userService.getAllUsers();
    }
    addRole(dto) {
        return this.userService.addRole(dto);
    }
};
__decorate([
    (0, dist_1.ApiOperation)({ summary: 'Создание пользователя' }),
    (0, dist_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, dist_1.ApiOperation)({ summary: 'Получить всех пользователей' }),
    (0, dist_1.ApiResponse)({ status: 200, type: [users_model_1.User] }),
    (0, roles_auth_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAll", null);
__decorate([
    (0, dist_1.ApiOperation)({ summary: 'Выдать роль' }),
    (0, dist_1.ApiResponse)({ status: 200 }),
    (0, roles_auth_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Post)('/role'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_role_dto_1.addRoleDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "addRole", null);
UsersController = __decorate([
    (0, api_use_tags_decorator_1.ApiTags)('Пользователи'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map