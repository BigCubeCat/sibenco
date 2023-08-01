import fetch from 'node-fetch';

type Waypoint = {
    nodes?: number[],
    hint: string,
    distance: number,
    name: string,
    location: number[]
    trips_index?: number,
    waypoint_index?: number
};

type Lane = {
    indications: string[],
    valid: boolean
};

type Intersection = {
    location: number[],
    bearings: number[],
    classes: string[],
    entry: boolean[],
    in: number,
    out: number,
    lanes: Lane[]
};

type StepManeuver = {
    location: number[],
    bearing_before: number,
    bearing_after: number,
    type: string,
    modifier?: string,
    exit?: number
};

type RouteStep = {
    distance: number,
    duration: number,
    geometry: string,
    weight: number,
    name: string,
    ref: string,
    pronunciation?: string,
    destinations?: string[],
    exits: number[],
    mode: string,
    maneuver: StepManeuver,
    intersections: Intersection[],
    rotary_name?: string,
    rotary_pronunciation?: string,
    driving_side: string
};

type Leg = {
    steps: RouteStep[],
    distance: number,
    duration: number,
    summary: string,
    weight: number
};

type  Route = {
    legs: Leg[],
    distance: number,
    duration: number,
    weight_name: string,
    weight: number
};

type RouteResponse = {
    code: string,
    routes: Route[],
    waypoints: Waypoint[]
}

type TripResponse = {
    code: string,
    waypoints: Waypoint[],
    trips: Route[]
}

async function getRoute(address: string){
    try{
        const response = await fetch(address, { //"http://localhost:5000/route/v1/driving/144.95800,-37.85247;144.96360,-37.85128?overview=false"
                method: "GET"
            });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = (await response.json()) as RouteResponse;
        console.log(result.routes[0].legs[0].steps[132]);

    } catch(error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
        } else {
            console.log('unexpected error: ', error);
        }
    }
}

async function getTrip(address: string){
    try{
        const response = await fetch(address, { //"http://localhost:5000/trip/v1/driving/144.95800,-37.85247;144.96360,-37.85128;144.9552,-37.8478;144.96009,-37.84716?roundtrip=true&source=first&destination=any&steps=false"
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = (await response.json()) as TripResponse;
        console.log(result);

    } catch(error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
        } else {
            console.log('unexpected error: ', error);
        }
    }
}


const requestOptions = {
    method: 'GET',
};



function getGeoCode() {
    fetch("https://api.geoapify.com/v1/geocode/search?text=254%20Антона%20Петрова%20Улица%2C%20Барнаул%2C%20Российская%20Федерация&apiKey=2481c54dc9de4bd999aed241c464c094", requestOptions)
        .then(response => response.json())
        .then((result: any) => {
            console.log(result.features[0].properties.lon)
            console.log(result.features[0].properties.lat)
        })
        .catch(error => console.log('error', error));
}

getRoute("http://localhost:5000/route/v1/driving/144.95800,-37.85247;152.930,-27.508?steps=true");
//getGeoCode();