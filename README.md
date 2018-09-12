# graphically
A project to visualize data as packed circles using D3.js, Angular, express, Ts.ED, PostgreSQL SQL

## setup

 1. The project consists of client and server folder. clone the git onto
    your machine
    
2. Setup Postgres DB. run the DB file at 
`graphically/server/resources/database.sql`
update the DB configuration in 
`graphically/server/.env` as per your local DB instance

3. In /server folder run
 `npm install`
 `npm start`
   rest server will be available on `http://localhost:3000`
   swagger : `http://localhost:3000/api-docs/`
   
4. In /client folder run 
`npm install`
`npm start`
angular app will be available on `http://localhost:33000`

5. Setup config data. navigate to swagger and hit the below endpoint with the default config data.
`POST /rest/graph/config`
data:
```json
{
	"shipment_id": "1",
	"source_id": "a123",
	"destination_id": "z789",
	"date": "2018-05-06",
	"weight": "25000",
	"cost": "250",
	"new_shipment_id": "1",
	"new_weight": "2500",
	"new_cost": "250",
	"total_tls": "1",
}
```
 
 6. Open angular app in browser, upload the below csv file to generate the graph 
`graphically/data/ShipmentData.csv`

7. Modify and upload again for new graph
