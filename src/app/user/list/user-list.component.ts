import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { MatTableDataSource } from '@angular/material';
import { AppService } from '../../app.service';
import { AppComponent } from '../../app.component'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  providers: [ AppService ]
})
export class UserListComponent extends AppComponent implements OnInit {

  displayedColumns = ['id', 'name', 'role', 'ring']
  data = null;
  dataSource = new MatTableDataSource<any>(this.data);
  selectedUsers = []
  loggedIn: boolean = true;

  constructor(protected appService: AppService, protected router: Router, protected cd: ChangeDetectorRef) {
    super(appService, router, cd)
    this.subscription = this.appService.isLoggedIn().subscribe(loggedIn => { this.loggedIn = loggedIn; });
  }

  ngOnInit() {
    this.loadData()
  }

  loadData(){
    this.appService.get('users').subscribe((data:User[]) => {
     this.dataSource.data = data;
   });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectUser(id){
    var index = this.selectedUsers.indexOf(id)
    if(index>-1){
      this.selectedUsers.splice(index,1)
    }
    else{
      this.selectedUsers.push(id)
    }
  }

  deleteSelectedUsers(){
    for(let user of this.selectedUsers){
      this.appService.delete('users/'+user).subscribe(
          ()=> {
            this.selectedUsers.splice(this.selectedUsers.indexOf(user),1)
            this.loadData()
          },
          error => {
            console.log(error)
          });
    }
  }

}

export interface User {
  id: number;
  name: string;
  role: number;
  ring: string;
}
