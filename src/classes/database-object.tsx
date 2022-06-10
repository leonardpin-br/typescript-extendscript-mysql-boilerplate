//@include "../../node_modules/extendscript-es5-shim/index.js";
//@include "../../node_modules/extendscript-es6-shim/index.js";
//@include "../../node_modules/json2/lib/JSON2/static/json2.js";

//@include "./connection.jsx";
//@include "../shared/utils.jsx";

/* global	$,
            ConnectionData,
            Connection,
            sendMessageToServer,
            numberFormat */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "DatabaseObject" }] */

class DatabaseObject {

    protected static database: Connection;

    protected static tableName = "";

    protected static columns = [];

    public errors: string[] = [];

    /**
     * Sets the connectionData property to be used in the connection
     * with the database.
     *
     * @static
     * @param {ConnectionData} connectionData
     * @memberof Bicycle
     */
     public static setDatabase(database: Connection): void {
        this.database = database;
    }

    /**
     * Sends the SQL query to the database and returns an array of objects.
     *
     * @static
     * @param {string} sql The SQL string to be executed.
     * @return {*}  {object[]}
     * @memberof Bicycle
     */
    public static findBySql(sql: string): object[] {
        /**
         * @type {(false | object | object[])}  {(false | object | object[])} If the query() is successful,
         *                                      it will be an array containing objects.
         *                                      Each object represents a row in the result set. Every key
         *                                      represents a column in the table (result set).
         */
        /// @ts-ignore: Cannot find name 'JSON'
        const result: object[] = this.database.query(sql);

        if (!result) {
            throw new Error('Database query failed.');
        }

        // results into objects
        const objectArray: object[] = [];
        let record: object;
        for (let i = 0; i < result.length; i += 1) {
            record = result[i];
            objectArray.push(this.instantiate(record));
        }

        return objectArray;
    }

    /**
     * Finds all records in the given database table.
     *
     * @static
     * @return {*}  {object[]}
     * @memberof Bicycle
     */
    public static findAll(): object[] {
        const sql = 'SELECT * FROM bicycles';

        return this.findBySql(sql);
    }

    public static findById(id: number): false | object {
        let sql: string = 'SELECT * FROM bicycles ';
        sql += `WHERE id='${id}'`;
        const objectArray = this.findBySql(sql);
        if (objectArray.length > 0) {
            return objectArray[0];
        }

        return false;
    }

    /**
     * Creates an instance of the class setting the properties with
     * the values of the object passed as argument.
     *
     * @protected
     * @static
     * @param {object} record An object representing a record (row) in the result set.
     * @return {*}  {object} An instance of the class.
     * @memberof Bicycle
     */
    protected static instantiate(record: object): object {
        const obj = new this();

        /* This is the usual way, in ExtendScript, to loop through an object. */
        // let value;
        // for (const key in record) {
        //     if (obj.hasOwnProperty(key)) {
        //         value = record[key];
        //         obj[key] = value;
        //     }
        // }

        /*  This method of looping through an object only works because of
            the "shim" inclusions at the beginning of the file.
            The error in Typescript (line below) happens because this feature
            was added in ES5. */
        /// @ts-ignore: Property 'keys' does not exist on type 'ObjectConstructor'
        const keys = Object.keys(record);

        keys.forEach((key) => {
            obj[key] = record[key];
        });

        return obj;
    }

    protected validate() {
        this.errors = [];

        if (!this.brand) {
            this.errors.push('Brand cannot be blank.');
        }
        if (!this.model) {
            this.errors.push('Model cannot be blank.');
        }

        return this.errors;
    }

    /**
     * Creates a record in the database with the properties' values of the
     * current instance in memory.
     *
     * @protected
     * @return {(false | object | object[])}    {(false | object | object[])} The
     *                                          result of the query() method executed
     *                                          inside this method.
     * @memberof Bicycle
     */
    protected create() {
        this.database = Bicycle.database;

        this.validate();
        if (this.errors.length > 0) {
            return false;
        }

        const attributes = this.sanitizedAttributes();
        let sql = 'INSERT INTO bicycles (';

        // Loops through all this.dbColumns array, excluding id.
        for (let i = 0; i < this.dbColumns.length; i += 1) {
            // Excludes id.
            if (this.dbColumns[i] === 'id') {
                continue;
            }

            sql += this.dbColumns[i];

            // Do not add comma and space after the last array element.
            if (i === this.dbColumns.length - 1) {
                continue;
            }

            sql += ', ';
        }

        sql += ") VALUES ('";

        /// @ts-ignore: Property 'keys' does not exist on type 'ObjectConstructor'
        const keys = Object.keys(attributes);

        /*  The utility of this counter is to stop the loop in the last
        element without adding the single quotes and the comma to the
        sql variable. */
        let counter = keys.length;

        // let value;
        // for (const key in attributes) {
        //     if (this.hasOwnProperty(key)) {
        //         value = attributes[key];
        //         sql += value;
        //     }

        //     counter -= 1;
        //     if (counter == 0) {
        //         break;
        //     }

        //     sql += "', '";
        // }

        keys.forEach((key) => {
            sql += attributes[key];

            counter -= 1;
            if (counter === 0) {
                return;
            }

            sql += "', '";
        });

        sql += "')";

        /// @ts-ignore: Cannot find name 'JSON'
        const result = this.database.query(sql);
        if (result) {
            this.id = this.database.insertId;
        }

        return result;
    }

    /**
     * Updates the database with the properties' values of the current
     * instance in memory.
     *
     * @protected
     * @return {(false | object | object[])}    {(false | object | object[])} The
     *                                          result of the query() method executed
     *                                          inside this method.
     * @memberof Bicycle
     */
    protected update() {
        this.database = Bicycle.database;

        this.validate();
        if (this.errors.length > 0) {
            return false;
        }

        const attributes = this.sanitizedAttributes();
        const attributePairs: string[] = [];

        /// @ts-ignore: Property 'keys' does not exist on type 'ObjectConstructor'
        const keys = Object.keys(attributes);
        keys.forEach((key) => {
            attributePairs.push(`${key}='${attributes[key]}'`);
        });

        let sql: string = 'UPDATE bicycles SET ';

        sql += attributePairs.join(', ');

        sql += ` WHERE id='${this.database.escapeString(String(this.id))}' `;
        sql += 'LIMIT 1';

        const result = this.database.query(sql);
        return result;
    }

    /**
     * Executes the update() or the create() instance methods based on the
     * presence of an ID.
     *
     * @return {*} An instance method (update() or create()).
     * @memberof Bicycle
     */
    public save() {
        // A new record will not have an ID yet
        if (this.id) {
            return this.update();
        }
        return this.create();
    }

    /**
     * Merges the attributes from the generic object (that is acting like an
     * associative array) into the object in memory created from the
     * findById() method.
     *
     * @param {object} args The object (that is acting like an associative
     *                      array) containing the new values to be merged
     *                      and later updated.
     * @memberof Bicycle
     */
    public mergeAttributes(args: object): void {
        /*  Object.keys() only works because of the 'shim' inclusions at the
            top of the file. ExtendScript does not know about that.

            The return value of Object.keys() is an indexed array. */
        /// @ts-ignore: Property 'keys' does not exist on type 'ObjectConstructor'
        const keys = Object.keys(args);

        let value;
        keys.forEach((key) => {
            value = args[key];

            if (this.hasOwnProperty(key) && value !== null) {
                this[key] = value;
            }
        });
    }

    /**
     * Creates an object that have, as properties, the database columns
     * (excluding ID) and the corresponding values from the
     * instance object in memory.
     *
     * @return {object} {object}    Object containing the names of the columns and
     *                              the corresponding values from the instance
     *                              object in memory.
     * @memberof Bicycle
     */
    public attributes() {
        this.dbColumns = Bicycle.dbColumns;

        const attributes = {};

        let column;
        for (let i = 0; i < this.dbColumns.length; i += 1) {
            column = this.dbColumns[i];

            if (column === 'id') {
                continue;
            }

            attributes[column] = this[column];
        }

        return attributes;
    }

    /**
     * Sanitizes (escapes the values) of the object before sending to the database.
     *
     * @protected
     * @return {object} {object} Object with the values escaped.
     * @memberof Bicycle
     */
    protected sanitizedAttributes() {
        this.database = Bicycle.database;

        const attributes = this.attributes();
        const sanitized = {};

        /// @ts-ignore: Property 'keys' does not exist on type 'ObjectConstructor'
        const keys = Object.keys(attributes);

        let value;
        keys.forEach((key) => {
            value = attributes[key];

            /*  It is necessary to type cast all values of the object,
                turning them into strings. Not doing that results
                in an error (it is only possible to escape a string if the
                value is a string). */
            value = String(value);

            sanitized[key] = this.database.escapeString(value);
        });

        return sanitized;
    }

    /**
     * Deletes, in the database, the record that corresponds to the current
     * instance object in memory.
     * After deleting, the instance of the object will still
     * exist, even though the database record does not.
     * This can be useful, as in:
     * $.writeln(`${user.firstName} was deleted.`);
     * but, for example, we can't call user.update() after
     * calling user.delete().
     *
     * @return {(false | object)}   {(false | object)} The return value will be:
     *                              An object with information provided by MySQL.
     *                              False if there is no answer.
     * @memberof Bicycle
     */
    public delete() {
        this.database = Bicycle.database;

        let sql = 'DELETE FROM bicycles ';
        sql += `WHERE id='${this.database.escapeString(String(this.id))}' `;
        sql += 'LIMIT 1';

        const result = this.database.query(sql);
        return result;
    }

}