export type Waypoint = {
  nodes: number[];
  hint: string;
  distance: number;
  name: string;
  location: number[];
  tripsIndex: number;
  waypoint_index: number;
};

export type Lane = {
  indications: string[];
  valid: boolean;
};

export type Intersection = {
  location: number[];
  bearings: number[];
  classes: string[];
  entry: boolean[];
  in: number;
  out: number;
  lanes: Lane[];
};

export type StepManeuver = {
  location: number[];
  bearingBefore: number;
  bearingAfter: number;
  type: string;
  modifier: string;
  exit: number;
};

export type RouteStep = {
  distance: number;
  duration: number;
  geometry: string;
  weight: number;
  name: string;
  ref: string;
  pronunciation: string;
  destinations: string[];
  exits: number[];
  mode: string;
  maneuver: StepManeuver;
  intersections: Intersection[];
  rotaryName: string;
  rotaryPronunciation?: string;
  drivingSide: string;
};

export type Leg = {
  steps: RouteStep[];
  distance: number;
  duration: number;
  summary: string;
  weight: number;
};

export type Route = {
  legs: Leg[];
  distance: number;
  duration: number;
  weightName: string;
  weight: number;
};

export type RouteResponse = {
  code: string;
  routes: Route[];
  waypoints: Waypoint[];
};

export type TripResponse = {
  code: string;
  waypoints: Waypoint[];
  trips: Route[];
};

export type ResultWaypoint = {
  index: number;
  location: Array<number>;
};

export type RouteData = {
  waypoints: Array<ResultWaypoint>;
  steps: Array<Array<number>>;
  distance: number;
};
