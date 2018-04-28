import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicPageModule } from 'ionic-angular';

import { AccountPage } from './account';
import { RoutingService } from '../../routing-service/routing-service';

@NgModule({
  imports: [
    IonicPageModule.forChild(AccountPage),
    BrowserModule
  ],
  declarations: [
    AccountPage
  ],
  exports: [
    AccountPage
  ],
  entryComponents: [
    AccountPage
  ],
  providers: [
    RoutingService
  ]
})

export class AccountModule {  }