import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicPageModule } from 'ionic-angular';

import { ManageAuthentificationPage } from './manage-authentification';
import { RoutingService } from '../../routing-service/routing-service';

@NgModule({
  imports: [
    BrowserModule,
    IonicPageModule.forChild(ManageAuthentificationPage)
  ],
  declarations: [
    ManageAuthentificationPage
  ],
  exports: [
    ManageAuthentificationPage
  ],
  entryComponents: [
    ManageAuthentificationPage
  ],
  providers: [
    RoutingService
  ]
})

export class ManageAuthentificationModule { }