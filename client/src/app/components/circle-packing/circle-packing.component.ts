import { Component, OnInit, OnDestroy } from '@angular/core';
import { GraphicallyDatabaseService } from '../../shared/services/graphically-database.service';
import { ShipmentData } from '../../shared/models/ShipmentData.model';
import { ShipmentModel } from '../../shared/models/shipment.model';
import { Subscription, } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import * as lodash from 'lodash';
import { ConfigModel } from '../../shared/models/config.model';
import * as d3 from 'd3';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-circle-packing',
  templateUrl: './circle-packing.component.html',
  styleUrls: ['./circle-packing.component.scss']
})
export class CirclePackingComponent implements OnInit, OnDestroy {


  shipmentData: ShipmentData;
  shipmentDataSub: Subscription;
  config: ConfigModel;
  afuConfig: any;
  message: string;
  constructor(private _gSvc: GraphicallyDatabaseService) { }

  ngOnInit() {
    //specify the file upload components config -url
    this.afuConfig = {
      uploadAPI: {
        url: this._gSvc.getApiEndpoint(environment.api.uploadURL)
      },
      formatsAllowed: '.csv'
    };

    //get the shipment data from DB and build graph
    this.getShipmentData();
  }

  /**
   * to get the shipment data and build graph if data is available
   */
  getShipmentData() {
    this.shipmentDataSub = this._gSvc.getShipments()
      .pipe(
        withLatestFrom(this._gSvc.getLatestConfig()), // get the last emitted value from config
      )
      .subscribe(([data, config]) => {
        console.log(data, config)

        //show info to user if there is no data in DB
        this.message = data.length > 0 ? '' : 'Please upload the shipments csv file!';
        if (data.length > 0) {
          this.shipmentData = this.processShipmentData(data, config)
          this.buildGraph(this.shipmentData)
        }
      })
  }

  /**
   * 
   * @param data process the flat shipment data to hierarchial data
   * @param config flat shipment data
   */
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
  /**
   * 
   * @param data flat shipment data
   * @param grouping group by property
   * @param tooltip property name holding tooltip value
   * @param size property name holding size value
   * @param includeChildInfo whether to include children infor, default-true
   */
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
  /**
   * build the graph using d3 based on hierarchial shipment data
   * @param data hierarchial shipment data
   */
  buildGraph(data: ShipmentData) {
    var svg = d3.select("svg"),
      margin = 20,
      diameter = +svg.attr("width"),
      g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    let range: ReadonlyArray<number> = [0x28CC7F, 0x474D66] as ReadonlyArray<number>;
    var color = d3.scaleLinear()
      .domain([-1, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    var pack = d3.pack()
      .size([diameter - margin, diameter - margin])
      .padding(5);

    var root = d3.hierarchy(data)
      .sum(function (d) { return d.size; })
      .sort(function (a, b) { return b.value - a.value; });

    var focus = root,
      nodes = pack(root).descendants(),
      view;

    var circle = g.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      .style("fill", function (d) { return color(d.depth); })
      .on("click", function (d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

    var text = g.selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function (d) { return d.parent === root ? 1 : 0; })
      .style("display", function (d) { return d.parent === root ? "inline" : "none"; })
      .text(function (d) { return d.data.tooltip; });

    var node = g.selectAll("circle,text");

    svg
      .style("background", color(-1))
      .on("click", function () { zoom(root); });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d) {
      var focus0 = focus; focus = d;

      var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function (d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function (t) { zoomTo(i(t)); };
        });

      transition.selectAll("text")
        .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function (d) { return d.parent === focus ? 1 : 0; })
        .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
    }
    function zoomTo(v) {
      var k = diameter / v[2]; view = v;
      node.attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
      circle.attr("r", function (d) { return d.r * k; });
    }
  }
  /**
   * triggered when file upload is completed
   * @param $event file upload event
   */
  onFileUploadComplete($event) {
    //refresh the graph
    this.getShipmentData();
  }

  ngOnDestroy(): void {
    //unsubscribe
    if (this.shipmentDataSub) this.shipmentDataSub.unsubscribe()
  }

}
