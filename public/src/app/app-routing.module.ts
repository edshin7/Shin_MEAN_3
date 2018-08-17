import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NewComponent } from './new/new.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { EditComponent } from './edit/edit.component';
import { NewReviewComponent } from './new-review/new-review.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "newRestaurant", component: NewComponent },
  { path: 'restaurant/:id', component: ReviewsComponent },
  { path: "editRestaurant/:id", component: EditComponent },
  { path: "newReview/:restId", component: NewReviewComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
