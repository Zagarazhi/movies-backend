import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Country } from "@app/common";
import { CountryController } from "./country.controller";
import { CountryService } from "./country.service";
import { MovieCountry } from "@app/common";
import { Movie } from "@app/common";

@Module({
    imports: [
        SequelizeModule.forFeature([Country, MovieCountry, Movie]),
    ],
    controllers: [CountryController],
    providers: [CountryService],
    exports: [CountryService],
})
export class CountryModule {}