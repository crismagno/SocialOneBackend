require('dotenv').config({ path: `${__dirname}/../../.env` });
import mongoose from "mongoose";

class DB {
    private connectionString: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.26te6.mongodb.net/social?retryWrites=true&w=majority`;

    public connection = async (): Promise<void> => {
        try {
            await mongoose.connect(this.connectionString, {
                useNewUrlParser: true
            });
            console.log("Database connected...")
        } catch (error) {
            console.log("Error to connect database!!!");
        }
    };
}

export default DB;