import { Controller, Get, Param, Query } from '@nestjs/common';
import { PersonService } from './person.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreatePersonDto, Person } from '@app/common';

@Controller('/persons')
export class PersonController {
    
    constructor(private readonly personService: PersonService) {}

    @MessagePattern({cmd: 'person'})
    async createManyPersons(dtos: CreatePersonDto[]): Promise<Person[]> {
        const persons = await this.personService.createManyPersons(dtos);
        return persons;
    }

    @MessagePattern({cmd: 'roles'})
    async getRolesByPersonId(personId: number): Promise<Person> {
        const person = await this.personService.getRolesByPersonId(personId);
        return person;
    }

    @MessagePattern({cmd: 'actors'})
    async getAllActorsByids(ids: number[]): Promise<Person[]> {
        const persons = await this.personService.getAllActorsByIds(ids);
        return persons;
    }

    @MessagePattern({cmd: 'directors'})
    async getAllDirectorsByIds(ids: number[]): Promise<Person[]> {
        const persons = await this.personService.getAllDirectorsByIds(ids);
        return persons;
    }

    @MessagePattern({cmd: 'staff'})
    async getAllStaffByIds(ids: number[]): Promise<Person[]> {
        const persons = await this.personService.getAllStaffByIds(ids);
        return persons;
    }

    @Get('/all')
    async getAllPersons(
        @Query('keywords') keywords: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ): Promise<Person[]> {
        const persons = keywords ? 
            await this.personService.getAllPersonsByKeywords(page, limit, keywords) :
            await this.personService.getAllPersons(page, limit) ;
        return persons;
    }

    @Get('/actors')
    async getAllActors(
        @Query('keywords') keywords: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ): Promise<Person[]> {
        const persons = keywords ? 
            await this.personService.getAllActorsByKeywords(page, limit, keywords) :
            await this.personService.getAllActors(page, limit);
        return persons;
    }

    @Get('/directors')
    async getAllDirectors(
        @Query('keywords') keywords: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ): Promise<Person[]> {
        const persons = keywords ? 
            await this.personService.getAllDirectorsByKeywords(page, limit, keywords) :
            await this.personService.getAllDirectors(page, limit);
        return persons;
    }

    @Get('/staff')
    async getAllStaff(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ): Promise<Person[]> {
        const persons = await this.personService.getAllStaff(page, limit);
        return persons;
    }

    @Get('/:movieId')
    async getPersonsByMovieId(@Param('movieId') movieId: number): Promise<Person[]> {
        const persons = await this.personService.getPersonsByMovieId(movieId);
        return persons;
    }
}
