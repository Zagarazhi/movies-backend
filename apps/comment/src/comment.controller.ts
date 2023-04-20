import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto, WriteCommentDto } from '@app/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @MessagePattern({cmd: 'comment'})
    async addComments(dtos: CreateCommentDto[]) {
        const result = await this.commentService.createMany(dtos);
        return result;
    }

    @Post('/:movieId')
    async createComment(@Param('movieId') movieId: number, @Body() dto: WriteCommentDto) {
        const result = await this.commentService.create(dto, movieId, 'test', 1);
        return result;
    }

    @Get('/:movieId/tree')
    async getCommentsByMovieIdTree(@Param('movieId') movieId: number) {
        const result = await this.commentService.getCommentsTree(movieId);
        return result;
    }

    @Get('/:movieId/flat')
    async getCommentsByMovieIdFlat(@Param('movieId') movieId: number) {
        const result = await this.commentService.getCommentsFlat(movieId);
        return result;
    }

    @Get('/comment/:commentId')
    async getComment(@Param('commentId') commentId: number) {
        const result = await this.commentService.getComment(commentId);
        return result;
    }

    @Put('/comment/:commentId')
    async updateComment(@Param('commentId') commentId: number, @Body() dto: UpdateCommentDto) {
        const result = await this.commentService.update(commentId, dto);
        return result;
    }
}
