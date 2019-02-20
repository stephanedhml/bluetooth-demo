import { Component, OnInit, ChangeDetectorRef, AfterViewChecked  } from '@angular/core';
import { AppService } from './app.service';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ AppService ]
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'vts-demo';
  loggedIn: boolean = true;
  username: string = "";
  userRole: string = "";
  subscription: Subscription;
  device: any = {};
  loading:boolean = false;
  user:string = "";

  constructor(protected appService: AppService, protected router: Router, protected cd: ChangeDetectorRef) {
    this.subscription = this.appService.isLoggedIn().subscribe(loggedIn => { this.loggedIn = loggedIn; });
    this.subscription = this.appService.getUsername().subscribe(username => { this.username = username; });
    this.subscription = this.appService.getRole().subscribe(userRole => { this.userRole = userRole; });
    if(localStorage.getItem('session')){
      this.username = JSON.parse(localStorage.getItem('session')).name;
      this.userRole = JSON.parse(localStorage.getItem('session')).role;
    }
  }

  ngOnInit() {
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
    this.loading = true
    // this.streamRingStatus()
    localStorage.setItem("session", JSON.stringify({name:"Stephane",role:"receptionist",ring:"Motiv-ad7a",id:1}));
    this.user = "Stephane"
    setTimeout(()=>{
          this.user = "Stephane"
          this.appService.login();
          this.appService.setUsername(JSON.parse(localStorage.getItem('session')).name)
          this.appService.setRole(JSON.parse(localStorage.getItem('session')).role)
          this.router.navigate(['/patient/list']);
          this.loading = false
     }, 1100);

  }

  addUser(){
    this.appService.login();
    this.router.navigate(['/user/list']);
  }

  logout(){
    this.appService.logout();
    this.username = "";
    this.router.navigate(['/login']);
  }

  ngAfterViewChecked () {
    this.cd.detectChanges();
  }
}
