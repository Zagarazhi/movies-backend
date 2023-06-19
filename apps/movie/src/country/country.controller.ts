import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { CountryService } from "./country.service";
import { MessagePattern } from "@nestjs/microservices";
import { AccessTokenGuard, Country, Roles, RolesGuard, UpdateCountryDto } from "@app/common";
import { CreateCountryDto } from "@app/common";
import { ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

@Controller('/movies')
export class CountryController {
    constructor(private countryService: CountryService) {}

    @MessagePattern({cmd: 'country'})
    async createCountry(data: CreateCountryDto) : Promise<Country> {
        return this.countryService.createCountry(data);
    }

    @ApiOperation({ summary: 'Получить все страны' })
    @ApiOkResponse({ description: 'Страны успешно получены' })
    @Get('/filters/countries')
    async getAllCountries(): Promise<Country[]> {
        return this.countryService.getAllCountries();
    }

    @ApiOperation({ summary: 'Обновить страну' })
    @ApiBody({
        type: UpdateCountryDto,
            examples: {
                example1: {
                value: {
                    id: 1,
                    nameRu: "США",
                    nameEn: "USA",
                },
                summary: 'Пример обновления страны',
                },
            },
    })
    @ApiOkResponse({ description: 'Страна успешно обновлена' })
    @Put('/update/country')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    async updateCountry(@Body() dto: UpdateCountryDto) {
        const result = await this.countryService.updateCountry(dto);
        return result;
    }
}