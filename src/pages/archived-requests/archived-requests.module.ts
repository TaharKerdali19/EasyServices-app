import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicPageModule } from 'ionic-angular';

import { ArchivedRequestsPage } from './archived-requests';
import { EmptyDetailPage } from './empty-detail';

@NgModule({
  imports: [
    BrowserModule,
    IonicPageModule.forChild(ArchivedRequestsPage)
  ],
  declarations: [
    ArchivedRequestsPage,
    EmptyDetailPage
  ],
  exports: [
    ArchivedRequestsPage,
    EmptyDetailPage
  ],
  entryComponents: [
    ArchivedRequestsPage,
    EmptyDetailPage
  ]
})

export class ArchivedRequestsModule { }
