import { Component, OnInit } from '@angular/core';
import { HttpService } from "../http.service";
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  curId: string;
  curRest: any;
  reviews: any = [];


  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
        this.curId = params["id"];
        this.getRestById(this.curId);
        this.getReviewsById(this.curId);
    });
  }

  getRestById(id) {
    let observable = this._httpService.getRestaurantsByIdFromServer(id);
    observable.subscribe(data => {
      this.curRest = data;
    });
  }

  getReviewsById(restId) {
    let observable = this._httpService.getReviewsFromServer(restId);
    observable.subscribe(data => {
      this.reviews = data;
    });
  }

}
