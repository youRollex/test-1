import { Component, OnInit } from '@angular/core';
import { CardInterface } from '../../../interfaces/card.interface';
import { CardsService } from '../../services/cards.service';
import { OffersInterface } from '../../../interfaces/oferta.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit {

  public offers: OffersInterface[] = [];

  constructor(private cardSrv: CardsService) { }

  ngOnInit(): void {
    this.cardSrv.getOffers()
    .subscribe(offer => {
      this.offers = offer
    },
    error => {
      console.log(error);
    })
  }

  get isOpen(): boolean {
    return this.cardSrv.isOpen
  }

  openChat(): void {
    this.cardSrv.isOpen = true;
  }

  closeChat(): void {
    this.cardSrv.isOpen = false;
  }
}
