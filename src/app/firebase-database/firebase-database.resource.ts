import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PoNotificationService} from '@po-ui/ng-components';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseResource {

  constructor(
    private db: AngularFireDatabase,
    public poNotification: PoNotificationService
  ) { }

  get(url: string): Observable<any> {
    return this.db.list(url)
      .snapshotChanges()
      .pipe(
        map(changes => {
          console.log('changes', changes);
          return changes;
         // return changes.map( c => ({key: c.payload.key, ...c.payload.val() as {} }));
        }));
  }

  getById(url: string, key: string, columnCompare: string): Observable<any> {
    return this.get(url).pipe(
      map(allItems => {
        if (allItems) {
          return allItems.find(x => x[columnCompare] === key);
        }
        return allItems;
      })
    );
  }

  insert(url: string, data: any): Promise<string> {
    console.log('insert');
    return this.db.list(url)
      .push(data)
      .then( result => {
        this.poNotification.success('Salvo com sucesso!');
        return result?.key;
      })
      .catch((error) => {
        this.poNotification.success(`Erro ao salvar: ${error}`);
        return null;
      });
  }

  update(url: string, data: any): Promise<any> {
    return this.db.list(url)
      .update(data.key, data)
      .then((result) => {
        this.poNotification.success('Atualizado com sucesso!');
        return result;
      })
      .catch((error) => {
        this.poNotification.success(`Erro ao salvar: ${error}`);
        return error;
      });
  }
}
