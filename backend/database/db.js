import mongoose from "mongoose"

//conexion a la base de datos 

export const connectDB = async ()=>{
    try {
        const mongoURI = process.env.NODE_ENV === "production"
        ? process.env.MONGO_URI
        : process.env.MONGO_URI_DEV
        await mongoose.connect(mongoURI,{
          
            serverSelectionTimeoutMS: 5000,
        })
        console.log(`Conectado a la base de datos en modo ${process.env.NODE_ENV}`)
        
    } catch (error) {
        console.log(error);
        Error("Error al conectarse a la base de datos")
        process.exit(1)
    }
};