import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CardsModule } from '../cards/cards.module';
import { AuthModule } from '../auth/auth.module';
import { OffersModule } from '../offers/offers.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [CardsModule, AuthModule, OffersModule],
})
export class SeedModule {}
