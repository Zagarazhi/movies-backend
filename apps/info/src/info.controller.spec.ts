import { Test, TestingModule } from '@nestjs/testing';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';

describe('InfoController', () => {
  let infoController: InfoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InfoController],
      providers: [InfoService],
    }).compile();

    infoController = app.get<InfoController>(InfoController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(infoController.getHello()).toBe('Hello World!');
    });
  });
});
