import { Router, Request, Response, NextFunction } from "express";

interface RequestWithBody extends Request{
    body: { [key: string]: string | undefined }
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (req.session && req.session.loggedIn) {
        next();
        return;
    }

    res.status(403);
    res.send('not permitted');
}

const router = Router();

router.get('/', (req: Request, res: Response) => {
    if (req.session && req.session.loggedIn) {
        res.send(`
            <div>you are logged in</div>
            <a href="/logout">Logout</a>
        `)
    } else {
        res.send(`
            <div>you are not logged in</div>
            <a href="/login">Login</a>
        `)
    }
})

router.get('/logout', (req: Request, res: Response) => {
    req.session = undefined;
    res.redirect('/');
})

router.get('/protected', requireAuth, (req: Request, res: Response) => {
    res.send('protected route, logged in user')
})

export { router };
