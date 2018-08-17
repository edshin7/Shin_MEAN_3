import { Component, OnInit } from '@angular/core';
import { HttpService } from "../http.service";
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  newRest: any;
  errors: any;

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.newRest = {name: "", cuisine: ""};
    this.errors = [];
  }

  submitRest() {
    let observable = this._httpService.makeRestaurantInServer(this.newRest);
    observable.subscribe(data => {
      console.log(data);
      if(!data["hasErrors"]) {
        this._router.navigate(['/']);
      }

      this.errors = data["errors"];
    });
  }

}
