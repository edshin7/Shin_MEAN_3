import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) { }

  getResturantsFromServer() {
    return this._http.get("/getRestaurants")
  }

  getRestaurantsByIdFromServer(id) {
    return this._http.get("/getRestaurantById/" + id);
  }

  makeRestaurantInServer(rest) {
    return this._http.post("/makeRest", rest);
  }

  editRestInServer(id, rest) {
    return this._http.put("/editRest/" + id, rest);
  }

  deleteRestInServer(id) {
    return this._http.delete("/deleteRest/" + id);
  }

  getReviewsFromServer(restId) {
    return this._http.get("/getReviews/" + restId);
  }

  makeReviewInServer(restId, review) {
    return this._http.post("/makeReview/" + restId, review);
  }
}
