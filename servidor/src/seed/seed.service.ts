import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { OffersService } from '../offers/offers.service';
import { Repository } from 'typeorm';
import { CardsService } from '../cards/cards.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly offersService: OffersService,
    private readonly cardsService: CardsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewCards();
    return 'SEDD EXECUTED';
  }

  private async deleteTables() {
    await this.offersService.deleteAll();
    await this.cardsService.deleteAll();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertNewCards() {
    await this.cardsService.deleteAll();
    const cards = initialData.cards;

    const insertPromises = [];

    cards.forEach((cards) => {
      insertPromises.push(this.cardsService.create(cards));
    });

    const results = await Promise.all(insertPromises);

    return true;
  }
}
