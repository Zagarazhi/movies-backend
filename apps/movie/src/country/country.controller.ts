import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { CountryService } from "./country.service";
import { MessagePattern } from "@nestjs/microservices";
import { AccessTokenGuard, Country, Roles, RolesGuard, UpdateCountryDto } from "@app/common";
import { CreateCountryDto } from "@app/common";

@Controller('/movies')
export class CountryController {
    constructor(private countryService: CountryService) {}

    @MessagePattern({cmd: 'country'})
    async createCountry(data: CreateCountryDto) : Promise<Country> {
        return this.countryService.createCountry(data);
    }

    @Get('/filters/countries')
    async getAllCountries(): Promise<Country[]> {
        return this.countryService.getAllCountries();
    }

    @Put('/update/country')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    async updateMovie(@Body() dto: UpdateCountryDto) {
        const result = await this.countryService.updateCountry(dto);
        return result;
    }
}