import { Component } from '@angular/core';
import { NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';

import { RoutingService } from '../../routing-service/routing-service';
import { ActiveServicesRequestsPage } from '../../pages/active-services-requests/active-services-requests';
import { AuthFormControls } from './manage-authentification.models';

@Component({
  selector: 'manage-authentification-page',
  templateUrl: './manage-authentification.html'
})

export class ManageAuthentificationPage {
  form: FormGroup;
  reason: string;
  authFormControls: AuthFormControls = new AuthFormControls();
  
  constructor(public navParams: NavParams, private routingService: RoutingService, private fb: FormBuilder, 
              private afAuth: AngularFireAuth, public alertCtrl: AlertController) { 
    this.reason = this.navParams.data.reason;
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      mail: ['', this.authFormControls.correctMail(/^[a-z1-9-_.]+@[a-z1-9._-]+\.[a-z]{2,6}$/)],
      password: [{value: ''}, Validators.minLength(6)]
    });
  }

  get mail() { return this.form.get('mail'); }

  async logIn(): Promise<any> {
    let alert;
    try {
      const authentification = await this.afAuth.auth.signInWithEmailAndPassword(this.form.value['mail'], this.form.value['password']);
      if (authentification) {
        this.BackToRoot();
      }
    } 
    catch (error) {
      if (error['code'] === 'auth/user-not-found') {
        alert = this.alertCtrl.create({
          title: 'Alert',
          subTitle: 'The user is not founded',
          buttons: ['OK']
        });
        alert.present();
      }
      if (error['code'] === 'auth/wrong-password') {
        alert = this.alertCtrl.create({
          title: 'Alert',
          subTitle: 'The password is not correct',
          buttons: ['OK']
        });
        alert.present();
      }
    }
  }
	
  async signIn(): Promise<any> {
    let alert;
    try {
      const authentification = await this.afAuth.auth.createUserWithEmailAndPassword(this.form.value['mail'], this.form.value['password']);
      if (authentification) { 
        this.BackToRoot();
      }
    } 
    catch (error) {
      if (error['code'] === 'auth/email-already-in-use') {
        alert = this.alertCtrl.create({
          title: 'Alert',
          subTitle: 'The email is already in use',
          buttons: ['OK']
        });
        alert.present();
      }
    }
  }

  OnCancel(): void {
    this.routingService.ActivateSplitPane();
    this.routingService.masterNav.setRoot(ActiveServicesRequestsPage);
  }

  BackToRoot(): void {
    (this.navParams.data.reason === 'Account') ?  this.routingService.DeActiveSplitePane() : this.routingService.ActivateSplitPane();
    this.routingService.masterNav.setRoot(this.navParams.data.page, { reason: this.navParams.data.reason });
  }
 }