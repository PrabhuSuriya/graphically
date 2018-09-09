import { $log } from "ts-log-debug";
import { Server } from "./Server";

require("dotenv").config();
$log.debug("Start server...");
new Server().start().catch((er) => {
    $log.error(er);
});
