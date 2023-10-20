import client from '../database'
const bcrypt = require('bcrypt')
const pepper = process.env.BCRYPT_PASSWORD
const saltRounds = process.env.SALT_ROUNDS

export type User = {
    firstname: string,
    lastname: string,
    username: string,
    password: string
}

export class UserStore {

    async index(): Promise<User[]> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release()
            return result.rows
        } catch(err) {
            console.log("Couldnt get all users")
            throw new Error(`Couldnt get all users. Error: ${err}`)
        }
    }

    async create(u: User): Promise<User> {
        try {

            const conn = await client.connect()
            const sql = 'INSERT INTO users (firstname, lastname, username, pwd_digest) VALUES($1, $2, $3, $4)';
            const hash = bcrypt.hashSync(
                u.password + pepper,
                parseInt(saltRounds as string)
            );
            const result = await conn.query(sql, [u.firstname, u.lastname, u.username, hash])
            const user = result.rows[0]

            conn.release()
            console.log(`User (${u.username}) was created`);
            return user
        } catch(err) {
            console.log(`User (${u.username}) failed to create ${err}`);
            throw new Error(`unable to create user (${u.username}): ${err}`)
        }
    }

    async show(id: string): Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE id=($1)'
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch(err) {
            console.log(`No user with id:(${id}) failed ${err}`)
            throw new Error(`Could not find userId ${id}. Error: ${err}`)
        }
    }

    async authenticate(username: string, password: string): Promise<User|null> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM users WHERE username = ($1)'

            const result = await conn.query(sql, [username])
            //console.log(password + pepper) 
            if(result.rows.length) {
                const user = result.rows[0]
                console.log(user)
            
                if(bcrypt.compareSync(password+pepper, user.pwd_digest)) {
                    return user
                }
            }
            console.log(`Username ${username} does not exist!`)
            return null
        } catch (err) {
            console.log(err)
            return null
        }
    }
}