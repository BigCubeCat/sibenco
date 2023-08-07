import { Request, Response } from "express";
import { getErrorMessage } from "../utils/error";
import * as orderService from "../service/order.service"
import { config } from "../config";

export const createOrder = async (req: Request, res: Response) => {
    try {
        await orderService.createOrder(req.body);
        res.status(200).send("User created successfully");
    } catch (error) {
        return res.status(500).send(getErrorMessage(error));
    }
}

export const getOrder = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).send(getErrorMessage(new Error('Bad id')));
        }
        const order = await orderService.getOrder(req.params.id);
        res.status(200).send(order);
    } catch (error) {
        return res.status(500).send(getErrorMessage(error));
    }
}

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const page: number =
            typeof req.query.page == 'string' ? Number(req.query.page) : 0;
        const pageSize: number =
            typeof req.query.page_size == 'string'
                ? Number(req.query.page_size)
                : config.PAGE_SIZE;
        const orders = await orderService.getAllOrders(page, pageSize);
        res.status(200).send({orders});
    } catch (error) {
        return res.status(500).send(getErrorMessage(error));
    }
}

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).send(getErrorMessage(new Error('Bad id')));
        }
        await orderService.deleteOrder(req.params.id);
        res.status(200).send("Order deleted successfuly");
    } catch (error) {
        return res.status(500).send(getErrorMessage(error));
    }
}

export const updateOrder = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).send(getErrorMessage(new Error('Bad id')));
        }
        await orderService.updateOrder(req.params.id, req.body);
        res.status(200).send("Order updated successfuly");
    } catch (error) {
        return res.status(500).send(getErrorMessage(error));
    }
}

export const findOrdersBySomething = async (req: Request, res: Response) => {
    try {
        const page: number =
            typeof req.query.page == 'string' ? Number(req.query.page) : 0;
        const pageSize: number =
            typeof req.query.page_size == 'string'
                ? Number(req.query.page_size)
                : config.PAGE_SIZE;
        const orders = await orderService.findOrdersBySomething(req.body, page, pageSize);
        res.status(200).send({orders});
    } catch (error) {
        return res.status(500).send(getErrorMessage(error));
    }
}
