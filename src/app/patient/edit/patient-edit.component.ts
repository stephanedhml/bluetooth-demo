import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";

import { AppService } from '../../app.service';
import { AppComponent } from '../../app.component'
import { Patient } from '../list/patient-list.component'

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.scss'],
  providers: [ AppService ]
})
export class PatientEditComponent extends AppComponent implements OnInit {

  patient:Patient;

  constructor(protected appService: AppService, protected router: Router, protected cd: ChangeDetectorRef) {
    super(appService, router, cd)
  }

  ngOnInit() {
    let patientId = localStorage.getItem("patientId");
    if(!patientId) {
      alert("Invalid action.")
      this.router.navigate(['/patient/list']);
      return;
    }
  }

}
