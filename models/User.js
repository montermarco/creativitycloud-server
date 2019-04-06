const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
    //Datos de usuario de registro
    username: String,
    email: String,
    password: String,
    role: String,
    activo: {type: Boolean, default: true },
    pic:{name:String, path: String},
    linkedin: Boolean,
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project'}],
    // Datos de la org o marca
    organizacion: String,
    year: String,
    rfc: String,
    donatario: Boolean,
    contacto: String,
    cargo: String,
    mail: String,
    // Datos de la causa o projecto
    titulo: String,
    categoria: String,
    personas: Number,
    zonas: [String],
    apoyo: String,
    fecha: Date,
    rango: Number,
    explica: String,
    descripcion: String,
    fotos: { name: String, path: String },
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

