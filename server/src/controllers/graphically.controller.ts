import { Controller, Get, RouteService, Post, BodyParams, Status } from "@tsed/common";
import { graphicallyDB } from "../services/graphically-database";
import { ShipmentModel } from "../models/shipment.model";
import { ConfigModel } from "../models/config.model"
import { MultipartFile, MulterOptions } from "@tsed/multipartfiles";
import { Returns } from "@tsed/swagger";

@Controller("/graph")
export class GraphicallyController {

    constructor(private _graphicallyDB: graphicallyDB) {
    }

    @Get("/shipments")
    public async getShipments(): Promise<ShipmentModel[]> {
        return await this._graphicallyDB.getShipments();
    }

    @Post("/shipment")
    public async addShipment(@BodyParams() data: ShipmentModel[]): Promise<ShipmentModel[]> {
        let result: ShipmentModel[] = [];

        //build a list of promises for parallel db operations
        const promises = data.map(x => this._graphicallyDB.addShipment(x));

        //wait for all insert operations to complete
        await Promise.all(promises)
            .then((inserted) => {
                result = inserted;
            });

        return result;
    }

    @Get("/configs")
    public async getConfigs(): Promise<ConfigModel[]> {
        return await this._graphicallyDB.getConfigs();
    }

    @Get("/config")
    public async getLatestConfig(): Promise<ConfigModel> {
        return await this._graphicallyDB.getLatestConfig();
    }

    @Post("/config")
    public async addConfig(@BodyParams() data: ConfigModel): Promise<ConfigModel> {
        return await this._graphicallyDB.addConfig(data);
    }

    @Post('/upload')
    public async uploadFile(@MultipartFile('file') file: Express.Multer.File) {
        console.log(file)
    }


}