/**
 * @see		{@link https://nodejs.org/api/net.html Node.js v17.2.0 documentation}
 * @see		{@link https://www.youtube.com/watch?v=UAhWwSJbRnI NodeJS Essentials 08: Net & HTTP Module}
 * @see		{@link https://www.youtube.com/watch?v=HyGtI17qAjM How to develop TCP Server (Network) application using NodeJs}
 * @see		{@link https://www.npmjs.com/package/mysql#introduction mysql}
 * @see		{@link https://techsparx.com/nodejs/howto/mysql-ssl-connect.html Using SSL to connect to MySQL database in Node.js}
 * @see		{@link https://techsparx.com/nodejs/howto/mysql-ssl-connect.html Using SSL to connect to MySQL database in Node.js}
 * @see		{@link https://dev.mysql.com/doc/refman/8.0/en/using-encrypted-connections.html 6.3.1 Configuring MySQL to Use Encrypted Connections}
 * @see		{@link https://stackoverflow.com/questions/49089285/is-ssl-true-a-valid-option-to-connect-to-a-mysql-server-using-ssl Is "ssl : true" a valid option to connect to a mysql server using ssl}
 * @see		{@link https://mariadb.com/kb/en/nodejs-connection-options/#one-way-ssl-authentication One-way SSL Authentication}
 * @see		{@link https://www.youtube.com/watch?v=2oFKNL7vYV8 Getting started with Node.js debugging in VS Code}
 */
const net = require("net");
const mysql = require("mysql");

const server = net.createServer();

/* eslint no-console: off */


/*	At the connection event, node.js creates an instance of net.Socket.
     The parameter sock is the net.Socket instance just created. */
server.on("connection", (sock) => {
    console.log("Client connected to this node.js (Net) server!\n");

    // Defines the encoding of the connection socket.
    sock.setEncoding("utf8");

    // On receiving data from the client. Buffer or string.
    sock.on("data", (data) => {
        function writeResultInSocket(resultSet) {
            let resultAsJSON;

            // The result is validated via JSON.parse().
            try {
                resultAsJSON = JSON.parse(resultSet);
            } catch (e) {
                resultAsJSON = "";
                console.log("\nError. The result was empty.");
                console.log("\nThe result should be at least an empty array.");
            }

            // Converting to a string before sending.
            resultAsJSON = JSON.stringify(resultAsJSON);
            sock.write(resultAsJSON);
            sock.end();
        }

        // Transforms the JSON string in JavaScript object.
        const parsedData = JSON.parse(data);

        // Create a connection.
        const connection = mysql.createConnection({
            host: parsedData.databaseParameters.host,
            user: parsedData.databaseParameters.user,
            password: parsedData.databaseParameters.password,
            database: parsedData.databaseParameters.database,

            // One-way SSL Authentication.
            ssl: parsedData.databaseParameters.ssl,
        });

        // Connect to MySQL.
        connection.connect((err) => {
            if (err) {
                console.log("\n============================================================================");
                console.error(`Error connecting to the database: ${err.stack}`);
                // return;
                throw err;
            }
            console.log(
                "Connected to the database!\n---------------------------"
            );
        });

        // Execute query.
        connection.query(parsedData.sql, (err, result) => {
            if (err) {
                // throw err;
                writeResultInSocket(JSON.stringify(err.sqlMessage));
            }

            // The result has to be a string to be processed.
            writeResultInSocket(JSON.stringify(result));

            console.log("\nQuery executed.");
        });

        // Close the connection.
        connection.end((err) => {
            if (err) {
                throw err;
            }
            console.log(
                "\nThe connection with the database was closed.\n---------------------------------------------\n"
            );
        });
    });

    // The connection socket is destroyed on this event.
    sock.on("close", () => {
        console.log("The client closed the connection socket.\n");
    });

    sock.on("error", (err) => {
        throw err;
    });
});

// At the error event, node.js creates an instance of Error.
server.on("error", (err) => {
    throw err;
});

const port = 8124;
server.listen(port, () => {
    console.log(`\nServer listening on port ${port}.\n`);
});