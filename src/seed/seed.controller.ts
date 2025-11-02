import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  async runSeed() {
    await this.seedService.runSeed();
    return { ok: true, message: 'Seed ejecutado correctamente' };
  }
}
