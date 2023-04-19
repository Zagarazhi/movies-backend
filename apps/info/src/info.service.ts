import { Country, Genre, Movie } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { OrderItem } from 'sequelize';

@Injectable()
export class InfoService {

    constructor(
        @InjectModel(Movie)
        private readonly movieModel: typeof Movie,
        @InjectModel(Genre)
        private readonly genreModel: typeof Genre,
        @InjectModel(Country)
        private readonly countryModel: typeof Country,
    ) {}

    async findAll(
        page: number,
        limit: number,
        sort: string,
        genres: number[],
        countries: number[],
        filters: Record<string, any>,
    ): Promise<{rows: Movie[], count: number}> {
        const offset = (page - 1) * limit;
        const order = sort.split(',').map((field) => {
            const [name, dist] = field.split('-');
            return [name, dist ? dist.toUpperCase() : 'ASC'] as OrderItem;
        });
        const options = {
            offset,
            limit,
            order,
            distinct: true,
            where: filters,
            include: [
                { 
                    model: this.genreModel,
                    as: 'genres', 
                    where: genres.length !== 0 ? { id: {[Op.in]: genres} } : {},
                    attributes: ['id', 'nameRu', 'nameEn'],
                    through: { attributes: [] },
                    required: true,
                },
                { 
                    model: this.countryModel, 
                    as: 'countries', 
                    where: countries.length !== 0 ? { id: {[Op.in]: countries} } : {},
                    attributes: ['id', 'nameRu', 'nameEn'],
                    through: { attributes: [] },
                    required: true,
                },
            ],
            attributes: [
                'id',
                'kinopoiskId',
                'nameRu',
                'nameEn',
                'ratingKinopoiskVoteCount',
                'ratingKinopoisk',
                'year',
                'type',
                'posterUrl',
                'posterUrlPreview',
            ],
        };
        return this.movieModel.findAndCountAll(options);
    }
}
