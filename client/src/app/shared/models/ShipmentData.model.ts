/**
 * to hold the hierarchial shipment data
 */
export class ShipmentData {
    id: string;
    size: number;
    tooltip: number;
    children: ShipmentData[]
}