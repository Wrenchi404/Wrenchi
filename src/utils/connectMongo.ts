import mongoose from "mongoose"
import Wrenchi from "../lib/Wrenchi"

const connectMongo = async (client: Wrenchi) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.warn(`Connecting to MongoDB...`);
            client.db = await mongoose.connect(client.config.Mongo.Mongo_URI, {
                keepAlive: true
            });
            console.log(`Connected to MongoDB`);
            resolve(true);
        } catch (error) {
            console.error("Error while connecting MongoDB.....")
            console.error(error);
            reject(error);
        }
    });
}

export default connectMongo