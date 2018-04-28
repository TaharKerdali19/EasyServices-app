import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { ToastController } from 'ionic-angular';

import { Account, AccountFormControls } from './account.models';
import { RoutingService } from '../../routing-service/routing-service';
import { ActiveServicesRequestsPage } from '../../pages/active-services-requests/active-services-requests';

@Component({
  selector: 'account-page',
  templateUrl: './account.html'
})

export class AccountPage {
  account: Account;
  accountFormControls: AccountFormControls = new AccountFormControls();
  accountRef: AngularFireObject<any>;
  form: FormGroup;

  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth, private db: AngularFireDatabase, 
              private routingService: RoutingService, private toastController: ToastController) {
    this.createForm();
  }

  ngOnInit(): void {
    this.afAuth.authState.take(1).subscribe((auth) => {
      if (auth) {
        this.accountRef = this.db.object(`account/${auth.uid}`);
        this.accountRef.snapshotChanges().subscribe((action) => {
          this.account = action.payload.val();
          if (this.account) {
            this.showForm(action.payload.val());
          }
        });
      }
    });
  }
  
  createForm(): void {
    this.form = this.fb.group({
      lastName: [{ value: '' }, Validators.required],
      firstName: [{ value: '' }, Validators.required],
      address: { value: '' },
      postalCode: ['', this.accountFormControls.correctPostalCode(/^[A-Z]{1}[0-9]{1}[A-Z]{1}\s[0-9]{1}[A-Z]{1}[0-9]{1}$/)],
      phoneNumber: ['', this.accountFormControls.correctCell(/^[0-9]{3,3}-[0-9]{3,3}-[0-9]{4,4}$/)]
    });
  }

  get phoneNumber() { return this.form.get('phoneNumber'); }
  get postalCode() { return this.form.get('postalCode'); }

  showForm(account: Account): void {
    this.form.patchValue({
      lastName: account.lastName,
      firstName: account.firstName,
      address: account.address,
      postalCode: account.postalCode,
      phoneNumber: account.phoneNumber
    });
  }

  saveProfile(account: Account): void {
    this.afAuth.authState.take(1).subscribe((auth) => {
      if (!this.account) {
        account.status = ''
        this.db.object(`account/${auth.uid}`).set(account);
        this.toastController.create({
          message: 'The account has been saved with succes',
          position: 'bottom',
          duration: 2500
        }).present();
      } else {
        this.db.object(`account/${auth.uid}`).update({
          lastName: account.lastName,
          firstName: account.firstName,
          address: account.address,
          postalCode: account.postalCode,
          phoneNumber: account.phoneNumber
        });
        this.toastController.create({
          message: 'The account has been updated with succes',
          position: 'bottom',
          duration: 2500
        }).present();
      }
    });
  }

  cancel(): void {
    this.routingService.ActivateSplitPane();
    this.routingService.masterNav.setRoot(ActiveServicesRequestsPage);
  }

  logOut(): void {
    this.afAuth.auth.signOut();
    this.routingService.ActivateSplitPane();
    this.routingService.masterNav.setRoot(ActiveServicesRequestsPage);
  }
 }