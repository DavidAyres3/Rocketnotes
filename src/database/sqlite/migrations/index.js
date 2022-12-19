const sqliteConnection = require ("..")
const createUsers = require ("./CreateUsers")

async function migrationsRun() {
    const schemas = [
        createUsers
    ].join("")

    sqliteConnection().then(db => db.exec(schemas))
    .catch(e => console.log(e))

}

module.exports = migrationsRun