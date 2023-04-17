import { Controller, Param, Post } from '@nestjs/common';
import { ParserService } from './parser.service';

@Controller('/parse/')
export class ParserController {
    constructor(private readonly parserService: ParserService) {}

    @Post('/movie/:id')
    async parseMovie(@Param('id') id: number) {
        return this.parserService.parseMovie(id);
    }
}
