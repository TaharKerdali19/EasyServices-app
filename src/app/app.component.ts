import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { ActiveServicesRequestsPage } from '../pages/active-services-requests/active-services-requests';
import { RoutingService } from '../routing-service/routing-service';
import { GhostPage } from '../pages/ghost-page/ghost-page';
import { AccountPage } from '../pages/account/account';
import { ArchivedRequestsPage } from '../pages/archived-requests/archived-requests';
import { ManageAuthentificationPage } from '.././pages/manage-autehtification/manage-authentification';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  connexionStatus: string;
  detailPage: any = null;
  masterPage: any = null;
  pages: Array<{title: string, page: any, icon: string}> = [];
  uid: string;
  @ViewChild('masterNav') masterNav: Nav;
  @ViewChild('detailNav') detailNav: Nav; 

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public db: AngularFireDatabase,
              private routingService: RoutingService, public afAuth: AngularFireAuth, public alertCtrl: AlertController) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.pages = [
        { title: 'Active Services Requests', page: ActiveServicesRequestsPage, icon: 'list' },
        { title: 'Account', page: AccountPage, icon: 'contact' },
        { title: 'Archived Requests', page: ArchivedRequestsPage, icon: 'folder' },
      ];
  
      this.routingService.masterNav = this.masterNav;
      this.routingService.detailNav = this.detailNav;

      this.masterNav.setRoot(ActiveServicesRequestsPage);
      this.detailNav.setRoot(GhostPage);
    });
  }

  openPage(page: any): void {
    (page.title === 'Account') ? this.openAccountPage(page) : this.openOtherPage(page);
  }

  openActiveServicesRequests(): void {
    this.routingService.ActivateSplitPane();
    this.masterNav.setRoot(ActiveServicesRequestsPage);
  }

  openAccountPage(page: any): void {
    let alert;
    this.db.object('.info/connected').snapshotChanges().take(1).subscribe(isConnexion => {
      this.connexionStatus = isConnexion.payload.val() ? 'Online' : 'Offline';
      if (this.connexionStatus === 'Online') {
        this.afAuth.authState.take(1).subscribe((auth) => {
          if (auth) {
            this.routingService.DeActiveSplitePane();
            this.routingService.masterNav.setRoot(AccountPage);
          } else {
            this.routingService.DeActiveSplitePane();
            this.routingService.masterNav.setRoot(ManageAuthentificationPage, {
              page: AccountPage,
              reason: 'Account'
            }); 
          }
        });
      } else {
        alert = this.alertCtrl.create({
          title: 'Alert',
          subTitle: 'You must connect your device to internet to show Account page',
          buttons: ['OK']
        });
        alert.present();
      }
    });
  }

  openOtherPage(page: any): void {
    this.routingService.ActivateSplitPane();
    this.masterNav.setRoot(page.page)
  }
  
  getValue(): boolean {
    return this.routingService.StatusSplitPane();
  }
}

