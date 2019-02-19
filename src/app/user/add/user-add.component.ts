import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { MatTableDataSource } from '@angular/material';
import { AppService } from '../../app.service';
import { AppComponent } from '../../app.component'

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  providers: [ AppService ]
})
export class UserAddComponent extends AppComponent {

  form: FormGroup;
  device: any = {};
  roles: any = ['doctor', 'receptionist', 'finance']
  url:string = 'users'
  loggedIn: boolean = true;
  ringExist: boolean = false;

  constructor(protected appService: AppService, protected router: Router, protected cd: ChangeDetectorRef, private formBuilder: FormBuilder) {
    super(appService, router, cd)
    this.buildForm()
  }

  buildForm(){
    this.form = this.formBuilder.group({
        name: ['', Validators.required],
        role: [this.roles[0], Validators.required],
        ring: ['', Validators.required],
    });
  }

  onSubmit() {
        if (this.form.invalid) {
            return;
        }
        this.appService.post(this.url, this.form.value).subscribe(
            ()=> {
              this.router.navigate(['/user/list']);
            },
            error => {
              console.log(error)
            });
    }

    registerRing() {
      this.ringExist = false
      return this.appService.connectToRing().then(
        (device) => {
          if(device) {
            this.device = device;
            this.appService.get('users').subscribe((data: Array<any>) => {
               var ring = data.filter(user => user.ring === device.name)[0]
               if(!ring){
                 this.form.controls['ring'].setValue(device.name)
               }
               else{
                 this.ringExist = true
               }
             });
          }
          else {
            console.log('no device')
            this.device = null;
          }
        }
      );
    }

}
