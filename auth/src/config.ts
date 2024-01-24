interface IConfig {
  PORT: number;
  JWT_SECRET: string;
  ROUTE_ADDRESS: string;
}

export const config: IConfig = {
  PORT: 8080,
  JWT_SECRET: "",
  ROUTE_ADDRESS: "http://localhost:5000"
}

export const LoadConfig = () => {
  const port = process.env.PORT ? Number(process.env.PORT) : 8888;
  const route_address = process.env.ROUTE_ADDRESS ? process.env.ROUTE_ADDRESS : config.ROUTE_ADDRESS;
  config.PORT = port;
  config.ROUTE_ADDRESS = route_address;
}