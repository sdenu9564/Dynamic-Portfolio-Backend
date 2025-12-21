import { NextFunction, Router } from "express";
import HttpStatus from "http-status";

import APIError from "../services/error.service";
import logErrorService from "../services/log.service";

import PotfolioRoutes from "./portfolio.routes";
import MarketRoutes from "./market.routes";  

const routes = Router();

routes.use('/portfolio', PotfolioRoutes);

routes.use('/market', MarketRoutes);         

routes.all('', (req, res, next) =>
  next(new APIError('Route Not Found!', HttpStatus.NOT_FOUND, true))
);

routes.use(logErrorService);

export default routes;
