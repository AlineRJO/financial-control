import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CryptoCurrencyService {

  token = '';
  private BASE_URL = `https://min-api.cryptocompare.com/data/price?fsym=token&tsyms=USD,BRL`;

  constructor(private http: HttpClient) { }

  getTokenPrice(token: string) {
    const newUrl = this.BASE_URL.replace('token', token);
    return this.http.get(newUrl);
  }
}
