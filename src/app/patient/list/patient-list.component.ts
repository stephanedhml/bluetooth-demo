import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { MatTableDataSource } from '@angular/material';
import { AppService } from '../../app.service';
import { AppComponent } from '../../app.component'

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
  providers: [ AppService ]
})
export class PatientListComponent extends AppComponent implements OnInit {

  displayedColumns = ['id', 'name', 'age', 'doctor', 'joindate']
  objectNames = {
    doctor:{name:'Patient Name', lastappointment:'Last Appointment', medication: 'Medications', allergies:'Allergies', ssn:'Social Security Number', dob:'Date of birth'},
    finance:{name:'Patient Name', ssn:'Social Security Number', cc:'Credit Card', balancedue:'Balance Due', lastpayment:'Last Payment', dob:'Date of birth' },
    receptionist:{id:'Member ID', name:'Patient Name', ssn:'Social Security Number', insurance:'Insurance Provider', dob:'Date of birth', cc:'Credit Card'}
  }
  data = null;
  dataSource = new MatTableDataSource(this.data);
  url:string = 'patients'
  role:string = 'doctor'

  constructor(protected appService: AppService, protected router: Router, protected cd: ChangeDetectorRef) {
    super(appService, router, cd)
    console.log('pation ;list')
  }

  ngOnInit() {
    this.loadData()
  }

  loadData(){
    this.changeRole(JSON.parse(localStorage.getItem('session')).role);
    this.appService.get(this.url).subscribe((data: Array<any>)  => {
      this.data = []
      console.log(this.role)
      for (let patient of data){
        this.appService.detokenize(this.role, patient.ssn).then(response => {
                patient['ssn'] = response['data'];
                if(this.role != 'doctor'){
                  this.appService.detokenize(this.role, patient.cc).then(response => {
                          patient['cc'] = response['data'];
                          this.data.push(patient);
                          this.dataSource.data = this.data;
                        },
                  error => {
                    console.log(error)
                  });
                }
                else{
                  this.data.push(patient);
                  this.dataSource.data = this.data;
                }
              },
        error => {
          console.log(error)
        });
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editUser(patient: Patient): void {
    localStorage.removeItem("patientId");
    localStorage.setItem("patientId", patient.id.toString());
    this.router.navigate(['/patient/edit']);
  };

  changeRole(role){
    this.role = role
    this.displayedColumns = []
    for(let key in this.objectNames[role]){
      this.displayedColumns.push(key)
    }
  }

}

export interface Patient {
  id: number;
  name: string;
  age: number;
  doctor: string;
  joindate: string;
}
