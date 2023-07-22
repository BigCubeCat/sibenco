import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    typeOfTrasportation: {
        type: String,
        unique: false,
        required: true,
    },
    date: {
        type: Date,
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

const OrderModel = mongoose.model("OrderModel", OrderSchema);
export default OrderModel;
