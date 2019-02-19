import {Injectable} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
import { map, mergeMap, filter, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AppService {

    baseUrl: string = 'https://json-api-app.herokuapp.com/';
    detokenizeUrl: string = '/vts/rest/v2.0/detokenize'
    password: string = 'Ssl12345#'
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    private loggedIn = new Subject<boolean>();
    private username = new Subject<string>();
    private userRole = new Subject<string>();

    constructor(public http:HttpClient, public ble: BluetoothCore){}

    isLoggedIn(): Observable<any> {
        return this.loggedIn.asObservable();
    }

    getRole(): Observable<any> {
        return this.userRole.asObservable();
    }

    setRole(userRole){
      this.userRole.next(userRole);
    }

    getUsername(): Observable<any> {
        return this.username.asObservable();
    }

    setUsername(username){
      this.username.next(username);
    }

    login(){
      this.loggedIn.next(true);
    }

    logout(){
      localStorage.removeItem("session");
      this.loggedIn.next(false);
    }

    //HTTP GET call
    get(url){
      return this.http.get(this.baseUrl + url)
    }

    //HTTP POST call
    post(url, data){
      return this.http.post(this.baseUrl + url, data, this.httpOptions)
    }

    //HTTP DELETE call
    delete(url){
      return this.http.delete(this.baseUrl + url, this.httpOptions)
    }

    detokenize(role, token){
      let username: string = role;
      let headers = new HttpHeaders();
      headers = headers.append("Authorization", "Basic " + btoa(username+":"+this.password));
      headers = headers.append("Content-Type", "application/x-www-form-urlencoded");
      console.log(headers)
      var data = JSON.stringify({"tokengroup" : "vtsUsers" , "token" : token, "tokentemplate" : "vtsUsersTemplate" });
      return this.http.post(this.detokenizeUrl, data, {headers: headers})
        .toPromise()
        .catch();
    }

    getDevice() {
      return this.ble.getDevice$();
    }

    disconnectDevice() {
      // call this method to disconnect from the device. This method will also stop clear all subscribed notifications
      this.ble.disconnectDevice();
      console.log('device disconnected')
    }

    connectToRing() {
      console.log('Connecting to ring...');

      try {
        return this.ble
          .discover({
            filters:[{namePrefix:'Motiv'}]
          })
      } catch (e) {
        console.error('Oops! can not read value from %s');
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
