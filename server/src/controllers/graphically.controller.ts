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

    /**
     * gets all shipments from DB
     */
    @Get("/shipments")
    public async getShipments(): Promise<ShipmentModel[]> {
        return await this._graphicallyDB.getShipments();
    }

    /**
     * adds the given list of shipment data replacing the existing data
     * @param data list of shipment objects to be added to DB
     */
    @Post("/shipment")
    public async addShipment(@BodyParams() data: ShipmentModel[]): Promise<ShipmentModel[]> {
        let result: ShipmentModel[] = [];

        //Delete all rows
        await this._graphicallyDB.deleteShipments()

        //build a list of promises for parallel db operations
        const promises = data.map(x => this._graphicallyDB.addShipment(x));

        //wait for all insert operations to complete
        await Promise.all(promises)
            .then((inserted) => {
                result = inserted;
            });

        return result;
    }

    /**
     * gets all available configs from DB
     */
    @Get("/configs")
    public async getConfigs(): Promise<ConfigModel[]> {
        return await this._graphicallyDB.getConfigs();
    }

    /**
     * get the latest added config from DB
     */
    @Get("/config")
    public async getLatestConfig(): Promise<ConfigModel> {
        return await this._graphicallyDB.getLatestConfig();
    }

    /**
     * adds a config to DB
     * @param data config to be added
     */
    @Post("/config")
    public async addConfig(@BodyParams() data: ConfigModel): Promise<ConfigModel> {
        return await this._graphicallyDB.addConfig(data);
    }

    /**
     * parses and inserts the csv file into shipment replacing the existing data
     * @param file the csv file to be parsed and inserted to shipments
     */
    @Post('/upload')
    @Status(200)
    public async uploadFile(@MultipartFile('file') file: Express.Multer.File) {
        const csv = require('csvtojson')
        const data = await csv().fromFile(file.path);
        const inserted = await this.addShipment(data)
        return inserted;
    }


}