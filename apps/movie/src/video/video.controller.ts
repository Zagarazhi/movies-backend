import { Controller, Get, Param } from "@nestjs/common";
import { VideoService } from "./video.service";

@Controller('/movies')
export class VideoController {
    constructor(private videoService: VideoService) {}

    @Get('/:id/videos')
    async getAllByMovieId(@Param('id') id: number) {
        const result = this.videoService.getAllByMovieId(id);
        return result;
    }
}