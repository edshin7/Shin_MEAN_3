import { Component, OnInit } from '@angular/core';
import { HttpService } from "../http.service";
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-new-review',
  templateUrl: './new-review.component.html',
  styleUrls: ['./new-review.component.css']
})
export class NewReviewComponent implements OnInit {
  newReview: any;
  restId: string;
  errors: any;

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.newReview = {name: "", rating: "", content: ""};
    this.errors = [];
    this._route.params.subscribe((params: Params) => {
      this.restId = params['restId'];
  });
  }

  makeReview() { 
    let observable = this._httpService.makeReviewInServer(this.restId, this.newReview);
    observable.subscribe(data => {
      if(!data["hasErrors"]) {
        this._router.navigate(["/restaurant", this.restId]);
      }

      this.errors = data["errors"];
    })
  }

}
