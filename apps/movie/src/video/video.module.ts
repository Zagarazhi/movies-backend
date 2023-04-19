import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Video } from "@app/common";
import { Movie } from "@app/common";
import { VideoService } from "./video.service";
import { VideoController } from "./video.controller";

@Module({
    imports: [
        SequelizeModule.forFeature([Video, Movie]),
    ],
    controllers: [VideoController],
    providers: [VideoService],
    exports: [VideoService],
})
export class VideoModule {}