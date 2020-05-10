import 'reflect-metadata';
import { AppRouter } from "../../AppRouter";
import { Methods } from "./Methods";
import { MetadataKeys } from "./MetadataKeys";
import { Request, Response, NextFunction, RequestHandler } from "express";

function bodyValidators(keys: string): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.body) {
            res.status(422).send('invalid request');
            return;
        }

        for (let key of keys) {
            if(!req.body[key]) {
                res.status(422).send('missing property key')
            }
        }

        next();
    }
}

export function controller(routePrefix: string) {
    return function (target: Function) {
        const router = AppRouter.getInstance();

        for (let key in target.prototype) {
            if (target.prototype.hasOwnProperty(key)) {
                const routeHandler = target.prototype[key];
                const path = Reflect.getMetadata(
                    MetadataKeys.path,
                    target.prototype,
                    key
                );
                const method: Methods = Reflect.getMetadata(
                    MetadataKeys.method,
                    target.prototype,
                    key
                );
                const middlewares = Reflect.getMetadata(
                    MetadataKeys.middleware,
                    target.prototype,
                    key
                ) || [];

                const requiredBodyProps = Reflect.getMetadata(
                    MetadataKeys.validator,
                    target.prototype,
                    key) || [];

                const valiadtor = bodyValidators(requiredBodyProps);

                if (path) {
                    router[method](
                        `${routePrefix}${path}`,
                        ...middlewares,
                        valiadtor,
                        routeHandler
                    );
                }
            }
        }
    }
}
