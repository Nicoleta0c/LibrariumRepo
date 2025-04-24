import { MongoClient } from "mongodb";
import mongoose from "mongoose";

class dbClient {

    constructor() {
        this.connectBD();
    }

    async connectBD() {
        try {
            const queryString = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_DB}/Librarium?retryWrites=true&w=majority`;
            await mongoose.connect(queryString);
            console.log("Conectado a la base de datos");
        } catch (error) {
            console.error("Error conectando a la base de datos:", error);
        }
    }
    async closeConexion() {
        try {
            await mongoose.disconnect();
            console.log("conexion a bd cerrada");
        } catch (e) {
            console.log(`Error en la conexion: ${e}`);
        }
    }

}

export default new dbClient();