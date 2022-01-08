require('dotenv').config({ path: `${__dirname}/../../.env` });
import mongoose from "mongoose";

class SocialOneDataBase {
    private connectionStringAtlas: string = `${process.env.DB_ATLAS}`;
    private connectionStringLocal: string = `${process.env.DB_LOCAL}`;
    
    public start = async (): Promise<void> => {
        try {
            await mongoose.connect(process.env.NODE_ENV === "dev" ? this.connectionStringLocal : this.connectionStringAtlas, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
                useCreateIndex: true
            });
            console.log("Database connected...")
        } catch (error) {
            console.log("Error to connect database!!!", error);
        }
    };
}

export default SocialOneDataBase;