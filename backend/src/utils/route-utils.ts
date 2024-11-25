import { Express, Router } from 'express';

// Configures Express routes using module-based routing to avoid cyclic dependencies
function routesConf(app: Express, routeList: { prefix: string; router: Router }[]): void {
  routeList.forEach(({ prefix, router }) => {
    app.use(prefix, router);
  });
}

export { routesConf };