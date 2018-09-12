/**
 * to hold the shipment data
 */
export class ShipmentModel {
    shipment_id: number;
    source_id: string;
    destination_id: string;
    date: Date;
    weight: number;
    cost: number;
    new_shipment_id: number;
    new_weight: number;
    new_cost: number;
    total_tls: number;

}