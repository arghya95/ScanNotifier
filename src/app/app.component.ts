import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  FirebaseUid:any;
  pages: Array<{title: string, component: any}>;

  constructor(private fcm: FCM,public zone:NgZone,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.


      firebase.auth().onAuthStateChanged((user) => {

        if(user){
          this.zone.run(()=>{
            this.FirebaseUid = firebase.auth().currentUser.uid
            console.log(this.FirebaseUid)
            /* this.firebaseNative.subscribe("AhareBangla")
              .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
              .catch(error => console.error('Error getting token', error)); */
              this.pushNotification()
            this.rootPage=HomePage;
          // this.rootPage = StaffratingPage;
          })
        }else{
          this.zone.run(()=>{
            this.rootPage=LoginPage;
          })
        }
    });


      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout(){
    this.zone.run(()=>{

    console.log("logout clicked....")
    firebase.auth().signOut();
    this.nav.setRoot(LoginPage);
    })
  }

  pushNotification() {
    this.fcm.subscribeToTopic('marketing');

this.fcm.getToken().then(token => {
  // backend.registerToken(token);
  alert(token);
  let selfRef = firebase.database().ref('/users/'+this.FirebaseUid+'/token/').set({
    token: token
  })
  
});

this.fcm.onNotification().subscribe(data => {
  if(data.wasTapped){
    console.log("Received in background");
  } else {
    console.log("Received in foreground");
  };
});

this.fcm.onTokenRefresh().subscribe(token => {
  // backend.registerToken(token);
});

this.fcm.unsubscribeFromTopic('marketing');
  }
}
