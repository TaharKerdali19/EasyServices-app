import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavParams, ToastController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { storage } from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';

import * as moment from 'moment';

import { RequestService } from './request-service.models';
import { RequestServiceService } from './request-service.service';
import { ServiceCategories } from './request-service.models';
import { RoutingService } from '../../routing-service/routing-service';

@Component({
  selector: 'request-service',
  templateUrl: './request-service.html'
})
    
export class RequestServicePage {
  address: string = '';
  connexionStatus: string;
  currentImage;
  form: FormGroup;
  isNew: boolean;
  latitude: number;
  longitude: number;
  requestService: RequestService;
  selectedPhoto;
  serviceCategories: Array<ServiceCategories> = [];
  status: any;
  statusInView: string;
  title: string;
  uid: string;
  
  constructor(private fb: FormBuilder, private requestServiceService: RequestServiceService, public navParams: NavParams, 
              public routingService: RoutingService, private toastController: ToastController, private camera: Camera,
              public db: AngularFireDatabase, private geolocation: Geolocation, private http: HTTP, public alertCtrl: AlertController) {
    this.isNew = this.navParams.data.isNew;
    this.title = this.navParams.data.title;
    this.requestService = this.navParams.data.requestService;
    this.uid = this.navParams.data.uid;
    this.createFormGroup();
  }
  
  createFormGroup(): void {
    this.form = this.fb.group({
      category: [{ value: '', disabled: !this.isNew }, Validators.required],
      appointment_date: [{ value: '', disabled: !this.isNew }, Validators.required],
      address: [{ value: '', disabled: !this.isNew }, Validators.required],
      description: { 
        value: '', 
        disabled: !this.isNew 
      },
      status: { value: 'In Progress', disabled: true }
    })
  }

  ngOnInit(): void {
    if (this.requestService) {
      this.showRequestService();
      this.requestServiceService.readRequestService(this.uid, this.requestService['idRequestService']).subscribe((data) => {
        this.statusInView = data.status;
      });
      this.db.object('.info/connected').snapshotChanges().subscribe(isConnexion => {
        this.connexionStatus = isConnexion.payload.val() ? 'Online' : 'Offline';
      });
    } else {
      if (this.isNew) {
        this.onGeolocation();
      }
    }
    this.requestServiceService.loadServiceCategories().subscribe((datas) => {
      this.serviceCategories = datas;
    });
  }

  sendRequest(request: RequestService): void {
    this.requestServiceService.saveRequestService({ 
      category: request.category, 
      appointment_date: moment.utc(request.appointment_date).format('YYYY-MM-DDTHH:mm'),
      description: request.description,
      status: 'In Progress',
      pictureUrl: this.currentImage || '',
      address: request.address
    });
    this.routingService.popDetail();

    this.toastController.create({
      message: 'The service request has been sent with succes',
      position: 'bottom',
      duration: 2500 
    }).present();
  }

  showRequestService(): void {
    this.currentImage = this.requestService['pictureUrl'];
    this.form.setValue({
      category: this.requestService.category,
      appointment_date: this.requestService.appointment_date,
      description: this.requestService.description,
      status: this.requestService.status,
      address: this.requestService.address
    });
  }

  cancelRequestService(): void {
    this.requestServiceService.cancelRequestService(this.requestService);
    this.toastController.create({
      message: 'The service request has been canceled with succes',
      position: 'bottom',
      duration: 2500
    }).present();
    this.routingService.popDetail();
  }

  async takePicture() {
    try {
      const options: CameraOptions = {
        quality: 100,
        targetHeight: 160,
        targetWidth: 160,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }

      const picture = await this.camera.getPicture(options);
      this.selectedPhoto = this.dataURItoBlob('data:image/jpeg;base64,' + picture);
     
      this.upload();
    } catch(e) {
      console.error(e);
    }
  }

  dataURItoBlob(dataURI) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  };

  upload() {
    if (this.selectedPhoto) {
      var uploadTask = storage().ref().child(`requestsServicesPictures/${new Date()}.png`).put(this.selectedPhoto);
      uploadTask.then(this.onSuccess, this.onError);
    }
  }

  onSuccess = (snapshot) => {
    this.currentImage = snapshot.downloadURL;
  }

  onError = (error) => {
    console.log('error', error);
  }

  onGeolocation() {
    this.geolocation.getCurrentPosition().then((data) => {
      this.latitude = data.coords ? data.coords.latitude : null;
      this.longitude = data.coords ? data.coords.longitude : null;
      (this.latitude && this.longitude) ? this.onExtractAddress(this.latitude, this.longitude) : this.onGeolocalisationFaild();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  };

  onExtractAddress(latitude: number, longitude: number): void {
    this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDNBzsYlKWMu7RKUuky5Wf_6_WES-Tkscw`, {}, {})
      .then(data => {     
        this.address = JSON.parse(data.data)['results'][0]['formatted_address'];
        this.form.patchValue({
          address: this.address
        })
      })
    .catch(error => {
      console.log(error.status);
      console.log(error.error);
    });
  }

  onGeolocalisationFaild() {
    let alert;
    alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: 'Your device doesn"t support GPS',
      buttons: ['OK']
    });
    alert.present();
  }
 }