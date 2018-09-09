import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CirclePackingComponent } from './components/circle-packing/circle-packing.component';

const routes: Routes = [
  { path: 'circle-packing', component: CirclePackingComponent },
  { path: '', redirectTo: 'circle-packing', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
