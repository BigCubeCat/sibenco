export async function getNearestInBoxesRoutes(routes: any[]) {
    let simialarRoutesByBoxes = [];
    let isInArray: boolean[] = [];
    isInArray.length = routes.length;
    isInArray.fill(false);
    for(let i = 0; i < routes.length - 1; ++i) {
        for(let j = i + 1; j < routes.length; ++j) {
            let countEquals: number = 0;
            for(let k = 0; k < routes[i].route.boxes.length; ++k) {
                for(let m = 0; m < routes[j].route.boxes.length; ++m) {
                    if(routes[i].route.boxes[k] == routes[j].route.boxes[m]) {
                        ++countEquals;
                    }
                }
            }
            
            const minLength = min(routes[i].route.boxes.length, routes[j].route.boxes.length);
            if(countEquals * 100 / minLength >= 60) {
                if (!isInArray[i] && !isInArray[j]) {
                    simialarRoutesByBoxes.push(routes[i], routes[j]);
                    isInArray[i] = true;
                    isInArray[j] = true;
                } else if (!isInArray[i]) {
                    simialarRoutesByBoxes.push(routes[i]);
                    isInArray[i] = true;
                } else if (!isInArray[j]) {
                    simialarRoutesByBoxes.push(routes[j]);
                    isInArray[j] = true;
                }
            }
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