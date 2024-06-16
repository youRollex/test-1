import { Component, Input, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards.service';
import { OffersInterface } from '../../../interfaces/oferta.interface';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit{

  public imagenRuta: string = 'assets/cards/';

  constructor(private cardSrv: CardsService){}

  @Input()
  public offers!: OffersInterface;

  ngOnInit(): void {
    this.imagenRuta = this.imagenRuta + this.offers.card.imageUrl
  }
}
