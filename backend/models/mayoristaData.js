import mongoose from "mongoose";

const mayoristaDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register", 
   
    },
    cuil: {
      type:Number,
      required: true,
      unique: true,
      trim: true,
    },
    provincia: {
      type: String,
      required: true,
    },
    localidad: {
      type: String,
      required: true,
    },
    aniosActividad: {
      type: Number,
      required: true,
    },
    
  },
  {
    timestamps: true,
  }
);

const MayoristaData = mongoose.model("MayoristaData", mayoristaDataSchema);
export default MayoristaData;
