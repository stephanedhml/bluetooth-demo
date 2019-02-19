import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule}  from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PatientListComponent } from './patient/list/patient-list.component';
import { PatientEditComponent } from './patient/edit/patient-edit.component';
import { UserListComponent } from './user/list/user-list.component';
import { UserAddComponent } from './user/add/user-add.component';
import { NavigationComponent } from './navigation/navigation.component';
import { WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';
import { AuthGuard } from './login/auth.guard';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'patient/list', component: PatientListComponent, canActivate: [AuthGuard]},
  { path: 'patient/edit', component: PatientEditComponent, canActivate: [AuthGuard]},
  { path: 'user/list', component: UserListComponent },
  { path: 'user/add', component: UserAddComponent },
  { path: '**', redirectTo: 'login'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PatientListComponent,
    PatientEditComponent,
    UserListComponent,
    UserAddComponent,
    NavigationComponent
  ],
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    WebBluetoothModule.forRoot({
      enableTracing: true // or false, this will enable logs in the browser's console
    }),
    BrowserAnimationsModule,
  ],
  exports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
