import { $log } from "ts-log-debug";
import { Server } from "./Server";

//initialize dotenv to load the environment file
require("dotenv").config();
$log.debug("Start server...");
new Server().start().catch((er) => {
    $log.error(er);
});
