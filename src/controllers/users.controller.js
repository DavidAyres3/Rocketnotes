const { hash, compare } = require ("bcryptjs")
const sqliteConnection = require("../database/sqlite")
const AppError = require("../utils/AppError")
class UsersController {
    async create(request, response){
        const { name, email, password } = request.body

        const database = await sqliteConnection()
        const CheckEmails = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if (CheckEmails) {
            throw new AppError("E-mail já cadastrado.")
        }

        const hashedPasswords = await hash(password, 8)


        await database.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
             [name, email, hashedPasswords]
             )

        return response.status(201).json()
    }

    async update(request, response){
        const { name, email, password, old_password } = request.body
        const { id } = request.params

        const database = await sqliteConnection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

        if(!user) {
            throw new AppError("Usuário não encontrado.")
        }

        const CheckUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if (CheckUpdatedEmail && CheckUpdatedEmail.id !== id){
            throw new AppError("E-mail já cadastrado em outro usuário.")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if(password && !old_password) {
            throw new AppError("Você precisa informar a senha antiga para atualizar sua senha.")
        }

        if (password && old_password){
            const CheckPasswords = await compare(old_password, user.password)

            if (!CheckPasswords) {
                throw new AppError("Senha antiga não confere.")
            }            
            user.password = await hash(password, 8)
        }

        await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = ?
        WHERE id = ?`, 
        [user.name, user.email, user.password, new Date(), id])

        return response.json()
    }
}

module.exports = UsersController