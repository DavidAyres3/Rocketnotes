
exports.up = knex => knex.schema.createTable("notes", table => {
    table.increments("id")
    table.text("title")
    table.text("description")
    table.integer("avaliation")
    table.integer("user_id").references("id").inTable("users")
})


exports.down = knex => knex.schema.dropTable("notes")