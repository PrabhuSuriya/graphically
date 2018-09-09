import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CirclePackingComponent } from './components/circle-packing/circle-packing.component';

import { HttpClientModule } from '@angular/common/http';
import { GraphicallyDatabaseService } from './shared/services/graphically-database.service';



@NgModule({
  declarations: [
    AppComponent,
    CirclePackingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [GraphicallyDatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
