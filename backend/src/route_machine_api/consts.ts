// Сервисы OSRM
export const enum Services {
  ROUTE, //сервис вычисления оптимального маршрута между упорядоченно заданными точками
  TRIP  //сервис вычисления оптимального маршрута для задачи Коммивояжёра
}

export const incorrectServiceParameter = "Parameter 'service' is incorrect";
export const incorrectRouteMachineWork = "The error occurred while routing machine was working";
export const incorrectGeocoderWork = "The error occurred while geocoder was working";

export const serverOSRMAddress = "http://localhost:5000/";

export const osrmServiceRoute  = "route/";
export const osrmServiceTrip  = "trip/";
export const osrmServiceVersion = "v1/";
export const osrmProfileCar = "driving/";

export const osrmRouteOptions = "overview=false";

export const osrmTripOptions = "roundtrip=false&source=first&destination=last&steps=true";