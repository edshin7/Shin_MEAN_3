import { Component, OnInit } from '@angular/core';
import { HttpService } from "../http.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  rests: any = [];
  curEditId: any = null;

  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.getRests();
  }

  getRests() {
    let observable = this._httpService.getResturantsFromServer();
    observable.subscribe(data => {
      this.rests = data;
    });
  }

  goToEdit(id) {
    this.curEditId = id;
  }

  deleteRest(id) {
    let observable = this._httpService.deleteRestInServer(id);
    observable.subscribe(data => {
      this.getRests();
    })
  }

  exitEdit(data) {
    this.curEditId = null;
    this.getRests();
  }

  passed30(time) {
    
    var today = new Date();
    var restTime = new Date(time);
    var difference = today.getTime() - restTime.getTime();
    var sec = difference / 1000;

    return sec <= 30;
  }

}
