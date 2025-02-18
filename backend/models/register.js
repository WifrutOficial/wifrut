import mongoose from "mongoose";
import bcrypt from "bcrypt";

const registerModel = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "El email no es válido"],
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
      maxlength: 10,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
      minlength: 8,
      validate: {
        validator: function (value) {
          // Asegurarse que la contraseña tenga al menos una mayúscula, un número y un símbolo
          const passwordRegex =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
          return passwordRegex.test(value);
        },
        message:
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.",
      },
    },
    tipoUsuario: {
      type: String,
      enum: ["mayorista", "minorista", "admin"],
      required: true,
    },
    estadoCuenta: {
      type: String,
      enum: ["pendiente", "aprobado", "rechazado"],
      default: "pendiente",
    },
  },
  {
    timestamps: true,
  }
);

//cifrado de contraseña
registerModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// metodo de comparacion de contraseña
registerModel.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Register = mongoose.model("Register", registerModel);
export default Register;
