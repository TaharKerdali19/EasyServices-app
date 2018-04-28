import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';

import * as moment from 'moment';

import { RequestServicePage } from '../request-service/request-service';
import { ActiveServicesRequestsService } from '../active-services-requests/active-services-requests.service';
import { RequestService, ServiceCategories } from '../request-service/request-service.models';
import { RequestServiceService } from '../request-service/request-service.service';
import { Provider } from '../active-services-requests/active-services-requests.models';
import { RoutingService } from '../../routing-service/routing-service';
import { GhostPage } from '../ghost-page/ghost-page';
import { EmptyDetailPage } from './empty-detail';

@Component({
  selector: 'archive-requests-page',
  templateUrl: './archived.requests.html'
})

export class ArchivedRequestsPage {
	archivedRequestService: Array<RequestService> = [];
	connexionStatus: string;
	providers: Array<Provider>;
	serviceCategories: Array<ServiceCategories>;
	uid: string;

	constructor(public activeServicesRequestsService: ActiveServicesRequestsService, public requestServiceService: RequestServiceService,
              public routingService: RoutingService, public platform: Platform, public afAuth: AngularFireAuth, 
              public db: AngularFireDatabase, private storage: Storage) { }

	ngOnInit(): void {
    this.db.object('.info/connected').snapshotChanges().subscribe(connexionStatus => {
      this.connexionStatus = connexionStatus.payload.val() ? 'Online' : 'Offline';
      if (this.connexionStatus === 'Online') {
        this.afAuth.authState.take(1).subscribe((auth) => {
          if (auth) {
            this.uid = auth.uid;
            this.activeServicesRequestsService.loadRequestsServicesInProgress(this.uid).subscribe((data) => {
              this.requestServiceService.loadServiceCategories().subscribe((categoryData) => {
                this.activeServicesRequestsService.loadProviders().subscribe((providersData) => {

                  this.serviceCategories = categoryData;
                  this.providers = providersData;
                  this.requestsServicesDivider(data);

                  if (this.platform.is('tablet')) {
                    if (this.archivedRequestService.length) {
                      this.openRequestService(this.archivedRequestService[0]);
                    } else {
                      this.routingService.pushDetail(EmptyDetailPage, { title: 'No archived requests services' });
                    }
                  }
                });
              });
            });
          } else {
            if (this.platform.is('tablet')) {
              this.routingService.pushDetail(EmptyDetailPage, { title: 'Your are not authentified' })
            }
          }
        });
      } else {
        this.afAuth.authState.take(1).subscribe((auth) => {
          if (auth) {
            this.uid = auth.uid;
            this.storage.get('requestsServices').then((requestsServices) => {
              this.storage.get('serviceCategories').then((serviceCategories) => {
                this.storage.get('providers').then((providers) => {

                  this.serviceCategories = JSON.parse(serviceCategories);
                  this.providers = JSON.parse(providers);
                  (requestsServices) ? this.requestsServicesDivider(JSON.parse(requestsServices)) : this.onNoDetailPage();
                  
                  if (this.platform.is('tablet')) {
                    if (this.archivedRequestService.length) {
                      this.openRequestService(this.archivedRequestService[0]);
                    } else {
                      this.routingService.pushDetail(EmptyDetailPage, { title: 'No archived requests services' });
                    }
                  }
                });
              })
            });
          } else {
            if (this.platform.is('tablet')) {
              this.routingService.pushDetail(EmptyDetailPage, { title: 'Your device is offline and you are not authentified' })
            }
          }
        });
      }
    });
	}

	requestsServicesDivider(datas: Array<RequestService>): void {
		let categoryIndex: number, provider: Array<Provider>;
		this.archivedRequestService = [];

		datas.forEach((requestService) => {
			categoryIndex = this.serviceCategories.findIndex((category) => {
				if (category.id === requestService.category) {
					return true;
				}
			});
			for (let n in this.serviceCategories[categoryIndex]) {
				if (n === 'description') {
					requestService['category_description'] = this.serviceCategories[categoryIndex][n];
				}
			}
			provider = this.providers.filter((provider) => {
				if (provider.id === requestService.providerId) {
					return true;
				}
			});
      requestService.provider_name = requestService['providerId'] ? provider[0]['name'] : 'No provider for this request';
      
      if ((requestService.status !== 'In Progress') || moment(moment(requestService.appointment_date).format('YYYY-MM-DD')).isBefore(moment(new Date()).format('YYYY-MM-DD'))) {
			  this.archivedRequestService.push(requestService);
			}
		});
	}

  openRequestService(requestServiceData: RequestService): void {
    this.routingService.pushDetail(RequestServicePage, {
      requestService: requestServiceData,
      title: 'Request Service',
      isNew: false,
      uid: this.uid
    });
  }

  onNoDetailPage(): void {
    this.archivedRequestService = []; 
    if (this.platform.is('tablet')) {
      this.routingService.pushDetail(GhostPage);
    }
  }
}