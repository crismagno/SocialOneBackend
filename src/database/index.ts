require('dotenv').config({ path: `${__dirname}/../../.env` });
import mongoose from "mongoose";

class DB {
    private connectionStringAtlas: string = `${process.env.DB_ATLAS}`;
    private connectionStringLocal: string = `${process.env.DB_LOCAL}`;
    private connectionStringDocker: string = `${process.env.DB_DOCKER}`;

    constructor() {
        this.connection();
    }
    
    private connection = async (): Promise<void> => {
        try {
            await mongoose.connect(this.connectionStringLocal, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            });
            console.log("Database connected...")
        } catch (error) {
            console.log("Error to connect database!!!", error);
        }
    };
}

export default DB;