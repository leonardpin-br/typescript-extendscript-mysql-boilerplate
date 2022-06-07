/**
 * This is how the db-credentials.jsx file should be written.
 */

/* eslint no-var: off */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "connectionData" }] */

var connectionData = {
    databaseParameters: {
        host: 'localhost', // The hostname or the IP ('127.0.0.1') as a string.
        user: 'the_username',
        password: 'the_password',
        database: 'the_database_name',
        ssl: true, // One-way SSL Authentication
    },

    sql: "SHOW SESSION STATUS LIKE 'Ssl_cipher'", // This SQL will be overwritten.
};
