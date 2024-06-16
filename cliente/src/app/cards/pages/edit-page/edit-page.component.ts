import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CardsService } from '../../services/cards.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OffersInterface } from '../../../interfaces/oferta.interface';
import { filter, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.css'
})
export class EditPageComponent implements OnInit{

  public imagenRuta: string = 'assets/cards/';
public offer!: OffersInterface
public cardForm = new FormGroup({
  condition: new FormControl<string>(''),
  price: new FormControl<number>(0, { nonNullable: true }),
});


constructor(
  private cardSrv: CardsService,
  private activatedRoute: ActivatedRoute,
  private router: Router,
  private snackbar: MatSnackBar,
  private dialog: MatDialog
){}

get currentCard(): OffersInterface {
  const card = this.cardForm.value as OffersInterface;
  return card;
}

ngOnInit(): void {
  if( !this.router.url.includes('edit')){
    return;
  }
  this.activatedRoute.params
  .pipe(
    switchMap( ({ id }) => this.cardSrv.getOfferById(id) )
  ).subscribe( card => {
    if( !card ){
      return this.router.navigateByUrl('/');
    }
    this.offer = card
    this.imagenRuta = this.imagenRuta + this.offer.card.imageUrl

    this.cardForm.reset(card);
    return;
  })
}

// Para cuando se envie el formulario
onSubmit(): void {
  if ( this.cardForm.invalid ) return;

  // Si tiene un id va a actualizar el registro
  if (this.offer.id) {
    this.cardSrv.updateOfferById(this.offer.id, this.currentCard.condition, this.currentCard.price)
    .subscribe(card => {
      console.log('Update');
        this.showSnackbar(`${this.offer.card.name} actualizado!`);
      });
    return;
  }
  // si no hay id, se quiere crear nuevo registro
  this.cardSrv.addOffer( this.offer.id, this.offer.description, this.currentCard.condition, this.currentCard.price )

  .subscribe( card => {
      // Navegara a la pagina de edicion del nuevo heroe
      this.router.navigate(['/cards/edit', card.id])
      this.showSnackbar(`${this.offer.card.name } creado!`)
    })
}

onDeleteHero(){
  if( !this.offer.id) throw Error('Hero id is required');

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: this.cardForm.value
  });

  dialogRef.afterClosed()
    .pipe(
      filter( (result: boolean) => result ),
      switchMap(() => this.cardSrv.deleteOfferById(this.offer.id)),
      filter( (wasDeleted: boolean) => wasDeleted ),
    )
    .subscribe(result => {
      this.router.navigate(['/cards']);
    })

    // FUNCIONA PERO NO ES LO ADECUADO, VER LO DE ARRIBA
  // dialogRef.afterClosed().subscribe(result => {
  //   if( !result ) return;
  //   this.heroService.deleteHeroById(this.currentHero.id)
  //     .subscribe(wasDeleted => {
  //       if(wasDeleted)
  //         this.router.navigate(['/heroes']);
  //     })
  // });
}

// SnackBar
showSnackbar(message: string): void{
  this.snackbar.open(message, 'done', {
    duration: 2500,
  })
}
}
