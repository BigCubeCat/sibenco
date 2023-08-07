import OrderModel, {TOrderDoc} from "../models/order.model";

export async function createOrder(order: TOrderDoc): Promise<void> {
    try {
        if (!(await OrderModel.create(order))) {
            throw new Error("Eror writing to the database");
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
            throw new Error("Not Found");
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
            throw new Error("There are no more orders");
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
            throw new Error("Deletion error from the database: object does not exists");
        }
    } catch(error) {
        console.log(error);
        throw error;
    }
}

export async function updateOrder(id: string, data: any) {
    try {
        if(!(await OrderModel.findByIdAndUpdate(id, data, {upset: true}))) {
            throw new Error("Error updating information in the database");
        }
    } catch(error) {
        console.log(error);
        throw error;
    }
}

export async function findOrdersBySomething(data: any, page: number, pageSize: number) {
    try {
        const orders = await OrderModel.find({data})
            .sort({_id: -1})
            .skip(page * pageSize)
            .limit(pageSize);
        if (!orders) {
            throw new Error("There are no more orders");
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
