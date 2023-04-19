import { Controller } from "@nestjs/common";
import { CountryService } from "./country.service";
import { MessagePattern } from "@nestjs/microservices";
import { Country } from "@app/common";
import { CreateCountryDto } from "@app/common";

@Controller('/movies')
export class CountryController {
    constructor(private countryService: CountryService) {}

    @MessagePattern({cmd: 'country'})
    async createCountry(data: CreateCountryDto) : Promise<Country> {
        return this.countryService.createCountry(data);
    }
}