//DESCRIPTION: Entry point of the application. This is the file to be executed.
/**
 * Modified 2022-06-07
 * @file		Entry point of the application. This is the file to be executed.
 * @author		Leonardo Pinheiro, UERJ <info@leonardopinheiro.net>
 * @copyright	Leonardo Pinheiro 2022
 * @see			<a href="https://www.leonardopinheiro.net" target=_blank>Leonardo Pinheiro Designer</a>
 *
 * @see			{@link https://stackoverflow.com/questions/27343152/jsdoc-how-to-document-prototype-methods JSDoc - how to document prototype methods}
 * @see			{@link https://gist.github.com/tracker1/59f2c13044315f88bee9 Directory structure for JavaScript/Node Projects}
 */

//@include "../node_modules/extendscript-es5-shim/index.js";
//@include "../node_modules/extendscript-es6-shim/index.js";
//@include "../node_modules/json2/lib/JSON2/static/json2.js";

//@include "../config/db-credentials.jsx";
//@include "./classes/connection.jsx";
//@include "./classes/bicycle.jsx";
//@include "./classes/example-superclass.jsx";
//@include "./classes/example-subclass.jsx";
//@include "./shared/utils.jsx";

/* global	connectionData,
            Connection,
            Bicycle,
			$ */


function dbConnect() {
    /// @ts-ignore: Cannot find name 'connectionData'
    const connection = new Connection(connectionData);
    return connection;
}


/**
 * The main function of the application.
 */
 function main() {

    const database: Connection = dbConnect();

    /*  Unfortunately, I cannot set the connection data inside
        ../config/db-credentials.jsx. It needs to be done here. */
    /// @ts-ignore: Cannot find name 'connectionData'
    Bicycle.setDatabase(database);


    const myBike = new Bicycle();

    // myBike.brand = 'Schwinn';
    // myBike.model = 'Cutter';
    // myBike.year = 2016;
    // myBike.category = 'City';
    // myBike.color = 'white';
    // myBike.gender = 'Unisex';
    // myBike.price = 450;
    // myBike.weight_kg = 18;
    // myBike.condition_id = 4;
    // myBike.description = '';

    // myBike.brand = 'Mongoose';
    // myBike.model = 'Switchback Sport';
    // myBike.year = 2015;
    // myBike.category = 'Mountain';
    // myBike.color = 'blue';
    // myBike.gender = 'Mens';
    // myBike.price = 399;
    // myBike.weight_kg = 24;
    // myBike.condition_id = 2;
    // myBike.description = '';

    myBike.brand = 'Diamondback';
    myBike.model = "Bob's Overdrive";
    myBike.year = 2016;
    myBike.category = 'Mountain';
    myBike.color = 'dark green';
    myBike.gender = 'Unisex';
    myBike.price = 565;
    myBike.weight_kg = 23.7;
    myBike.condition_id = 3;
    myBike.description = '';

    const result = myBike.create();

    $.writeln(`The ID: ${myBike.id}`);
    $.writeln(`result.affectedRows: ${result.affectedRows}`);



    // const bikes: object[] = Bicycle.findAll();
    // let bike;

    // for (let i = 0; i < bikes.length; i += 1) {

    //     bike = bikes[i];

    //     $.writeln(`Brand: ${bike.brand}`);
    //     $.writeln(`Model: ${bike.model}`);
    //     $.writeln(`Year: ${bike.year}`);
    //     $.writeln(`Category: ${bike.category}`);
    //     $.writeln(`Gender: ${bike.gender}`);
    //     $.writeln(`Color: ${bike.color}`);
    //     $.writeln(`Weight: ${bike.get_weight_kg()} / ${bike.weight_lbs()}`);
    //     $.writeln(`Condition: ${bike.condition()}`);
    //     $.writeln(`Price: $${bike.price}.00`);
    //     $.writeln("------------------------------------------------\n");


    // }

    // $.writeln("============== findById ==============");

    // const result = Bicycle.findById(2);

    // if (result !== false) {

    //     const bike2 = (result as Bicycle);

    //     $.writeln(`Name: ${bike2.name()}\n`);

    //     $.writeln(`Brand: ${bike2.brand}`);
    //     $.writeln(`Model: ${bike2.model}`);
    //     $.writeln(`Year: ${bike2.year}`);
    //     $.writeln(`Category: ${bike2.category}`);
    //     $.writeln(`Gender: ${bike2.gender}`);
    //     $.writeln(`Color: ${bike2.color}`);
    //     $.writeln(`Weight: ${bike2.get_weight_kg()} / ${bike2.weight_lbs()}`);
    //     $.writeln(`Condition: ${bike2.condition()}`);
    //     $.writeln(`Price: $${bike2.price}.00`);
    // }

}

main();
