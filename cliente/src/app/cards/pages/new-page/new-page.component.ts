import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CardsService } from '../../services/cards.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OffersInterface } from '../../../interfaces/oferta.interface';
import { switchMap } from 'rxjs';
import { CardInterface } from '../../../interfaces/card.interface';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css'
})
export class NewPageComponent implements OnInit {

  // Formulario reactivo
  public cardForm = new FormGroup({
    cardId: new FormControl<string>('', { nonNullable: true }),
    description: new FormControl<string>('', { nonNullable: true }),
    condition: new FormControl<string>('', { nonNullable: true }),
    price: new FormControl<number>(0, { nonNullable: true }),
  });


  constructor(
    private cardSrv: CardsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
  ) { }

  get currentCard(): OffersInterface {
    const card = this.cardForm.value as OffersInterface;
    return card;
  }

  public card!: any
  public cards: CardInterface[] = [];
  // Se velida si es nuevo registro o se va a editar
  // En caso de editarse va a cargar la informacion del personaje
  ngOnInit(): void {
    this.cardSrv.getCards()
    .subscribe( card => {
      this.cards = card;
    },
  error => {
    console.log('Error al obtener las tarjetas:', error);
  })

    if (!this.router.url.includes('edit')) {
      return;
    }
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.cardSrv.getOfferById(id))
      ).subscribe(card => {
        if (!card) {
          return this.router.navigateByUrl('/');
        }
        this.card = card
        this.cardForm.reset(card);
        return;
      })
  }

  // Para cuando se envie el formulario
  onSubmit(): void {
    // if (this.cardForm.invalid) return;
    const cardId = this.cardForm.controls['cardId'].value
    const description = this.cardForm.controls['description'].value
    const condition = this.cardForm.controls['condition'].value
    const price = this.cardForm.controls['price'].value
    this.cardSrv.addOffer(cardId, description, condition, price)

      .subscribe(card => {
        // Navegara a la pagina de edicion del nuevo heroe
        this.router.navigate(['/cards/edit', card.id])
        this.showSnackbar(`${this.card.card.name} creado!`)
        console.log('creado');

      })
  }

  // SnackBar
  showSnackbar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500,
    })
  }
}
