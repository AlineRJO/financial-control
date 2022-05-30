import { FirebaseDatabaseResource } from './../../firebase-database/firebase-database.resource';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { StorageService } from '../../service/storage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login: string;
  password: string;
  email: string;

  constructor(
    private router: Router,
    private firebaseDbRsc: FirebaseDatabaseResource,
    private angularFireAuth: AngularFireAuth,
    private storageService: StorageService
    ) {}

  ngOnInit(): void {
 
  }  

  confirmClick(): void {
    if (this.login && this.password) {
      this.authUser();
    }
  }

  authUser(): any {
    // TODO: FAZER LOGIN TESTE APESAR UTILIZANDO O JSON E STORAGE
    this.angularFireAuth.signInWithEmailAndPassword(this.login, this.password)
      .then(value => {
        console.log('login', value);
        this.storageService.setCurrentUser(value.user.uid);
        
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
