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
    async getAllPersons(@Query('keywords') keywords: string): Promise<Person[]> {
        const persons = keywords ? 
            await this.personService.getAllPersonsByKeywords(keywords) :
            await this.personService.getAllPersons() ;
        return persons;
    }

    @Get('/actors')
    async getAllActors(): Promise<Person[]> {
        const persons = await this.personService.getAllActors();
        return persons;
    }

    @Get('/directors')
    async getAllDirectors(): Promise<Person[]> {
        const persons = await this.personService.getAllDirectors();
        return persons;
    }

    @Get('/staff')
    async getAllStaff(): Promise<Person[]> {
        const persons = await this.personService.getAllStaff();
        return persons;
    }

    @Get('/:movieId')
    async getPersonsByMovieId(@Param('movieId') movieId: number): Promise<Person[]> {
        const persons = await this.personService.getPersonsByMovieId(movieId);
        return persons;
    }
}
