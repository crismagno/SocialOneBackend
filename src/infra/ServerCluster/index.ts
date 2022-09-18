import cluster from "cluster";
import http from "http";
import { cpus } from "os";
import process from "process";
import EnviromentEnum from "../../settings/enviroment/enviroment.enum";
import Log from "../Log";

export class ServerCluster {
  constructor(private server: http.Server) {}

  public start = (): void => {
    // const numCPUs: number = cpus().length;

    // if (cluster.isMaster) {
    //   console.log(`Master ${process.pid} is running`);

    //   // Fork workers.
    //   for (let i = 0; i < numCPUs; i++) {
    //     cluster.fork();
    //   }

    //   cluster.on("exit", (worker, code, signal) => {
    //     console.log(`worker ${worker.process.pid} died`);
    //   });
    // } else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    this.server.listen(process.env.PORT, () =>
      Log.success({ message: `Server running on ${process.env.APP_URL}` })
    );

    //   console.log(`Worker ${process.pid} started`);
    // }
  };
}

export default ServerCluster;
