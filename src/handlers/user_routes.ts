import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/users'
const jwt = require('jsonwebtoken')

const store = new UserStore()

const index = async(_req: Request, res: Response) => {
    try {
        const allUsers = store.index()
        res.json(allUsers)
    } catch (err) {
        res.status(400)
        console.log(err)
    }
}


const create = async(_req: Request, res: Response) => {
    const user: User = {
        firstname: _req.body.firstname,
        lastname: _req.body.lastname,
        username: _req.body.username,
        password: _req.body.password
    }

    try {
        const newUser = await store.create(user)
        const token = jwt.sign({user: newUser}, process.env.TOKEN_SECRET, {expiresIn: '24h'});
        res.cookie('jwt', token, {httpOnly: true, secure: false});
        res.send('JWT cookie is set');
    } catch(err) {
        res.status(400)
        console.log(err)
    }
}

const show = async(_req: Request, res: Response) => {
    try {
        const userId = _req.params.id
        const user = store.show(userId)
        res.json(user)
    } catch(err) {
        res.status(400)
        console.log(err)
    }
}


const user_routes = (app: express.Application) => {
    app.get('/users', index)
    app.post('/users', create)
    app.get('/users/:id', show)
    
    return app
}

export default user_routes