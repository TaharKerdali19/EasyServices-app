import { Component } from '@angular/core';
import { Platform, NavParams, AlertController  } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';

import * as moment from 'moment';

import { RequestServicePage } from '../request-service/request-service';
import { ActiveServicesRequestsService } from './active-services-requests.service';
import { RequestService, ServiceCategories } from '../request-service/request-service.models';
import { RequestServiceService } from '../request-service/request-service.service';
import { Provider } from './active-services-requests.models';
import { RoutingService } from '../../routing-service/routing-service';
import { ManageAuthentificationPage } from '../manage-autehtification/manage-authentification';
import { GhostPage } from '../ghost-page/ghost-page';
import { EmptyDetailPage } from '../archived-requests/empty-detail';

@Component({
  selector: 'active-services-requests-page',
  templateUrl: './active-services-requests.html'
})

export class ActiveServicesRequestsPage {
  connexionStatus: string;
  providers: Array<Provider>;
  serviceCategories: Array<ServiceCategories>;
  toDayRequestService: Array<RequestService> = [];
  uid: string;
  waitingForRequestService: Array<RequestService> = [];

  constructor(public activeServicesRequestsService: ActiveServicesRequestsService, public requestServiceService: RequestServiceService, 
              private navParams: NavParams, public routingService: RoutingService, public platform: Platform, 
              public afAuth: AngularFireAuth, public db: AngularFireDatabase, private storage: Storage, public alertCtrl: AlertController) { }

  ngOnInit(): void {
    this.db.object('.info/connected').snapshotChanges().subscribe(isConnexion => {
      this.connexionStatus = isConnexion.payload.val() ? 'Online' : 'Offline';
      if (this.connexionStatus === 'Online') {
          this.afAuth.authState.take(1).subscribe((auth) => {
            if (auth) {
              this.uid = auth.uid;
              this.activeServicesRequestsService.loadRequestsServicesInProgress(auth.uid).subscribe((requestsServices) => {
                this.requestServiceService.loadServiceCategories().subscribe((serviceCategoriesData) => {
                  this.activeServicesRequestsService.loadProviders().subscribe((providersData) => {
                    
                    this.serviceCategories = serviceCategoriesData;
                    this.providers = providersData;
                    this.requestsServicesDivider(requestsServices);
                    
                    this.onLocalStorage(requestsServices, serviceCategoriesData, providersData);
                    
                    if (this.platform.is('tablet')) {
                      if (this.navParams.data.reason != 'newRequestService') {
                        if (this.toDayRequestService.length) {
                          this.openRequestService(this.toDayRequestService[0]);
                        } else {
                          if (this.waitingForRequestService.length) {
                            this.openRequestService(this.waitingForRequestService[0]);
                          } else {
                            this.newRequestService();
                          }
                        }
                      } else {
                        this.newRequestService();
                      }
                    } else {
                      if (this.navParams.data.reason === 'newRequestService') {
                        this.newRequestService();
                        this.navParams.data.reason = '';
                      }
                    }
                  });
                });
              });
            } else {
              if (this.platform.is('tablet')) {
                this.routingService.pushDetail(EmptyDetailPage, { title: 'Your are not authentified' });
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
                    if (this.toDayRequestService.length) {
                      this.openRequestService(this.toDayRequestService[0]);
                    } else {
                      if (this.waitingForRequestService.length) {
                        this.openRequestService(this.waitingForRequestService[0]);
                      } else {
                        this.routingService.pushDetail(EmptyDetailPage, { title: 'No requests services in progress' });
                      }
                    }
                  }
                });
              })
            });
          } else {
            if (this.platform.is('tablet')) {
              this.routingService.pushDetail(EmptyDetailPage, { title: 'Your device is offline and you are not authentified' });
            }
          }
        });
      }
    });
  }

  onLocalStorage(requestsServices: Array<RequestService>, serviceCategories: Array<ServiceCategories>, providers: Array<Provider>): void {
    this.storage.set('requestsServices', JSON.stringify(requestsServices));
    this.storage.set('serviceCategories', JSON.stringify(serviceCategories));
    this.storage.set('providers', JSON.stringify(providers));
  }

  requestsServicesDivider(requestsServices: Array<RequestService>): void {
    let categoryIndex: number, provider: Array<Provider>;
    this.toDayRequestService = [];
    this.waitingForRequestService = [];
    
    requestsServices.forEach((requestService) => {
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
      requestService.provider_name = requestService['providerId'] ? provider[0]['name'] : 'Waiting for provider';

      if (moment(moment(requestService.appointment_date).format('YYYY-MM-DD')).isSame(moment(new Date()).format('YYYY-MM-DD')) && requestService.status === 'In Progress') {
        this.toDayRequestService.push(requestService);
      } else {
        if (moment(moment(requestService.appointment_date).format('YYYY-MM-DD')).isAfter(moment(new Date()).format('YYYY-MM-DD')) && requestService.status === 'In Progress') {
          this.waitingForRequestService.push(requestService);
        }
      }
    });
  }

  newRequestService(): void {
    let alert;
    if (this.connexionStatus === 'Online') {
      this.afAuth.authState.take(1).subscribe((auth) => {
        if (auth) {
          this.routingService.pushDetail(RequestServicePage, {
            title: 'New Request Service',
            isNew: true, 
            reason: '',
            uid: auth.uid
          });
        } else {
          this.routingService.DeActiveSplitePane();
          this.routingService.masterNav.setRoot(ManageAuthentificationPage, {
            page: ActiveServicesRequestsPage,
            reason: 'newRequestService',
            uid: ''
          });
        }
      }); 
    } else {
        alert = this.alertCtrl.create({
          title: 'Alert',
          subTitle: 'You must connect your device to internet to send a New Request Service',
          buttons: ['OK']
        });
        alert.present();
    }
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
    this.toDayRequestService = []; 
    this.waitingForRequestService = [];
    if (this.platform.is('tablet')) {
      this.routingService.pushDetail(GhostPage);
    }
  }
 }