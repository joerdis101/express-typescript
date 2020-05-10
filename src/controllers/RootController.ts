import { NextFunction, Request, Response } from "express";
import { controller, get, use } from "./decorators";

function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (req.session && req.session.loggedIn) {
        next();
        return;
    }

    res.status(403);
    res.send('not permitted');
}

@controller('')
class RootController {
    @get('/')
    getRoot(req: Request, res: Response) {
        if (req.session && req.session.loggedIn) {
            res.send(`
            <div>you are logged in</div>
            <a href="/auth/logout">Logout</a>
        `)
        } else {
            res.send(`
            <div>you are not logged in</div>
            <a href="/auth/login">Login</a>
        `)
        }
    }

    @get('/protected')
    @use(requireAuth)
    getProtected(req: Request, res: Response) {
        res.send('protected route, logged in user')
    }
}
