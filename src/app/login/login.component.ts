import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { LoginService } from './login.service';
import { AppService } from '../app.service';
import { AppComponent } from '../app.component';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ LoginService ]
})
export class LoginComponent implements OnInit {
  device: any = {};
  loading:boolean = false;
  user:string = "";

  constructor(protected appService:AppService, protected router: Router, protected loginService:LoginService, public _zone: NgZone) {
  }

    ngOnInit() {
      this.appService.logout();
    }

    connectToRing() {
      this.loading = true;
      return this.appService.connectToRing().then(
        (device) => {
          if(device) {
            this.device = device;
            this.device.gatt.connect()
            this.authenticateRing()
          }
          else {
            this.device = null;
            this.loading = false;
          }
        }
      );
    }

    authenticateRing(){
      this.appService.get('users').subscribe((users:any[]) => {
        let user = users.find(x => x.ring === this.device.name)
        if (user){
          this.user = user.name
          localStorage.setItem("session", JSON.stringify(user));
          setTimeout(()=>{
                this.user = user.name
                this.login()
           }, 1000);
        }
        else {
          this.loading = false
          console.log('ring not allowed')
        }
       });
    }

    login(){
      // this.streamRingStatus()
      localStorage.setItem("session", JSON.stringify({name:"Stephane",role:"finance",ring:"Motiv-ad7a",id:1}));
      this.appService.login();
      this.appService.setUsername(JSON.parse(localStorage.getItem('session')).name)
      this.appService.setRole(JSON.parse(localStorage.getItem('session')).role)
      this.router.navigate(['/patient/list']);
    }

    streamRingStatus(){
      var firstconnect = false
      var firstdisconnect = false
      var secondconnect = false
      var stream = setInterval(() => {
        this.device.gatt.connect()
        if(this.device.gatt.connected == true) {
          if(firstconnect == false){
            firstconnect = true
          }
          else if(firstconnect == true && firstdisconnect == true){
            clearInterval(stream)
            this.appService.disconnectDevice()
            this.logout()
          }
        }
        else {
          if(firstdisconnect == false){
            firstdisconnect = true
          }
        }
      }, 2000);
    }

    logout(){
      this.appService.logout();
      setTimeout(()=>{
            this.router.navigate(['/login']);
       }, 2000);
    }

    // ngOnDestroy(){
    //   this.appService.disconnectDevice()
    // }

  }
