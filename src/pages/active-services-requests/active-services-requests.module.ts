import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicPageModule } from 'ionic-angular';

import { ActiveServicesRequestsPage } from './active-services-requests';
import { ActiveServicesRequestsService } from './active-services-requests.service';
import { RequestServiceService } from '../request-service/request-service.service';
import { RoutingService } from '../../routing-service/routing-service';

@NgModule({
  declarations: [
    ActiveServicesRequestsPage
  ],
  imports: [
    BrowserModule,
    IonicPageModule.forChild(ActiveServicesRequestsPage)
  ],
  exports: [
    ActiveServicesRequestsPage
  ],
  entryComponents: [
    ActiveServicesRequestsPage
  ],
  providers: [
    ActiveServicesRequestsService,
    RequestServiceService,
    RoutingService
  ]
})

export class ActiveServicesRequestsModule { }