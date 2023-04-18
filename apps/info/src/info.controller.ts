import { Controller, Get, Query } from '@nestjs/common';
import { InfoService } from './info.service';
import { Movie } from '@app/common';
import { Op } from 'sequelize';

@Controller('/info')
export class InfoController {
    constructor(private readonly infoService: InfoService) {}

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('order') order = 'id',
        @Query('genres') genres: string,
        @Query('countries') countries: string,
        @Query('type') type: string,
        @Query('minRatings') minRatings: number,
        @Query('numRatings') numRatings: number,
    ): Promise<Movie[]> {
        const filters: Record<string, any> = {};

        /*
        if (genres) {
            filters['$genres.id$'] = { [Op.in]: genres.split(',') };
        }
        if (countries) {
            filters['$countries.id$'] = { [Op.in]: countries.split(',') };
        }*/
        const genreIds = genres ? genres.split(',').map(g => +g) : [];
        const countryIds = countries ? countries.split(',').map(c => +c) : [];
        if (type) {
            filters.type = type;
        }
        if (minRatings) {
            filters.ratingKinopoisk = { [Op.gte]: minRatings };
        }
        if (numRatings) {
            filters.ratingKinopoiskVoteCount = { [Op.gte]: numRatings };
        }

        return this.infoService.findAll(page, limit, order, genreIds, countryIds, filters);
    }
}
