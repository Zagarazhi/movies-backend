import { Comment, CreateCommentDto, UpdateCommentDto, WriteCommentDto } from '@app/common';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CommentService {
    
    constructor(@InjectModel(Comment) private commentRepository: typeof Comment) {}

    async create(dto: WriteCommentDto, movieId: number, author: string, userId: number) {
        let parent: Comment;
        let parentId: number = dto.repliedOnComment;
        
        if(parentId) {
            parent = await this.commentRepository.findOne({where: {id: parentId, movieId}});
            parentId = parent ? parent.id : null;
        }
        
        const comment = await this.commentRepository.create({...dto, repliedOnComment: parentId, author, userId, movieId, date: new Date()})
        return comment;
    }

    async createMany(dtos: CreateCommentDto[]) {
        const newComments = await this.commentRepository.sequelize.transaction(async (t) => {
            const results = [];
            for (const dto of dtos) {
                const comment = await this.commentRepository.create(dto);
                results.push(comment);
            }
            return results;
        });
        return newComments;
    }

    async update(userId: number, commentId: number, dto: UpdateCommentDto): Promise<Comment> {
        const comment = await this.commentRepository.findByPk(commentId, {
            include: [
                { 
                    model: Comment, as: 'replies',
                },
            ]
        });
        if (!comment) {
            throw new NotFoundException('Комментарий не найден');
        }
        if(userId != comment.userId){
            throw new ForbiddenException('Нельзя редактировать чужой комментарий');
        }
        await comment.update(dto);
        return comment;
    }

    async getCommentsTree(movieId: number): Promise<Comment[]> {
        const comments = await this.commentRepository.findAll({
            where: {movieId, repliedOnComment: null},
            include: [
                { 
                    model: Comment, as: 'replies',
                    include : [
                        { 
                            model: Comment, as: 'replies',
                            include : [
                                { 
                                    model: Comment, as: 'replies' ,
                                },
                            ],
                        },
                    ]
                },
            ],
            order: [['date', 'ASC']]
        });
        
        return comments;
    }

    async getCommentsFlat(movieId: number): Promise<Comment[]> {
        const comments = await this.commentRepository.findAll({
            where: {movieId},
            include: [
                { 
                    model: Comment, as: 'replies',
                    attributes: [
                        'id'
                    ]
                },
            ],
            order: [['date', 'ASC']]
        });
        
        return comments;
    }

    async getComment(commentId: number): Promise<Comment> {
        const comment = await this.commentRepository.findByPk(commentId, {
            include: [
                { 
                    model: Comment, as: 'replies',
                },
            ]
        });
        
        return comment;
    }
}
