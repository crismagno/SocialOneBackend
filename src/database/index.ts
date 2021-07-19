require('dotenv').config({ path: `${__dirname}/../../.env` });
import mongoose from "mongoose";

class DB {
    private connectionStringAtlas: string = `${process.env.DATABASE_ATLAS}`;
    private connectionStringLocal: string = `${process.env.DATABASE_LOCAL}`;

    constructor() {
        this.connection();
    }
    
    private connection = async (): Promise<void> => {
        try {
            await mongoose.connect(this.connectionStringLocal, {
                useNewUrlParser: true,
                useFindAndModify: false
            });
            console.log("Database connected...")
        } catch (error) {
            console.log("Error to connect database!!!", error);
        }
    };
}

export default DB;