import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Card } from '../../cards/entities/card.entity';
import { OfferCondition } from './offer-condition.enum';

@Entity({ name: 'offer' })
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.offers, { eager: true })
  user: User;

  @OneToOne(() => Card, { eager: true })
  @JoinColumn()
  card: Card;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: OfferCondition,
  })
  condition: OfferCondition;

  @Column('float', {
    default: 0,
  })
  price: number;
}
