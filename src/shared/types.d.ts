/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "ConnectionData" }] */

type ConnectionData = {
    databaseParameters: {
        host: string,
        user: string,
        password: string,
        database: string,
        ssl: boolean, // One-way SSL Authentication
    },

    sql: string
}