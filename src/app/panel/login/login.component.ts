import { FirebaseDatabaseResource } from './../../firebase-database/firebase-database.resource';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login: string;
  password: string;
  email = '';

  constructor(
    private router: Router,
    private firebaseDbRsc: FirebaseDatabaseResource,
    private angularFireAuth: AngularFireAuth
    ) {}

  ngOnInit(): void {
 
  }  

  confirmClick(): void {
    if (this.login && this.password) {
      this.findUser(this.login);
    }
  }

  findUser(loginData: string): any {
    // TODO: FAZER LOGIN TESTE APESAR UTILIZANDO O JSON E STORAGE
    this.angularFireAuth.signInWithEmailAndPassword(this.login, this.password)
      .then(value => {
        console.log('login', value);
        this.router.navigateByUrl('menu');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  newLogin(): void {
    this.firebaseDbRsc.insert('user', {
      name: this.login,
      password: this.password,
      email: this.email
    });
  }
}
