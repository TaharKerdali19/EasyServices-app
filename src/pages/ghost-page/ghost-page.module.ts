import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicPageModule } from 'ionic-angular';

import { GhostPage } from './ghost-page';

@NgModule({
  imports: [
    BrowserModule,
    IonicPageModule.forChild(GhostPage)
  ],
  declarations: [
    GhostPage
  ],
  exports: [
    GhostPage
  ],
  entryComponents: [
    GhostPage
  ]
})

export class GhostPageModule {  }