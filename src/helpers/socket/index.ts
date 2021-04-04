const socket = require("socket.io");

class GlobalScoket {
    public static io: any;
    
    public static start = (server: any) => {

        GlobalScoket.io = socket(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            }
        });

        GlobalScoket.io.on("connection", (socket: any) => {
    
            console.log("ENTROU...");
    
            socket.emit("me", socket.id);

            socket.on("disconnect", () => {
                console.log("SAIU...");
            });
        });
    };
};

export default GlobalScoket;