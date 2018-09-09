import { Service } from "@tsed/common";
import { Pool, Client } from 'pg';
import { ShipmentModel } from "../models/shipment.model";
import { ConfigModel } from "../models/config.model";
/**
 * Contains all operations related to graphically database
 */
@Service()
export class graphicallyDB {

    private pool;
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT,
        });
    }

    /**
     * To get all the available shipments from DB
     */
    public async getShipments(): Promise<ShipmentModel[]> {
        const { rows } = await this.pool.query(
            `SELECT shipment_id, source_id, destination_id, date, weight, cost, new_shipment_id, new_weight, new_cost, total_tls
            FROM shipments_data`);
        return rows as ShipmentModel[];
    }

    /**
     * Adds a single row for shipment information to DB
     * @param data data to be added to DB
     */
    public async addShipment(data: ShipmentModel): Promise<ShipmentModel> {
        const insertQuery = `INSERT INTO shipments_data(shipment_id, source_id, destination_id, date, weight, cost, new_shipment_id, new_weight, new_cost, total_tls)
                            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
        const values = [data.shipment_id, data.source_id, data.destination_id, data.date, data.weight, data.cost, data.new_shipment_id, data.new_weight, data.new_cost, data.total_tls];
        const { rows } = await this.pool.query(insertQuery, values);
        return rows[0] as ShipmentModel;
    }

    /**
     * Get a list of all available configs from DB
     */
    public async getConfigs(): Promise<ConfigModel[]> {
        const { rows } = await this.pool.query(
            `SELECT  "table", master_circle, parent_circle, children_circle, parent_size, children_size, parent_tooltip, children_tooltip
            FROM configMaster`);
        return rows as ConfigModel[];
    }

    /**
     * get the latest config from DB
     */
    public async getLatestConfig(): Promise<ConfigModel> {
        const { rows } = await this.pool.query(
            `SELECT  "table", master_circle, parent_circle, children_circle, parent_size, children_size, parent_tooltip, children_tooltip
            FROM configMaster
            ORDER BY last_updated DESC LIMIT 1`);
        return rows[0] as ConfigModel;
    }

    /**
     * Adds a single config row to DB
     * @param data config value to be added to DB
     */
    public async addConfig(data: ConfigModel): Promise<ConfigModel> {
        const insertQuery = `INSERT INTO configMaster("table", master_circle, parent_circle, children_circle, parent_size, children_size, parent_tooltip, children_tooltip)
                            VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const values = [data.table, data.master_circle, data.parent_circle, data.children_circle, data.parent_size, data.children_size, data.parent_tooltip, data.children_tooltip];
        const { rows } = await this.pool.query(insertQuery, values);
        console.log(rows);
        return rows as ConfigModel;
    }
}