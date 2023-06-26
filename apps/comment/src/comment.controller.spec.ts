import { Test } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { AccessTokenStrategy, Comment, CreateCommentDto, GoogleStrategy, RefreshTokenStrategy, UpdateCommentDto, VKStrategy, WriteCommentDto } from '@app/common';
import { Request } from 'express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

describe('CommentController', () => {
    let commentController: CommentController;
    let commentService: CommentService;

    beforeEach(async () => {
            const moduleRef = await Test.createTestingModule({
                imports: [
                    ConfigModule.forRoot({
                        isGlobal: true,
                        envFilePath: '.env',
                    }),
                    SequelizeModule.forFeature([Comment]),
                    SequelizeModule.forRootAsync({
                        imports: [ConfigModule],
                        useFactory: (configService: ConfigService) => ({
                            // Конфигурация БД
                            dialect: 'postgres',
                            host: configService.get("POSTGRES_COMMENTS_HOST"),
                            port: Number(configService.get("POSTGRES_COMMENTS_PORT")),
                            username: configService.get("POSTGRES_COMMENTS_USER"),
                            password: configService.get("POSTGRES_COMMENTS_PASSWORD"),
                            database: configService.get("POSTGRES_COMMENTS_DB"),
                            models: [Comment],
                            
                            autoLoadModels: true,
                        }),
                        inject: [ConfigService],
                    }),
                ],
                controllers: [CommentController],
                providers: [CommentService, AccessTokenStrategy, RefreshTokenStrategy, GoogleStrategy, VKStrategy],
            }).compile();

        commentController = moduleRef.get<CommentController>(CommentController);
        commentService = moduleRef.get<CommentService>(CommentService);
    });

    describe('createComment', () => {
        it('Должен вызывать метод создания комментария', async () => {
            const req = {
                user: { sub: 1, login: 'admin' },
            } as unknown as Request;
            const movieId = 123;
            const dto: WriteCommentDto = {
                type: 'POSITIVE',
                title: 'test',
                description: 'test',
                repliedOnComment: 666,
            };
            const expectedResult = Comment.build({
                type: 'POSITIVE',
                title: 'test',
                description: 'test',
                repliedOnComment: 666,
            });
            const createSpy = jest.spyOn(commentService, 'create').mockResolvedValueOnce(expectedResult);

            const result = await commentController.createComment(req, movieId, dto);

            expect(createSpy).toHaveBeenCalledWith(dto, movieId, 'admin', 1);
            expect(result).toEqual(expectedResult);
        });
    });

});
