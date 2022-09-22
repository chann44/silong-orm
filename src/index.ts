import ast from "../db/a.json"

const SQL_TYPE: any = {
    "number": "int",
    "string": "varchar"
}

const SPECIAL_CHARS: any = {
    "autocomplete": "SERIAL",
    "id": "PRIMARY KEY"
}

let tableNames = ast.tables.map(t => t.name)

ast.tables.map(as => {
    let query = ["CREATE", "TABLE"]
    if(as.type === "table") {

        const tableName = as.name
        query.push(tableName)
        query.push("(")

        const schemas = as.variables

        query.push("ID","SERIAL", "PRIMARY", "KEY", ",")

        schemas.map((schema, idx) => {
            query.push(schema.name)
            if(!SQL_TYPE[schema.type]) {
                if(tableNames.includes(schema.type)) query.push(schema.type)
                else throw new Error(`${schema.type} is not a scalar type nor a table`)
            }
            else {
                query.push(SQL_TYPE[schema.type] === 'varchar' ? `${SQL_TYPE[schema.type]}(${schema.attributes.find(a => a.name === 'length')?.value})` : SQL_TYPE[schema.type])
            }

            if(schema.attributes.length > 0) {
                schema.attributes.map(attribute => {
                    query.push(SPECIAL_CHARS[attribute.name])
                })
            }

            if(idx < schemas.length - 1) query.push(",")
        })

        query.push(")")
    }

    console.log(query.join(" "))
})