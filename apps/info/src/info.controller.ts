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
        @Query('order') order = 'id-ASC',
        @Query('genres') genres: string,
        @Query('countries') countries: string,
        @Query('type') type: string,
        @Query('minRating') minRating: number,
        @Query('numRatings') numRatings: number,
        @Query('years') years: string,
    ): Promise<{rows: Movie[], count: number}> {
        const filters: Record<string, any> = {};

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

        return this.infoService.findAll(page, limit, order, genreIds, countryIds, filters);
    }
}
