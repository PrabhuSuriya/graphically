import { Component, OnInit, OnDestroy } from '@angular/core';
import { GraphicallyDatabaseService } from '../../shared/services/graphically-database.service';
import { ShipmentData } from '../../shared/models/ShipmentData.model';
import { ShipmentModel } from '../../shared/models/shipment.model';
import { Subscription, } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import * as lodash from 'lodash';
import { ConfigModel } from '../../shared/models/config.model';

@Component({
  selector: 'app-circle-packing',
  templateUrl: './circle-packing.component.html',
  styleUrls: ['./circle-packing.component.scss']
})
export class CirclePackingComponent implements OnInit, OnDestroy {


  shipmentData: ShipmentData;
  shipmentDataSub: Subscription;
  config: ConfigModel;
  constructor(private _gSvc: GraphicallyDatabaseService) { }

  ngOnInit() {
    this.shipmentDataSub = this._gSvc.getShipments()
      .pipe(
        withLatestFrom(this._gSvc.getLatestConfig()),
      )
      .subscribe(([data, config]) => {
        console.log(data, config)
        this.shipmentData = this.processShipmentData(data, config)
      })

  }

  processShipmentData(data: ShipmentModel[], config: ConfigModel): ShipmentData {
    let result: ShipmentData = new ShipmentData();

    //set master id
    result.id = data[0][config.master_circle];
    //set nested parent circles
    result.children = this.getChildren(data, config.parent_circle, config.parent_tooltip, config.parent_size)
    //set nested children circles
    result.children.forEach((child) => {
      child.children = this.getChildren(child.children, config.children_circle, config.children_tooltip, config.children_size, false)
    })

    console.log(result)
    return result;
  }
  getChildren(data: any[], grouping: string, tooltip: string, size: string, includeChildInfo: boolean = true): ShipmentData[] {
    let result: any[] = []

    let groupedData = lodash.groupBy(data, (x) => {
      return x[grouping];
    })

    for (let key in groupedData) {
      let item = groupedData[key][0];
      result.push({
        id: key,
        tooltip: item[tooltip],
        size: item[size],
        children: groupedData[key]
      })
    }
    if (!includeChildInfo) {
      result.forEach(x => {
        delete x.children
      })
    }
    return result;
  }

  ngOnDestroy(): void {
    if (this.shipmentDataSub) this.shipmentDataSub.unsubscribe()
  }

}
