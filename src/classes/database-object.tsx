/* global	Connection */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "DatabaseObject" }] */

/**
 * Class to be instantiated from all the others that access the database.<br />
 * It is important to remember that, in TypeScript, <strong>static methods</strong>
 * can only access static properties. <strong>this.</strong>propertyName (in static
 * methods) refers to the class itself and not to the instance.
 *
 * @abstract
 * @class DatabaseObject
 * @example
 * // Public methods (non-static) dont have access to static properties.
 * // But, it can be passed to the instance using the line below.
 * this.database = this.constructor.database;
 */
abstract class DatabaseObject {
    /**
     * Holds the connection information used by static methods.
     *
     * @protected
     * @static
     * @type {Connection}
     * @memberof DatabaseObject
     */
    protected static database: Connection;

    /**
     * Holds the connection information used by non-static menthods.
     *
     * @protected
     * @memberof DatabaseObject
     * @example
     * // Non-static methods dont have access to static properties.
     * // But, it can be passed to the instance using the line below.
     * this.database = this.constructor.database;
     *
     * @see {@link DatabaseObject#setInstanceProperties}
     */
    protected database: Connection;

    /**
     * tableName is a static property that is meant to be inherited and
     * overridden in the subclasses.
     * To allow it to be accessed, it needs to be used like in the example.
     *
     * @protected
     * @static
     * @type {string}
     * @memberof DatabaseObject
     * @example
     * // Access the inherited subclass static property
     * this.constructor.tableName
     *
     * @see {@link DatabaseObject#setInstanceProperties}
     */
    protected static tableName: string = '';

    protected tableName: string = '';

    protected static dbColumns: string[] = [];

    protected dbColumns: string[] = [];

    public errors: string[] = [];

    /**
     * Sets the static database property to be used in the connection
     * with the database server (MySQL).
     *
     * @static
     * @param {Connection} database An instance of Connection returned by the
     *                              dbConnect() shared function inside the
     *                              &lt;projectRoot&gt;/config/initialize.jsx file.
     * @memberof DatabaseObject
     */
    public static setDatabase(database: Connection): void {
        this.database = database;
    }

    /**
     * As static methods can only access static properties and non-static
     * methods cannot access static properties directly, this method makes it
     * possible to the instances to know about the values in the
     * static properties.
     *
     * This is an auxiliary method and it is not part of the example in the
     * course that inspired this code.
     *
     * @protected
     * @memberof DatabaseObject
     */
    protected setInstanceProperties() {
        /// @ts-ignore: Property 'database' does not exist on type 'Function'
        this.database = this.constructor.database;

        /// @ts-ignore: Property 'tableName' does not exist on type 'Function'
        this.tableName = this.constructor.tableName;

        /// @ts-ignore: Property 'dbColumns' does not exist on type 'Function'
        this.dbColumns = this.constructor.dbColumns;
    }

    /**
     * Sends the SQL query to the database and returns an array of objects.
     *
     * @static
     * @param {string} sql The SQL string to be executed.
     * @return {object[]}   {object[]} Array containing objects from the query
     *                      result.
     * @memberof DatabaseObject
     */
    public static findBySql(sql: string): object[] {
        /*  If the query() is successful, it will be an array containing objects.
            Each object represents a row in the result set.
            Every key represents a column in the table (result set). */
        /**
         * @type {object[]}
         */
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
     * @return {object[]}  {object[]} Array containing objects.
     * @memberof DatabaseObject
     */
    public static findAll(): object[] {
        const sql = `SELECT * FROM ${this.tableName}`;

        return this.findBySql(sql);
    }

    /**
     * Finds a record in the database, using the ID.
     *
     * @static
     * @param {number} id The ID number to be used in the query.
     * @return {(false | object)}   {(false | object)}  An object corresponding
     *                              to the database record. False if it does
     *                              not find anything.
     * @memberof DatabaseObject
     * @example
     * // This is the way this method should be used:
     * const result = Bicycle.findById(11);
     * const myBike = (result as Bicycle);
     * if (! result) {
     *     $.writeln(`The ID was not found!`);
     *     return;
     * }
     */
    public static findById(id: number): false | object {
        let sql: string = `SELECT * FROM ${this.tableName} `;
        sql += `WHERE id='${this.database.escapeString(String(id))}'`;
        const objectArray = this.findBySql(sql);
        if (objectArray.length > 0) {
            /*  This function gets only one record, using the ID.
                It only makes sense to return the first (and unique) element
                in the resulting array. */
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
     * @return {object}  {object} An instance of the subclass.
     * @memberof DatabaseObject
     */
    protected static instantiate(record: object): object {
        /// @ts-ignore: Cannot create an instance of an abstract class.
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
            the "shim" inclusions in initialize.jsx.
            The error in Typescript (line below) happens because this feature
            was added in ES5. */
        /// @ts-ignore: Property 'keys' does not exist on type 'ObjectConstructor'
        const keys = Object.keys(record);

        keys.forEach((key) => {
            obj[key] = record[key];
        });

        return obj;
    }

    /**
     * Every class that extends this one (DatabaseObject) must implement this
     * method.
     *
     * @protected
     * @abstract
     * @return {string[]}  {string[]} The errors string array.
     * @memberof DatabaseObject
     */
    protected abstract validate(): string[];

    /**
     * Creates a record in the database with the properties' values of the
     * current instance in memory.
     *
     * @protected
     * @return {(false | object | object[])}    {(false | object | object[])} The
     *                                          result of the <strong>query()</strong> method executed
     *                                          inside this method.
     * @memberof DatabaseObject
     * @see {@link Connection#query}
     */
    protected create() {
        this.setInstanceProperties();

        this.validate();
        if (this.errors.length > 0) {
            return false;
        }

        const attributes = this.sanitizedAttributes();

        /*  this.constructor allows to get the subclass at runtime. */
        /// @ts-ignore: Property 'tableName' does not exist on type 'Function'
        let sql = `INSERT INTO ${this.constructor.tableName} (`;

        // Loops through all this.dbColumns array, excluding id.
        for (let i = 0; i < this.dbColumns.length; i += 1) {
            // Excludes id.
            if (this.dbColumns[i] !== 'id') {
                sql += this.dbColumns[i];

                // Do not add comma and space after the last array element.
                if (i !== this.dbColumns.length - 1) {
                    sql += ', ';
                }
            }
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
     * @memberof DatabaseObject
     */
    protected update() {
        this.setInstanceProperties();

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

        let sql: string = `UPDATE ${this.constructor.tableName} SET `;

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
     * @return {(DatabaseObject#update|DatabaseObject#create)} An instance method (update() or create()).
     * @memberof DatabaseObject
     * @see {@link https://stackoverflow.com/questions/30012043/how-to-document-a-function-returned-by-a-function-using-jsdoc#answer-30393968 How to document a function returned by a function using JSDoc}
     * @see {@link https://stackoverflow.com/questions/23095975/jsdoc-object-methods-with-method-or-property#answer-59508384 JSDoc object methods with @method or @property?}
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
     * @memberof DatabaseObject
     */
    public mergeAttributes(args: object): void {
        /*  Object.keys() only works because of the 'shim' inclusions inside
            &lt;projectRoot&gt;/config/initialize.jsx file. ExtendScript does
            not know about that.

            The return value of Object.keys() is an indexed array. */
        /// @ts-ignore: Property 'keys' does not exist on type 'ObjectConstructor'
        const keys = Object.keys(args);

        let value;
        keys.forEach((key) => {
            value = args[key];

            if (
                Object.prototype.hasOwnProperty.call(this, key) &&
                value !== null
            ) {
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
     * @memberof DatabaseObject
     */
    public attributes() {
        this.setInstanceProperties();

        const attributes = {};

        let column;
        for (let i = 0; i < this.dbColumns.length; i += 1) {
            column = this.dbColumns[i];

            if (column !== 'id') {
                attributes[column] = this[column];
            }
        }

        return attributes;
    }

    /**
     * Sanitizes (escapes the values) of the object before sending to the database.
     *
     * @protected
     * @return {object} {object} Object with the values escaped.
     * @memberof DatabaseObject
     */
    protected sanitizedAttributes() {
        this.setInstanceProperties();

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
     * This can be useful, as in the example below.
     * @example
     * $.writeln(`${user.firstName} was deleted.`);
     * // But, for example, we can't call user.update() after
     * // calling user.delete().
     *
     * @return {(false | object)}   {(false | object)} The return value will be:
     *                              An object with information provided by MySQL.
     *                              False if there is no answer.
     * @memberof DatabaseObject
     */
    public delete() {
        this.setInstanceProperties();

        /// @ts-ignore: Property 'tableName' does not exist on type 'Function'
        let sql = `DELETE FROM ${this.constructor.tableName} `;
        sql += `WHERE id='${this.database.escapeString(String(this.id))}' `;
        sql += 'LIMIT 1';

        const result = this.database.query(sql);
        return result;
    }
}
