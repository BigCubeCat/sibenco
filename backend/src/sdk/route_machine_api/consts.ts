// Сервисы OSRM
import {config} from "../../config";

// TODO config
export const serverOSRMAddress = config.osrm.url;

export const osrmServiceRoute = 'route/';
export const osrmServiceTrip = 'trip/';
export const osrmServiceVersion = 'v1/';
export const osrmProfileCar = 'driving/';

export const osrmRouteOptions = 'steps=false&annotations=true';

export const osrmTripOptions =
  'roundtrip=false&source=first&destination=last&steps=false';
