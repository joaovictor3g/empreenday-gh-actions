import express, { json, IRoute } from "express";
import http from "http";

import { config as setupEnv } from "dotenv";

setupEnv();

export const getEnvVar = (n: string) => process.env[n];
const app = express();
export const httpServer = http.createServer(app);

const configDependencies = () => {
  app.use(json());
};

const configRoutes = () => {
  let routes = [];

  app.get("/health", (_req, res) => {
    res.sendStatus(200);
  });

  app.get("/ping2", (_req, res) => {
    res.send("pong2");
  });

  app.get("/who", (req, res) => {
    console.log(req.headers);
    res.send(req.headers);
  });

  // subroute example

  const subRouter = express();
  app.get("/subRoute", subRouter);

  subRouter.use("*", (_req, res) => {
    routes = app.routes;
    res.json(getRoutes(subRouter._router.stack));
  });

  app.use("*", (_req, res) => {
    routes = app.routes;
    res.json(getRoutes(app._router.stack));
  });
};

const getRoutes = (stack: any, routes: string[] = []) => {
  stack.map((l) => {
    const r: IRoute = l.route;
    if (r?.path) {
      routes.push(r.path);
    }
  });
  return routes;
};

export async function init() {
  // starts
  configDependencies();
  configRoutes();

  httpServer.listen(getEnvVar("PORT"), () =>
    console.log(`Api running on port: ${getEnvVar("PORT")}`)
  );
}

export async function close() {
  httpServer?.close();
}

export default app;
