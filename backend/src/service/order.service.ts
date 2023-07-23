import { readFileSync } from "fs";
import OrderModel, {TOrderDoc} from "../models/order.model";
import { getProperties, KeyValuePairObject } from 'properties-file'

const properties: KeyValuePairObject = getProperties(readFileSync('./properties/error_messedge_en.properties'))

// types

type TData = String | Date;

// end types

export async function createOrder(order: TOrderDoc): Promise<void> {
    try {
        if (!(await OrderModel.create(order))) {
            throw new Error(properties.errorOrderCreate);
        }
    } catch(error) {
        console.log(error);
        throw error;
    }
}

export async function getOrder(id: string) {
    try {
        const order = await OrderModel.findById(id);
        if (!order) {
            throw new Error(properties.errorOrderGet);
        }
        return order;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

export async function getAllOrders(page: number, pageSize: number) {
    try {
        const orders = await OrderModel.find({})
            .sort({_id: -1})
            .skip(page * pageSize)
            .limit(pageSize);
        if (!orders) {
            throw new Error(properties.errorNoOrders);
        }
        return orders;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

export async function deleteOrder(id: string) {
    try {
        if(!(await OrderModel.findByIdAndDelete(id))) {
            throw new Error(properties.errorOrderDelete);
        }
    } catch(error) {
        console.log(error);
        throw error;
    }
}

export async function updateOrder(id: string, data: TData) {
    try {
        if(!(await OrderModel.findByIdAndUpdate(id, data, {upset: true}))) {
            throw new Error(properties.errorOrderUpdate);
        }
    } catch(error) {
        console.log(error);
        throw error;
    }
}

export async function findOrdersBySomething(data: TData, page: number, pageSize: number) {
    try {
        const orders = await OrderModel.find({data})
            .sort({_id: -1})
            .skip(page * pageSize)
            .limit(pageSize);
        if (!orders) {
            throw new Error(properties.errorNoOrders);
        };
        return orders;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

export async function findSiilarOrders() {
    // TO_DO Create metric
}
