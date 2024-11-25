import { Express, Router } from 'express';

// Configures express routes with modules routes
function routesConf(app: Express, routeList: { prefix: string; router: Router }[]): void {
  routeList.forEach(({ prefix, router }) => {
    app.use(prefix, router);
  });
}

export { routesConf };