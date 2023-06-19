import { Controller, Get, Param, Query } from '@nestjs/common';
import { InfoService } from './info.service';
import { Movie, Person } from '@app/common';
import { Op } from 'sequelize';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('/info')
export class InfoController {
    constructor(private readonly infoService: InfoService) {}

    @ApiOperation({ summary: 'Получение ролей по ID персоны' })
    @ApiOkResponse({ description: 'Роли успешно получены' })
    @Get('/person/:personId')
    async getRolesByPersonId(@Param('personId') personId: number) {
        const person = await this.infoService.getRolesByPersonId(personId);
        return person;
    }

    @ApiOperation({ summary: 'Найти все фильмы с учетом фильтров' })
    @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
    @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
    @ApiQuery({ name: 'order', type: String, required: false, example: 'id-ASC' })
    @ApiQuery({ name: 'genres', type: String, required: false })
    @ApiQuery({ name: 'countries', type: String, required: false })
    @ApiQuery({ name: 'type', type: String, required: false })
    @ApiQuery({ name: 'minRating', type: Number, required: false })
    @ApiQuery({ name: 'numRatings', type: Number, required: false })
    @ApiQuery({ name: 'years', type: String, required: false })
    @ApiQuery({ name: 'actors', type: String, required: false })
    @ApiQuery({ name: 'directors', type: String, required: false })
    @ApiQuery({ name: 'staff', type: String, required: false })
    @ApiQuery({ name: 'keywords', type: String, required: false })
    @ApiOkResponse({ description: 'Фильмы успешно получены' })
    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('order') order = 'id-ASC',
        @Query('genres') genres: string,
        @Query('countries') countries: string,
        @Query('type') type: string,
        @Query('minRating') minRating: number,
        @Query('numRatings') numRatings: number,
        @Query('years') years: string,
        @Query('actors') actors: string,
        @Query('directors') directors: string,
        @Query('staff') staff: string,
        @Query('keywords') keywords: string,
    ): Promise<{rows: Movie[], count: number}> {
        const filters: Record<string, any> = {};
        const persons: Record<string, any> = {};

        const genreIds = genres ? genres.split(',').map(g => +g).filter(g => !isNaN(g)) : [];
        const countryIds = countries ? countries.split(',').map(c => +c).filter(c => !isNaN(c)) : [];
        if(!page) {
            page = 1;
        }
        if(!limit) {
            limit = 10;
        }
        if(!order) {
            order = 'id-ASC'
        }
        if (type) {
            filters.type = type;
        }
        if (minRating) {
            filters.ratingKinopoisk = { [Op.gte]: minRating };
        }
        if (numRatings) {
            filters.ratingKinopoiskVoteCount = { [Op.gte]: numRatings };
        }
        if(years) {
            const [startYear, endYear] = years.split('-');
            if(+startYear && !+endYear) {
                filters.year = { [Op.eq]: +startYear }
            } else if (+startYear && +endYear) {
                filters.year = { [Op.between]: [+startYear, +endYear] }
            }
        }
        if(actors) {
            persons.actors = actors.split(',');
        }
        if(directors) {
            persons.directors = directors.split(',');
        }
        if(staff) {
            persons.staff = staff.split(',');
        }

        return this.infoService.findAll(page, limit, order, genreIds, countryIds, filters, persons, keywords);
    }
}
