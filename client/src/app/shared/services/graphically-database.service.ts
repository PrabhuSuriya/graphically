import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ShipmentModel } from '../models/shipment.model';
import { environment } from '../../../environments/environment';
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigModel } from '../models/config.model';

/**
 * provides all methods necessary to interact with graphically DB
 */
@Injectable({
  providedIn: 'root'
})
export class GraphicallyDatabaseService {


  constructor(private _http: HttpClient) {

  }

  /**
   * gets all shipments information
   */
  getShipments(): Observable<ShipmentModel[]> {
    return this._http.get<ShipmentModel[]>(this.getApiEndpoint(environment.api.shipmentList))
      .pipe(
        catchError(err => {
          console.log(err);
          return throwError(err)
        })
      )
  }

  /**
   * gets the latest config added in the DB
   */
  getLatestConfig(): Observable<ConfigModel> {
    return this._http.get<ConfigModel>(this.getApiEndpoint(environment.api.latestConfig))
      .pipe(
        catchError(err => {
          console.log(err);
          return throwError(err)
        })
      )
  }

  /**
   * generates the complete endpoint based on the rest domain set in env and endpoint passed
   * @param endpoint endpoint to be generated
   */
  getApiEndpoint(endpoint: string): string {
    return `${environment.api.root}${endpoint}`
  }
}
