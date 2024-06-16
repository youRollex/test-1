import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService, containsNumberValidator, containsUpperCaseValidator } from '../../../shared/services/validators.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit{

  public errorMessage: string = '';
  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.validatorSrv.emailPattern)]],
    password: ['', [Validators.required, containsNumberValidator(), containsUpperCaseValidator(), Validators.minLength(6) ]]
  })

  constructor(
    private fb: FormBuilder,
    private validatorSrv: ValidatorsService,
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token !== null) {
        localStorage.removeItem('token');
        console.log('Token eliminado del localStorage');
      } else {
        console.log('No se encontró ningún token en el localStorage');
      }
    } else {
      console.log('localStorage no está disponible');
    }
  }


  isValidField( field:string ){
    return this.validatorSrv.isValidField( this.loginForm, field)
  }

  onSubmit(){
    this.loginForm.markAllAsTouched();
    this.authService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
      .subscribe(
        (data) => {
          console.log("inicio sesion", data);
          this.router.navigate(['/'])
          this.errorMessage = '';
        },
        (error) => {
          console.log("Error" , error);
          this.errorMessage = 'Credenciales incorrectas. Intentalo de nuevo'
        }
      )
  }

}

