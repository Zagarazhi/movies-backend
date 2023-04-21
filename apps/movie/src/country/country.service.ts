import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Country } from "@app/common";
import { CreateCountryDto } from "@app/common";

@Injectable()
export class CountryService {
    constructor(@InjectModel(Country) private countryRepository: typeof Country) {}

    async createCountry(dto: CreateCountryDto) {
        const country = await this.countryRepository.create({nameRu: dto.country});
        return country;
    }

    async getAllCountries(): Promise<Country[]> {
        const countries = await this.countryRepository.findAll();
        return countries;
    }

    async createOrFindCountries(countryDtos: CreateCountryDto[]): Promise<Country[]> {
        const countries = [];
      
        for (const dto of countryDtos) {
            const [country, created] = await this.countryRepository.findOrCreate({
                where: { nameRu: dto.country },
                defaults: { nameRu: dto.country },
            });
            countries.push(country);
        }
      
        return countries;
    }
}