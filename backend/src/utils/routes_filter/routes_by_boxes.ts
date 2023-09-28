export async function getNearestInBoxesRoutes(routes: any[], route: any) {
    let simialarRoutesByBoxes = [];
    for(let i = 0; i < routes.length; ++i) {
        let countEquals: number = 0;
        for(let k = 0; k < route.route.boxes.length; ++k) {
            for(let m = 0; m < routes[i].route.boxes.length; ++m) {
                if(routes[i].route.boxes[k] == route.route.boxes[m]) {
                    ++countEquals;
                }
            }
        }
            
        const minLength = min(routes[i].route.boxes.length, route.route.boxes.length);
        if(countEquals * 100 / minLength >= 60) {
            simialarRoutesByBoxes.push(routes[i]);
        }
    }
    return simialarRoutesByBoxes;
}


function min(a: number, b: number) {
    if (a < b) {
        return a;
    }
    return b;
}