import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ParserService } from './parser.service';
import { AccessTokenGuard, Roles, RolesGuard } from '@app/common';

@Controller('/parse/')
export class ParserController {
    constructor(private readonly parserService: ParserService) {}

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    @Post('/movie/:id')
    async parseMovie(@Param('id') id: number) {
        return this.parserService.parseMovie(id);
    }
}
