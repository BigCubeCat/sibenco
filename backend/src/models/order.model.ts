import mongoose from "mongoose";

interface TOrder {
    typeOfTrasportation: String,
    date: String, // TODO Date
    loadigAdress: String,
    unloadingAdress: String,
    cargoName: String,
    distance: String,
    specialMarks: String,
    client: String
}

export interface TOrderDoc extends TOrder, mongoose.Document {}

const OrderSchema: mongoose.Schema<TOrderDoc> = new mongoose.Schema({
    typeOfTrasportation: {
        type: String,
        unique: false,
        required: true,
    },
    date: {
        type: String,
        unique: false,
        required: true
    },
    loadigAdress: {
        type: String,
        unique: false,
        required: true
    },
    unloadingAdress: {
        type: String,
        unique: false,
        required: true
    },
    cargoName: {
        type: String,
        unique: false,
        required: true
    },
    distance: {
        type: String,
        unique: false,
        required: true
    },
    specialMarks: {
        type: String,
        unique: false,
        required: false
    },
    client: {
        type: String,
        unique: false,
        require: true
    }
})

const OrderModel = mongoose.model<TOrderDoc>("OrderModel", OrderSchema);
export default OrderModel;
