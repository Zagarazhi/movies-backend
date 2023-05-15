import { CreatePersonDto, Person, RoleInfo } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class PersonService {
    
    constructor(@InjectModel(Person) private personRepository: typeof Person,
                @InjectModel(RoleInfo) private roleInfoRepository: typeof RoleInfo) {}

    async createManyPersons(dtos: CreatePersonDto[]): Promise<Person[]> {
        const rolePromises = dtos.map(async (dto) => {
            const [person, createdPerson] = await this.personRepository.findOrCreate({where: {staffId: dto.staffId}, defaults: dto});
            const roleInfo = await this.roleInfoRepository.create({...dto.role, personId: person.id});

            person.$add('roles', roleInfo);
            
            return person;
        });

        return await Promise.all(rolePromises);
    }

    async getAllPersons(page: number, limit: number): Promise<Person[]> {
        const offset = (page - 1) * limit;
        const persons = await this.personRepository.findAll({offset, limit});
        return persons;
    }

    async getAllPersonsByKeywords(page: number, limit: number, keywords: string): Promise<Person[]> {
        const offset = (page - 1) * limit;
        const persons = await this.personRepository.findAll({
            offset, 
            limit,
            where: {
                [Op.or]: {
                    nameRu: {[Op.iLike]: `%${keywords}%`},
                    nameEn: {[Op.iLike]: `%${keywords}%`}
                }    
            }
        });
        return persons;
    }

    async getAllActors(page: number, limit: number): Promise<Person[]> {
        const offset = (page - 1) * limit;
        const actors = await this.personRepository.findAll({
            offset, 
            limit,
            include: [
                {
                    model: this.roleInfoRepository,
                    where: {nameEn: 'Actors'},
                    attributes: [],
                }
            ]
        });
        return actors;
    }

    async getAllActorsByKeywords(page: number, limit: number, keywords: string): Promise<Person[]> {
        const offset = (page - 1) * limit;
        const persons = await this.personRepository.findAll({
            offset, 
            limit,
            where: {
                [Op.or]: {
                    nameRu: {[Op.iLike]: `%${keywords}%`},
                    nameEn: {[Op.iLike]: `%${keywords}%`}
                }    
            },
            include: [
                {
                    model: this.roleInfoRepository,
                    where: {nameEn: 'Actors'},
                    attributes: [],
                }
            ],
        });
        return persons;
    }

    async getAllDirectors(page: number, limit: number): Promise<Person[]> {
        const offset = (page - 1) * limit;
        const directors = await this.personRepository.findAll({
            offset, 
            limit,
            include: [
                {
                    model: this.roleInfoRepository,
                    where: {nameEn: 'Directors'},
                    attributes: [],
                }
            ]
        });
        return directors;
    }

    async getAllDirectorsByKeywords(page: number, limit: number, keywords: string): Promise<Person[]> {
        const offset = (page - 1) * limit;
        const persons = await this.personRepository.findAll({
            offset, 
            limit,
            where: {
                [Op.or]: {
                    nameRu: {[Op.iLike]: `%${keywords}%`},
                    nameEn: {[Op.iLike]: `%${keywords}%`}
                }    
            },
            include: [
                {
                    model: this.roleInfoRepository,
                    where: {nameEn: 'Directors'},
                    attributes: [],
                }
            ]
        });
        return persons;
    }

    async getAllStaff(page: number, limit: number): Promise<Person[]> {
        const offset = (page - 1) * limit;
        const stuff = await this.personRepository.findAll({
            offset, 
            limit,
            include: [
                {
                    model: this.roleInfoRepository,
                    where: {nameEn: {[Op.notIn]: ['Actors', 'Directors']}},
                    attributes: [],
                }
            ]
        });
        return stuff;
    }

    async getAllActorsByIds(ids: number[]): Promise<Person[]> {
        const actors = await this.personRepository.findAll({
            include: [
                {
                    model: this.roleInfoRepository,
                    where: {nameEn: 'Actors', id: {[Op.in]: ids}},
                    attributes: ['movieId'],
                }
            ]
        });
        return actors;
    }

    async getAllDirectorsByIds(ids: number[]): Promise<Person[]> {
        const directors = await this.personRepository.findAll({
            include: [
                {
                    model: this.roleInfoRepository,
                    where: {nameEn: 'Directors', id: {[Op.in]: ids}},
                    attributes: ['movieId'],
                }
            ]
        });
        return directors;
    }

    async getAllStaffByIds(ids: number[]): Promise<Person[]> {
        const stuff = await this.personRepository.findAll({
            include: [
                {
                    model: this.roleInfoRepository,
                    where: {nameEn: {[Op.notIn]: ['Actors', 'Directors']}, id: {[Op.in]: ids}},
                    attributes: ['movieId'],
                }
            ]
        });
        return stuff;
    }

    async getPersonsByMovieId(movieId: number): Promise<Person[]> {
        const persons = await this.personRepository.findAll({
            include: [
                {
                    model: RoleInfo, 
                    where: { movieId, },
                    attributes: ['nameRu', 'nameEn'],
                },
            ],
            attributes: {exclude: ['staffId']}
        });
        return persons;
    }

    async getRolesByPersonId(personId: number): Promise<Person> {
        const person = await this.personRepository.findByPk(
            personId,
            {
                include: [
                    {
                        model: RoleInfo,
                        attributes: ['nameRu', 'nameEn', 'movieId'],
                    }
                ],
            }
        );
        return person;
    }
}
