import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { RequestService } from './request-service.models';
import { ServiceCategories } from './request-service.models';

@Injectable()
export class RequestServiceService {
  requestsServicesUpdated: Observable<RequestService>;
  requestServiceRef: any;
  serviceCategoriesList: Observable<ServiceCategories[]>;
  serviceCategoriesListRef = this.db.list('/serviceCategories');

  constructor(public db: AngularFireDatabase, private afAuth: AngularFireAuth) { }

  saveRequestService(requestService: RequestService): void {
    this.afAuth.authState.take(1).subscribe((auth) => {
      this.db.list(`requestsServices/${auth.uid}`).push(requestService);
    });
  }

  loadServiceCategories(): Observable<ServiceCategories[]> {
    this.serviceCategoriesList = this.serviceCategoriesListRef.snapshotChanges()
      .map((actions) => {
        return actions.map((serviceCategory) => {
          let data = serviceCategory.payload.val();
          let id = serviceCategory.key;
          return { id, ...data };
        });
      });
    return this.serviceCategoriesList;
  }
  
  cancelRequestService(requestService: RequestService): void {
    this.afAuth.authState.take(1).subscribe((auth) => {
      this.db.object(`requestsServices/${auth.uid}/${requestService['idRequestService']}`).update({
        status: 'Canceled'
      });
    });
  }

  readRequestService(uid: string, id: string): Observable<RequestService> {
    this.requestServiceRef = this.db.object(`requestsServices/${uid}/${id}`);
    this.requestsServicesUpdated = this.requestServiceRef.snapshotChanges()
      .map((doSomething) => {
        return doSomething.payload.val() ;
      });
    return this.requestsServicesUpdated;
  }
}