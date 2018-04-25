import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { HomePage } from '../home/home';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email:any;
  password:any;

  constructor(public alertCtrl: AlertController,public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  goLogin() {
    if(this.email=="" || this.email==undefined || this.email==null) {
      this.showPopup("Error","Email Cannot be blank");
    }
    else if(this.password=="" || this.password==undefined || this.password==null) {
      this.showPopup("Error","Password Cannot be blank");
    }
    else {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      
    return firebase.auth().signInWithEmailAndPassword(this.email, this.password)
     .then(user => {
       console.log(this.email);
       if(user) {
         loading.dismiss();
         this.navCtrl.setRoot(HomePage);
       }
     })
      .catch((_error) => {
        loading.dismiss();
        alert(_error.message);
      });
    }
   }

   goAdminLogin() {
    let alert = this.alertCtrl.create({
      cssClass:'loginAlert',
      title: 'Admin Login',
      inputs: [
        {
          name: 'email',
          placeholder: 'Enter you email',
          type: 'email'
        },
        {
          name: 'password',
          placeholder: 'Enter your password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: data => {
            let loading = this.loadingCtrl.create({
              content: 'Please wait...'
            });
            loading.present();
            if(data.email == 'santu4342@gmail.com') {
            
              console.log(data.email, data.password);
              firebase.auth().signInWithEmailAndPassword(data.email, data.password)
              .then(user => {
                console.log(data.email);
                if(user) {
                  loading.dismiss();
                  firebase.database().ref('users/'+user.uid).set({
                    email: data.email,
                    password: data.password,
                    usertype: 'Admin'
                  })
                  this.navCtrl.setRoot(HomePage);
                }
              })
               .catch((_error) => {
                 loading.dismiss();
                 this.showPopup("Error",_error);
               });
                 
            }
            else {
              loading.dismiss();
              this.showPopup('Alert','You are not Admin')
            }

          }
        }
      ]
    });
    alert.present();
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
