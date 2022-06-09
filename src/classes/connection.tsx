//@include "../../node_modules/extendscript-es5-shim/index.js";
//@include "../../node_modules/extendscript-es6-shim/index.js";
//@include "../../node_modules/json2/lib/JSON2/static/json2.js";

//@include "../shared/utils.jsx";

/* global	ConnectionData,
            sendMessageToServer */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "Connection" }] */

/**
 * Mimics **loosely and in a very crud way** the mysqli (PHP) class.
 *
 * @class Connection
 */
class Connection {
    /**
     * The connection data parameters necessary for communication with
     * the database server.
     *
     * @private
     * @type {ConnectionData}
     * @memberof Connection
     */
    private connectionData: ConnectionData;

    public affectedRows;

    public insertId;

    constructor(connectionData: ConnectionData) {
        this.connectionData = connectionData;
    }

    /**
     *  Executes the query.
     *
     * @param {string} sql The SQL query as a string to be executed.
     * @return {(false | object | object[])}    {(false | object | object[])} The return value will be:
     *                                          An object if there is a record being created, updated or deleted.
     *                                          An object array with the result if it is a selection.
     *                                          False if there is no answer.
     * @memberof Connection
     * @example
     * // MySQL answer (JSON) when creating a record:
     * {"fieldCount":0,"affectedRows":1,"insertId":7,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
     * @example
     * // MySQL answer (JSON) when selecting:
     * [{"id":3,"brand":"Diamondback","model":"Bob's Overdrive","year":2016,"category":"Mountain","gender":"Unisex","color":"dark green","price":565,"weight_kg":23.7,"condition_id":3,"description":""}]
     * @example
     * // MySQL answer (JSON) when updating a record:
     * {"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"(Rows matched: 1  Changed: 1  Warnings: 0","protocol41":true,"changedRows":1}
     * @example
     * // MySQL answer (JSON) when deleting a record:
     * {"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
     */
    public query(sql: string) {
        this.connectionData.sql = sql;

        const mySQLResult: string = sendMessageToServer(
            /// @ts-ignore: Cannot find name 'JSON'
            JSON.stringify(this.connectionData)
        );

        /// @ts-ignore: Cannot find name 'JSON'
        const result = JSON.parse(mySQLResult);

        if (!result) {
            return false;
        }

        /* If it is a creation of a record */
        if (result.affectedRows) {
            this.affectedRows = result.affectedRows;
        }

        if (result.insertId) {
            this.insertId = result.insertId;
        }

        return result;
    }

    /**
     * Roughly does the same as the mysqli::real_escape_string method, that is,
     * escapes a string before sending to the database.
     *
     * @param {string} stringToEscape   The string to be escaped.
     * @return {string}  {string}   The escaped string.
     * @memberof Connection
     * @see {@link https://stackoverflow.com/questions/5191062/what-is-the-equivalent-javascript-code-for-phps-mysql-real-escape-string#answer-32481791 What is the equivalent javascript code for php's mysql_real_escape_string()?}
     */
    public escapeString(stringToEscape: string): string {
        if (stringToEscape === '') {
            return stringToEscape;
        }

        return stringToEscape
            .replace(/\\/g, '\\\\')
            .replace(/\'/g, "\\'")
            .replace(/\"/g, '\\"')
            .replace(/\n/g, '\\\n')
            .replace(/\r/g, '\\\r')
            .replace(/\x00/g, '\\\x00')
            .replace(/\x1a/g, '\\\x1a');
    }
}
