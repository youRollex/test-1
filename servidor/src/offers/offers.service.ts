import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CardsService } from '../cards/cards.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class OffersService {
  private readonly logger = new Logger('OffersService');

  constructor(
    private readonly cardsService: CardsService,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    try {
      const { cardId, ...cardDetails } = createOfferDto;
      const offer = this.offerRepository.create({
        ...cardDetails,
        card: await this.cardsService.findOne(cardId),
        user: user,
      });
      await this.offerRepository.save(offer);
      return offer;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const offers = await this.offerRepository.find();
    return offers;
  }

  async findOne(term: string) {
    let offer: Offer;
    if (isUUID(term)) {
      offer = await this.offerRepository.findOneBy({ id: term });
    }
    if (!offer) {
      throw new NotFoundException(`Offer with ${term} not found`);
    }
    return offer;
  }

  async findOneByUser(user: User) {
    let offers: Offer[];
    offers = await this.offerRepository.find({
      where: {
        user: { id: user.id },
      },
    });
    return offers;
  }

  async update(id: string, updateOfferDto: UpdateOfferDto) {
    const offer = await this.offerRepository.preload({
      id,
      ...updateOfferDto, // Busca el producto por el id y carga las propiedades de updateDto,
    });

    if (!offer) throw new NotFoundException(`Offer with ${id} not found`);

    try {
      await this.offerRepository.save(offer);
      return offer;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const offer = await this.findOne(id);
    await this.offerRepository.remove(offer);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server log',
    );
  }

  async deleteAll() {
    const query = this.offerRepository.createQueryBuilder('offer');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
