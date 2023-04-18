import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Video } from "@app/common";
import { Movie } from "@app/common";
import { VideoService } from "./video.service";

@Module({
    imports: [
        SequelizeModule.forFeature([Video, Movie]),
    ],
    providers: [VideoService],
    exports: [VideoService],
})
export class VideoModule {}