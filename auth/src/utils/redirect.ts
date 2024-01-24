import {config} from "../config";

export const redirectedUrl = (url: string, server = 'route') => {
  if (server === 'route') {
    return config.ROUTE_ADDRESS + url;
  }
  return '';
}