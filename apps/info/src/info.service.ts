import { Country, Genre, Movie, Person } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { lastValueFrom } from 'rxjs';
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
        @Inject('MOVIE_SERVICE') private movieClient: ClientProxy,
        @Inject('COMMENT_SERVICE') private commentClient: ClientProxy,
        @Inject('PERSON_SERVICE') private personClient: ClientProxy, 
    ) {}

    async getRolesByPersonId(personId: number) {
        const person = await lastValueFrom(this.personClient.send<Person>({cmd: 'roles'}, personId));
        const movieIds = person.roles.map((role) => (role.movieId));
        const uniqueMovieIds = [...(new Set(movieIds))];
        const movies = await lastValueFrom(this.movieClient.send<Movie[]>({cmd: 'get_all_movies'}, uniqueMovieIds));
        return {person, movies};
    }

    async findAll(
        page: number,
        limit: number,
        sort: string,
        genres: number[],
        countries: number[],
        filters: Record<string, any>,
        persons: Record<string, any>,
        keywords: string,
    ): Promise<{rows: Movie[], count: number}> {
        const ids = [];
        if(persons.actors) {
            const actors = await lastValueFrom(this.personClient.send<Person[]>({cmd: 'actors'}, persons.actors));
            const movieIds = actors.flatMap((actor) => (actor.roles.map((role) => (role.movieId))));
            ids.push(...movieIds);
        }
        if(persons.directors) {
            const directors = await lastValueFrom(this.personClient.send<Person[]>({cmd: 'directors'}, persons.directors));
            const movieIds = directors.flatMap((director) => (director.roles.map((role) => (role.movieId))));
            ids.push(...movieIds);
        }
        if(persons.staff) {
            const staff = await lastValueFrom(this.personClient.send<Person[]>({cmd: 'staff'}, persons.staff));
            const movieIds = staff.flatMap((record) => (record.roles.map((role) => (role.movieId))));
            ids.push(...movieIds);
        }
        if(persons.actors || persons.directors || persons.staff) {
            const uniqueMovieIds = [...(new Set(ids))];
            filters.id = {[Op.in]: uniqueMovieIds};
        }
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
            where: keywords ? {[Op.and]: {
                ...filters,
                [Op.or]: {
                    nameRu: {[Op.iLike]: `%${keywords}%`},
                    nameEn: {[Op.iLike]: `%${keywords}%`},
                },
            }} : filters,
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
                'filmLength',
                'posterUrl',
                'posterUrlPreview',
            ],
        };
        return this.movieModel.findAndCountAll(options);
    }
}
