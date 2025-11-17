import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

const dbconnect = async () => {

    if (connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || "", );
        console.log("db connected");
    } catch (error) {
        console.log("Connection failed ", error);
         
        process.exit(1)
    }
}

export default dbconnect;
