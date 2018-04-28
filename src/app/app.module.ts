import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { MyApp } from './app.component';
import { RequestServiceModule } from '../pages/request-service/request-service.module';
import { ActiveServicesRequestsModule } from '../pages/active-services-requests/active-services-requests.module';
import { RoutingService } from '../routing-service/routing-service';
import { GhostPageModule } from '../pages/ghost-page/ghost-page.module';
import { AccountModule } from '../pages/account/account.module';
import { ArchivedRequestsModule } from '../pages/archived-requests/archived-requests.module';
import { ManageAuthentificationModule } from '../pages/manage-autehtification/manage-authentification.module';

var config = {
    apiKey: "AIzaSyBceyaug7vjvtaMQroxCBXVhWCkrTyr1pY",
    authDomain: "easyservices-mgl7310.firebaseapp.com",
    databaseURL: "https://easyservices-mgl7310.firebaseio.com",
    projectId: "easyservices-mgl7310",
    storageBucket: "easyservices-mgl7310.appspot.com",
    messagingSenderId: "410304183356"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RequestServiceModule,
    ActiveServicesRequestsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    GhostPageModule,
    AccountModule,
    ArchivedRequestsModule,
    ManageAuthentificationModule,
    AngularFireModule.initializeApp(config),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RoutingService,
    Camera,
    Geolocation,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
