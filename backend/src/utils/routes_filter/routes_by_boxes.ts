import { I_RouterDocument } from "../../models/route.model";

export async function getNearestInBoxesRoutes(routes: I_RouterDocument[], route: I_RouterDocument) {
    let simialarRoutesByBoxes = [];
    for (let i = 0; i < routes.length; ++i) {
        let countEquals: number = 0;
        for (let k = 0; k < route.route.boxes.length; ++k) {
            for (let m = 0; m < routes[i].route.boxes.length; ++m) {
                if (routes[i].route.boxes[m] == route.route.boxes[k]) {
                    ++countEquals;
                }
            }
        }
        const minLength = Math.min(routes[i].route.boxes.length, route.route.boxes.length);
        console.log("Hello", routes[i]._id, countEquals, minLength);
        if (countEquals * 100 / minLength >= 25) {
            simialarRoutesByBoxes.push(routes[i]);
        }
    }
    return simialarRoutesByBoxes;
}