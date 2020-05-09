import { Request, Response } from 'express';
import { get, controller } from './decorators';

@controller('/auth')
class LoginController {
    @get('/login')
    getLogin(req: Request, res: Response): void {
    res.send(`
        <form method="post">
            <div>
                <label for="email">Email</label>
                <input type="email" name="email">
            </div>
            <div>
                <label for="password">Password</label>
                <input type="password" name="password">
            </div>
            <button>Submit</button>
        </form>
    `);
    };
}
