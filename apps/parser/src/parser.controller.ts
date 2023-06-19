import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ParserService } from './parser.service';
import { AccessTokenGuard, Roles, RolesGuard } from '@app/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('/parse/')
export class ParserController {
    constructor(private readonly parserService: ParserService) {}

    @ApiOperation({ summary: 'Парсинг фильма по ID кинопоиска' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiBearerAuth()
    @ApiCreatedResponse({ description: 'Фильм успешно спаршен' })
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    @Post('/movie/:id')
    async parseMovie(@Param('id') id: number) {
        return this.parserService.parseMovie(id);
    }
}
