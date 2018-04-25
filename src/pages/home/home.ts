import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  logintype:any;
  showAdminPart:any;
  alldetails:any;
  constructor(public navCtrl: NavController,public zone:NgZone) {
    let self = firebase.auth().currentUser.uid;
    let checkref = firebase.database().ref('users/' + self);
    this.alldetails = [];
    checkref.on('value',(snap1:any)=>{
      if(snap1.val()){
        let data = snap1.val();
        if(data.usertype){
          // this.alldetails.push(data.deviceHistory);
          this.logintype = data.usertype;
          if(data.usertype == "Admin"){
            alert("admin found..!");
            this.zone.run(()=>{
              this.showAdminPart = true;
              console.log(this.showAdminPart);
            })
          }else{
            alert("admin not found..!")
            this.zone.run(()=>{
              this.showAdminPart = false;
              console.log(this.showAdminPart);
            })
          }
          for(let key in data.deviceInHistory) {
            data.deviceInHistory[key].uid = key;
            this.alldetails.push(data.deviceInHistory[key]);
          }

        }else{
          this.showAdminPart = false;
          console.log(this.showAdminPart);
        }
      }
    })
  }

}
