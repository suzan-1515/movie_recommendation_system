import { Test, TestingModule } from '@nestjs/testing';
import { RacconModule } from 'src/raccon/raccon.module';
import { MoviesService } from './movies.service';

describe('MovieService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RacconModule],
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
