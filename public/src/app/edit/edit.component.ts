import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from "../http.service";
import { ActivatedRoute, Params, Router } from '@angular/router';
// import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  curRest: any = null;
  errors: any = [];

  @Input() curRestId: any = null;
  @Output() emitter = new EventEmitter();

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    // this._route.params.subscribe((params: Params) => {
    //     this.getRestById(params["id"]);
    // });
    this.getRestById(this.curRestId);
  }

  getRestById(id) {
    let observable = this._httpService.getRestaurantsByIdFromServer(id);
    observable.subscribe(data => {
      this.curRest = data;
    });
  }

  editRest(id) {
    let observable = this._httpService.editRestInServer(id, this.curRest);
    observable.subscribe(data => {
      if(!data["hasErrors"]) {
        // this._router.navigate(["/"]);
        this.finishEdit();
      }

      this.errors = data["errors"];
    });
  }

  finishEdit() {
    this.curRestId = null;
    this.emitter.emit(null);
  }

}
