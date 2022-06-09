/**
 * Modified 2022-06-01
 * @file		Entry point of the application. This is the file to be executed.
 * @author		Leonardo Pinheiro, UERJ <info@leonardopinheiro.net>
 * @copyright	Leonardo Pinheiro 2022
 * @see			<a href="https://www.leonardopinheiro.net" target=_blank>Leonardo Pinheiro Designer</a>
 *
 * @see			{@link https://stackoverflow.com/questions/24442621/referring-to-the-static-class-in-typescript#answer-24442827 Referring to the static class in Typescript}
 * @see			{@link https://flexiple.com/loop-through-object-javascript/ How to loop through objects keys and values in Javascript?}
 * @see			{@link https://www.typescripttutorial.net/typescript-tutorial/typescript-optional-parameters/ TypeScript Optional Parameters}
 * @see			{@link https://masteringjs.io/tutorials/fundamentals/foreach-continue Using Continue in JavaScript forEach()}
 */

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
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "Bicycle" }] */

/**
 * Temporary class Bicycle.
 *
 * @class Bicycle
 */
class Bicycle {
    // ----- START OF ACTIVE RECORD CODE -----

    protected static database: Connection;

    protected database: Connection;

    protected static dbColumns: string[] = [
        'id',
        'brand',
        'model',
        'year',
        'category',
        'color',
        'gender',
        'price',
        'weight_kg',
        'condition_id',
        'description',
    ];

    protected dbColumns: string[];

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
         * @type {object[]} An array containing objects. Each object represents
         *                  a row in the result set. Every key represents a
         *                  column in the table (result set).
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
        let sql = 'SELECT * FROM bicycles ';
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

    public create() {
        this.database = Bicycle.database;

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

    public update() {}

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

    // ----- END OF ACTIVE RECORD CODE -----

    public id: number;

    public brand: string;

    public model: string;

    public year: number;

    public category: string;

    public color: string;

    public description: string;

    public gender: string;

    public price: number;

    public weight_kg: number;

    public condition_id: number;

    public readonly CATEGORIES: string[] = [
        'Road',
        'Mountain',
        'Hybrid',
        'Cruiser',
        'City',
        'BMX',
    ];

    public readonly GENDERS: string[] = ['Mens', 'Womens', 'Unisex'];

    public readonly CONDITION_OPTIONS: object = {
        1: 'Beat up',
        2: 'Decent',
        3: 'Good',
        4: 'Great',
        5: 'Like New',
    };

    public constructor(args?) {
        if (typeof args !== 'undefined') {
            this.brand = args.brand ? args.brand : '';
            this.model = args.model ? args.model : '';
            this.year = args.year ? args.year : '';
            this.category = args.category ? args.category : '';
            this.color = args.color ? args.color : '';
            this.description = args.description ? args.description : '';
            this.gender = args.gender ? args.gender : '';
            this.price = args.price ? args.price : 0;
            this.weight_kg = args.weight_kg ? args.weight_kg : 0.0;
            this.condition_id = args.condition_id ? args.condition_id : 3;
        }
    }

    public name() {
        return `${this.brand} ${this.model} ${this.year}`;
    }

    public get_weight_kg() {
        return `${numberFormat(this.weight_kg, 2)} kg`;
    }

    public set_weight_kg(value) {
        this.weight_kg = Number(
            (Math.round(this.weight_kg * 100) / 100).toFixed(value)
        );
    }

    public weight_lbs() {
        const weight_lbs = parseFloat(String(this.weight_kg)) * 2.2046226218;
        return `${numberFormat(weight_lbs, 2)} lbs`;
    }

    public set_weight_lbs(value) {
        this.weight_kg = parseFloat(value) / 2.2046226218;
    }

    public condition() {
        if (this.condition_id > 0) {
            return this.CONDITION_OPTIONS[this.condition_id];
        }
        return 'Unknown';
    }
}
