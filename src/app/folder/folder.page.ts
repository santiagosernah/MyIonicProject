import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Geolocation, Camera, CameraResultType } from '@capacitor/core';
import { VoiceRecognitionService } from './voice-recognition.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})

export class FolderPage implements OnInit {

  public folder: string;
  latitude: number;
  longitude: number;
  textFromVoice: string;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public service : VoiceRecognitionService) {
      this.service.init()
    }
  
  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  startService(){
    this.service.start()
  }

  stopService(){
    this.textFromVoice = this.service.stop()
  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current', coordinates);
    await this.showAlert(coordinates.coords.latitude, coordinates.coords.longitude);
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;
    // Can be set to the src of an image now
    // imageElement.src = imageUrl;
  }

  watchPosition() {
    const wait = Geolocation.watchPosition({}, (position, err) => {
    })
  }

  async showAlert(latitud: number, longitude: number) {
    let alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Geolocalización',
      subHeader: 'La geoloccalizazción del dispositivo es:',
      message: 'Latitud: ' + latitud + ', longitud: ' + longitude,
      buttons: ['OK'] 
    });
    await alert.present();
  }

}
