import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

import { RequestService } from '../request-service/request-service.models';
import { Provider } from './active-services-requests.models';

@Injectable()
export class ActiveServicesRequestsService {
  providersList: Observable<Provider[]>;
  providersListRef = this.db.list('/providers');
  requestsServicesList: Observable<RequestService[]>;
  requestsServicesListRef: any;

  constructor(public db: AngularFireDatabase, public afAuth: AngularFireAuth) { }
  
  loadRequestsServicesInProgress(uid: string): Observable<RequestService[]> {
    this.requestsServicesListRef = this.db.list(`requestsServices/${uid}`);
      if (this.requestsServicesListRef) {
        this.requestsServicesList = this.requestsServicesListRef.snapshotChanges()
          .map((actions) => {
            return actions.map((requestService) => {
              let dataRequestService = requestService.payload.val();
              let idRequestService = requestService.key; 
                return { idRequestService, ...dataRequestService };
            });
          });
      }
    return this.requestsServicesList;
  }

  loadProviders(): Observable<Provider[]> {
    this.providersList = this.providersListRef.snapshotChanges()
      .map((actions) => {
        return actions.map((provider) => {
          let data = provider.payload.val();
          let id = provider.key;
          return { id, ...data };
        });
      });
    return this.providersList;
  }
}