import { FirebaseDatabaseResource } from './../../firebase-database/firebase-database.resource';
import {Component} from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  login: string;
  password: string;
  email = '';

  constructor(
    private router: Router,
    private firebaseDbRsc: FirebaseDatabaseResource
    ) {}

  confirmClick(): void {
    if (this.login && this.password) {
      this.findUser(this.login);
    }
  }

  findUser(name: string): any {
    this.router.navigateByUrl('register');
  }

  newLogin(): void {
    this.firebaseDbRsc.insert('user', {
      name: this.login,
      password: this.password,
      email: this.email
    });
  }
}
