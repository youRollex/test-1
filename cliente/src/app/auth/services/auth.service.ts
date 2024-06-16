import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../environments/environments';
import { User } from '../../interfaces/user.interface';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environments.deckBack;
  private user?: User;
  private tokenLogin!: string

  constructor(private http: HttpClient) { }

  get currectUser(): User|undefined {
    if(!this.user) return undefined;
    return structuredClone( this.user );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        map((data: User) => {
          localStorage.setItem('token', data.token);
          this.tokenLogin=data.token;
          this.user=data
          return data;
        }),
      )
  }

  register(email: string, name: string, password:string, question: string, answer: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/register`, { email, name, password, question, answer })
  }

  checkAuthentication():Observable<boolean>{
    if(!localStorage.getItem('token')) return of(false);
    // if(this.tokenLogin === localStorage.getItem('token')){
    //   return of(true)
    // }else{
    //   return of(false)
    // }
    return of(true)
  }

  getQuestion(email: string){
    return this.http.get(`${this.baseUrl}/auth/question/${email}`);
  }

  recoveryPassword(email: string, answer: string, password: string){
    return this.http.post(`${this.baseUrl}/auth/reset`, { email, answer, password });
  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }
}
