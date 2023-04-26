"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.ROLES_KEY = void 0;
const set_metadata_decorator_1 = require("@nestjs/common/decorators/core/set-metadata.decorator");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, set_metadata_decorator_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
//# sourceMappingURL=roles-auth.decorator.js.map