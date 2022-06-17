//DESCRIPTION: File (not module) with useful functions.
/**
 * Modified 2022-06-11
 * @file		File (not module) with useful functions shared by <br />
 * 				other scripts in the application project.
 * @copyright	Leonardo Pinheiro 2021
 * @author		Leonardo Pinheiro, UERJ <info@leonardopinheiro.net>
 * @see			<a href="https://www.leonardopinheiro.net" target=_blank>Leonardo Pinheiro Designer</a>
 * @see			{@link https://www.alanwsmith.com/clearing-extendscript-toolkit-console Clearing the Adobe ExtendScript ToolKit Console Window}
 * @see			{@link https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#polyfill Polyfill}
 * @see			{@link https://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string#answer-36876507 How to check if a string "StartsWith" another string?}
 * @see			{@link https://stackoverflow.com/questions/9329446/for-each-over-an-array-in-javascript#answer-9329476 For-each over an array in JavaScript}
 * @see			{@link https://www.youtube.com/watch?v=BvikbwV3O_c How to develop TCP Client (Network) application using NodeJs}
 * @see			{@link https://extendscript.docsforadobe.dev/external-communication/socket-object-reference.html#close close()}
 */

/* global	BridgeTalk,
            Socket,
            $,
            Connection,
            connectionData */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "ConnectionData|clearConsole|dbConnect|numberFormat|passwordHash|sendMessageToServer" }] */
/* eslint no-param-reassign: off */

/**
 * @typedef ConnectionData
 * @type {object}
 * @property {object} databaseParameters - The parameters for the connection with the database.
 * @property {string} databaseParameters.host - The MySQL IP address.
 * @property {string} databaseParameters.user - The MySQL user name.
 * @property {string} databaseParameters.password - The MySQL password.
 * @property {string} databaseParameters.database - The MySQL database name.
 * @property {boolean} databaseParameters.ssl - If the SSL encription will be used or not.
 * @property {string} sql - The SQL string to be executed.
 */

/**
 * Function to clear the ExtendScript Toolkit's console.
 */
function clearConsole() {
    const estApp = BridgeTalk.getSpecifier('estoolkit');
    if (estApp) {
        const bt = new BridgeTalk();
        bt.target = estApp;
        bt.body = 'app.clc()';
        bt.send();
    }
}

/**
 * Creates a new instance of the Connection class, using the connectionData
 * from the &lt;projectRoot&gt;/config/db-credentials.jsx file.
 *
 * @return {Connection} {Connection} A new instance of Connection.
 */
function dbConnect() {
    /// @ts-ignore: Cannot find name 'connectionData'
    const connection = new Connection(connectionData);
    return connection;
}

function numberFormat(number, decimals, decPoint?, thousandsSep?) {
    // Strip all characters but numerical ones.
    number = `${number}`.replace(/[^0-9+\-Ee.]/g, '');
    let n = !isFinite(+number) ? 0 : +number;
    const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    const sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep;
    const dec = typeof decPoint === 'undefined' ? '.' : decPoint;
    let s = [];
    const toFixedFix = (n, prec) => {
        const k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
    };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

/**
 * Sends a message to the node.js server (created using the net module).
 * @param {string} message  The message (an object as a string in JSON format) to be sent to the Node.js (Net) server.
 *                          If it is a query, will be passed on to the MySQL server.
 *                          If it is a password to be hashed, the socket server will hash it and send the response back.
 * @param {string} [host=127.0.0.1] Optional. The IP or name of the (Net) server. Defaults to &ldquo;127.0.0.1&rdquo;.
 * @param {number} [port=8124]  Optional. The port that the (Net) server is listening on. Defaults to 8124.
 * @param {string} [encoding=UTF-8] Optional. The encoding. Defaults to &ldquo;UTF-8&rdquo;.
 * @returns {?string} {?string} The reply from the (Net) server. null if there is no answer.
 */
function sendMessageToServer(
    message: string,
    host: string = '127.0.0.1',
    port: number = 8124,
    encoding: string = 'UTF-8'
): string | null {
    let reply = '';
    let connection = new Socket();
    connection.timeout = 600000;

    if (connection.open(`${host}:${port}`, encoding)) {
        // Send the message (probably a SQL query string) to the server.
        connection.write(message);

        reply = connection.read(99999999999);

        connection.close();
    } else {
        connection.close();
        connection = null;
        $.writeln(
            'Warning:\nCannot establish connection to the node.js server!'
        );
        return null;
    }

    if (reply.length > 0) {
        return reply;
    }
    $.writeln(
        'The connection with the node.js server was stablished, but there was no answer...'
    );
    return null;
}

/**
 * Hashes the password given as argument. This function will send the password
 * to the Node.js (Net) socket server. There, it will be hashed and sent back.
 * That server uses only the <strong>bcrypt</strong> algorithm.
 *
 * @param {string} password The password to be hashed.
 * @param {number} [cost=10] The salt rounds (cost) to be used. Defaults to 10.
 * @return {(string | false)}  {(string | false)} The 60 (sixty) characters hashed password. False if it fails.
 */
function passwordHash(password: string, cost: number = 10): string | false {
    const passwordHashingData = {
        hashPassword: true,
        password: password,
        cost: cost,
    };

    if (!passwordHashingData.password) {
        $.writeln('passwordHash(): The password cannot be blank.');
        return false;
    }

    /// @ts-ignore: Cannot find name 'JSON'
    const hashResult = sendMessageToServer(JSON.stringify(passwordHashingData));

    if (hashResult == null) {
        $.writeln(
            'There was a problem hashing the password. The result from the communication with the server was null.'
        );
        return false;
    }

    /// @ts-ignore: Cannot find name 'JSON'
    const hashParsed = JSON.parse(hashResult);
    const returnValue = hashParsed.hash as string;

    return returnValue;
}

/**
 * Handles the verification of the password given as argument against the hashed version.
 * This function will send the password to the Node.js (Net) socket server.
 * There, it will be verified and the answer will be sent back.
 * That server uses only the <strong>bcrypt</strong> algorithm.
 *
 * @param {string} password The password to be verified.
 * @param {string} hashedPassword The hashed password (from the database).
 * @return {?boolean}   {?boolean} true or false if they match or not.
 *                      null if the verification fails.
 */
function passwordVerify(password: string, hashedPassword: string): boolean | null {
    const passwordVerificationData = {
        verifyPassword: true,
        password: password,
        hashedPassword: hashedPassword
    };

    if (!passwordVerificationData.password) {
        $.writeln('passwordVerify(): The password cannot be blank.');
        return null;
    }

    /// @ts-ignore: Cannot find name 'JSON'
    const serverResponse: string | null = sendMessageToServer(JSON.stringify(passwordVerificationData));

    if (serverResponse == null) {
        $.writeln(
            'passwordVerify(): There was a problem verifying the password. The result from the communication with the server was null.'
        );
        return null;
    }

    /// @ts-ignore: Cannot find name 'JSON'
    const verificationResult = JSON.parse(serverResponse) as {'result': boolean};

    return verificationResult.result;
}
