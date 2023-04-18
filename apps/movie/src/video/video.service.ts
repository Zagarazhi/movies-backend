import { Video } from "@app/common";
import { CreateVideoDto } from "@app/common/movies-shared/dto/create-video.dto";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class VideoService {
    constructor(@InjectModel(Video) private videoRepository: typeof Video) {}

    async createAll(videoDtos: CreateVideoDto[], movieId: number): Promise<Video[]> {
        const videos = [];

        for(const dto of videoDtos) {
            const video = await this.videoRepository.create({...dto, movieId});
            videos.push(video);
        }

        return videos;
    }
}