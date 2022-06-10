/**
 * Modified 2022-06-09
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
//@include "./database-object.jsx";
//@include "../shared/utils.jsx";

/* global	$,
            ConnectionData,
            Connection,
            sendMessageToServer,
            DatabaseObject,
            numberFormat */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "Bicycle" }] */

/**
 * Temporary class Bicycle.
 *
 * @class Bicycle
 */
class Bicycle extends DatabaseObject {
    // ----- START OF ACTIVE RECORD CODE -----

    protected static tableName: string = 'bicycles';

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
