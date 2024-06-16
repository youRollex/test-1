import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService, containsNumberValidator, containsUpperCaseValidator } from '../../../shared/services/validators.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  public errorMessage: string = '';
  public registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    name: ['', [Validators.required]],
    password: ['', [Validators.required, containsNumberValidator(), containsUpperCaseValidator(), Validators.minLength(6)]],
    question: ['', [Validators.required]],
    answer: ['', [Validators.required]],
  })

  constructor(
    private validatorSrv: ValidatorsService,
    private fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ){}

  isValidField( field:string ){
    return this.validatorSrv.isValidField( this.registerForm, field)
  }

  onSubmit(){
    this.registerForm.markAllAsTouched();
    const email = this.registerForm.controls['email'].value;
    const name = this.registerForm.controls['name'].value;
    const password = this.registerForm.controls['password'].value;
    const question = this.registerForm.controls['question'].value;
    const answer = this.registerForm.controls['answer'].value;
    this.authSrv.register(email, name, password, question, answer)
    .subscribe(
      (data) => {
        this.snackBar.open("Cuenta creada con exito!", '', {duration:5000})
        this.router.navigate(['./auth/login'])
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Credenciales incorrectas. Intentalo de nuevo'
      }
    )
  }
}
