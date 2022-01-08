import UserController from "./../controllers/User";
import express, { Application } from "express";
import SocialOneDataBase from "./../database/index";
import GlobalSocket from "../helpers/socket";
import SOConsign from "../infra/SOConsign";
import http from "http";
import ServerCluster from "../infra/ServerCluster";

class App {
    private readonly app: Application = express();
    private readonly server: http.Server = http.createServer(this.app);
    private readonly socialOneDatabase: SocialOneDataBase = new SocialOneDataBase(); 
    private readonly soConsign: SOConsign = new SOConsign(this.app); 
    private readonly serverCluster: ServerCluster = new ServerCluster(this.server); 

    public start = async (): Promise<void> => {
        this.socialOneDatabase.start();
        await UserController.updateSocketAllUsers(); // remove all sockets of users and set online to false
        GlobalSocket.start(this.server);
        this.soConsign.start();
        this.serverCluster.start();
    };
};

export default App;
