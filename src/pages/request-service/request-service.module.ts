import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicPageModule } from 'ionic-angular';

import { RequestServicePage } from './request-service';
import { RequestServiceService } from './request-service.service';
import { RoutingService } from '../../routing-service/routing-service';

@NgModule({
  imports: [
    BrowserModule,
    IonicPageModule.forChild(RequestServicePage)
  ],
  declarations: [
    RequestServicePage
  ],
  exports: [
    RequestServicePage
  ],
  entryComponents: [
    RequestServicePage
  ],
  providers: [
    RequestServiceService,
    RoutingService
  ]
})

export class RequestServiceModule { }