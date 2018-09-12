import { Component, OnInit, OnDestroy } from '@angular/core';
import { GraphicallyDatabaseService } from '../../shared/services/graphically-database.service';
import { ShipmentData } from '../../shared/models/ShipmentData.model';
import { ShipmentModel } from '../../shared/models/shipment.model';
import { Subscription, } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import * as lodash from 'lodash';
import { ConfigModel } from '../../shared/models/config.model';
import * as d3 from 'd3';


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
        this.buildGraph(this.shipmentData)
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


  ngOnDestroy(): void {
    if (this.shipmentDataSub) this.shipmentDataSub.unsubscribe()
  }

}
