//DESCRIPTION: File (not module) with useful functions.
/**
 * Modified 2022-06-02
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

//@include "../../config/db-credentials.jsx";

/* global	BridgeTalk,
            Socket,
            $ */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "clearConsole|ConnectionData|sendMessageToServer|numberFormat|connection" }] */
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


function numberFormat (number, decimals, decPoint?, thousandsSep?) {
    // Strip all characters but numerical ones.
    number = (`${number}`).replace(/[^0-9+\-Ee.]/g, '');
    let n = !isFinite(+number) ? 0 : +number;
    const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    const sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep;
    const dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
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
 * @param {string} message  The message (the ConnectionData object as a string in JSON format) to be sent to the Node.js (Net) server.
*                           This will be passed on to the MySQL server.
 * @param {string} [host=127.0.0.1] Optional. The IP or name of the (Net) server. Defaults to &ldquo;127.0.0.1&rdquo;.
 * @param {number} [port=8124]  Optional. The port that the (Net) server is listening on. Defaults to 8124.
 * @param {string} [encoding=UTF-8] Optional. The encoding. Defaults to &ldquo;UTF-8&rdquo;.
 * @returns {?string}   The reply from the (Net) server. null if there is no answer.
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
