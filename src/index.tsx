//DESCRIPTION: Entry point of the application. This is the file to be executed.
/**
 * Modified 2022-06-07
 * @file		Entry point of the application. This is the file to be executed.
 * @author		Leonardo Pinheiro <info@leonardopinheiro.net>
 * @copyright	Leonardo Pinheiro 2022
 * @see			<a href="https://www.leonardopinheiro.net" target=_blank>Leonardo Pinheiro Designer</a>
 *
 * @see			{@link https://stackoverflow.com/questions/27343152/jsdoc-how-to-document-prototype-methods JSDoc - how to document prototype methods}
 * @see			{@link https://gist.github.com/tracker1/59f2c13044315f88bee9 Directory structure for JavaScript/Node Projects}
 */

//@include "../config/initialize.jsx";

/* global	Bicycle,
            Admin,
			$ */

/**
 * The main function of the application.
 */
function main() {
    // CREATE
    // =========================================================================

    // const myBike = new Bicycle();

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

    // myBike.brand = 'Schwinn';
    // myBike.model = 'Sanctuary 7-Speed';
    // myBike.year = 2016;
    // myBike.category = 'Cruiser';
    // myBike.color = 'purple';
    // myBike.gender = 'Womens';
    // myBike.price = 190;
    // myBike.weight_kg = 19.5;
    // myBike.condition_id = 3;
    // myBike.description = '';

    // myBike.brand = 'Diamondback';
    // myBike.model = "Bob's Overdrive";
    // myBike.year = 2016;
    // myBike.category = 'Mountain';
    // myBike.color = 'dark green';
    // myBike.gender = 'Unisex';
    // myBike.price = 565;
    // myBike.weight_kg = 23.7;
    // myBike.condition_id = 3;
    // myBike.description = '';

    // const firstResult = myBike.save();
    // $.writeln(`The ID: ${myBike.id}`);
    // $.writeln(`result.affectedRows: ${firstResult.affectedRows}`);

    // READ
    // =========================================================================

    // Find all
    // --------

    const bikes: object[] = Bicycle.findAll();
    let bike;

    for (let i = 0; i < bikes.length; i += 1) {

        bike = bikes[i];

        $.writeln(`Brand: ${bike.brand}`);
        $.writeln(`Model: ${bike.model}`);
        $.writeln(`Year: ${bike.year}`);
        $.writeln(`Category: ${bike.category}`);
        $.writeln(`Gender: ${bike.gender}`);
        $.writeln(`Color: ${bike.color}`);
        $.writeln(`Weight: ${bike.getWeightKg()} / ${bike.weightLbs()}`);
        $.writeln(`Condition: ${bike.condition()}`);
        $.writeln(`Price: $${bike.price}.00`);
        $.writeln("------------------------------------------------\n");

    }

    // Find by ID
    // ----------

    // const result = Bicycle.findById(16);

    // if (result !== false) {

    //     const bike2 = (result as Bicycle);

    //     $.writeln(`Name: ${bike2.name()}\n`);

    //     $.writeln(`Brand: ${bike2.brand}`);
    //     $.writeln(`Model: ${bike2.model}`);
    //     $.writeln(`Year: ${bike2.year}`);
    //     $.writeln(`Category: ${bike2.category}`);
    //     $.writeln(`Gender: ${bike2.gender}`);
    //     $.writeln(`Color: ${bike2.color}`);
    //     $.writeln(`Weight: ${bike2.getWeightKg()} / ${bike2.weightLbs()}`);
    //     $.writeln(`Condition: ${bike2.condition()}`);
    //     $.writeln(`Price: $${bike2.price}.00`);
    // }

    // UPDATE
    // =========================================================================

    // As if it was a form in a UI
    // ---------------------------

    // const result = Bicycle.findById(16);
    // const myBike = (result as Bicycle);

    // /*  args needs to be a generic object to work as an associative array.
    //     It is acting here as a form (maybe in a UI) that receives the values
    //     that came from the database (findById). */
    // const args = {
    //     brand: myBike.brand,
    //     model: "Bob's Overdrive",
    //     year: myBike.year,
    //     category: myBike.category,
    //     color: myBike.color,
    //     gender: myBike.gender,
    //     price: myBike.price,
    //     weight_kg: myBike.weight_kg,
    //     condition_id: myBike.condition_id,
    //     description: myBike.description
    // };

    // myBike.mergeAttributes(args);
    // const resultFromUpdating = myBike.save();

    // if (resultFromUpdating) {
    //     $.writeln("The bicycle was updated successfully.");
    // }

    // Updated directly from code
    // --------------------------

    // const result = Bicycle.findById(13);
    // const myBike = (result as Bicycle);
    // if (! result) {
    //     $.writeln(`The ID was not found!`);
    //     return;
    // }

    // myBike.brand = 'Schwinn'; // Schwinn UPDATED
    // myBike.model = 'Cutter'; // Cutter
    // myBike.year = 2016;
    // myBike.category = 'City';
    // myBike.color = 'white';
    // myBike.gender = 'Unisex';
    // myBike.price = 450;
    // myBike.weight_kg = 18;
    // myBike.condition_id = 4;
    // myBike.description = '';

    // myBike.save();

    // if (myBike.errors.length > 0) {
    //     for (let i = 0; i < myBike.errors.length; i += 1) {
    //         $.writeln(myBike.errors[i]);
    //     }
    // } else {
    //     $.writeln("The bicycle was updated successfully.");
    // }

    // DELETE
    // =========================================================================

    // Create a new bicycle before deleteting it.
    // ------------------------------------------

    // const myBike = new Bicycle();

    // myBike.brand = 'Junk Bike';
    // myBike.model = 'Delete me';
    // myBike.year = 1998;
    // myBike.category = 'Road';
    // myBike.color = 'white';
    // myBike.gender = 'Mens';
    // myBike.price = 2;
    // myBike.weight_kg = 1;
    // myBike.condition_id = 3;
    // myBike.description = '';

    // myBike.save();
    // $.writeln(`The ID of the new bike is: ${myBike.id}`);

    // Selects the bicycle created and deletes it
    // ------------------------------------------

    // const result = Bicycle.findById(27);
    // const myBike = (result as Bicycle);
    // if (! result) {
    //     $.writeln(`The ID was not found!`);
    //     return;
    // }

    // const resultFromDeletion = myBike.delete();

    // if (resultFromDeletion) {
    //     $.writeln(`The bicycle '${myBike.model}' was deleted successfully.`);
    // }

    // =========================================================================
    // ADMIN
    // =========================================================================

    // CREATE
    // =========================================================================
    // const myAdmin = new Admin();

    // myAdmin.firstName = 'Bob';
    // myAdmin.lastName = 'Smith';
    // myAdmin.email = 'b@b.com';
    // myAdmin.username = "bobsmith";
    // myAdmin.password = 'Password#1234';
    // myAdmin.confirmPassword = 'Password#1234';

    // myAdmin.save();

    // if (myAdmin.errors.length > 0) {
    //     for (let i = 0; i < myAdmin.errors.length; i += 1) {
    //         $.writeln(myAdmin.errors[i]);
    //     }
    // } else {
    //     $.writeln(`The ID of the new admin is: ${myAdmin.id}`);
    // }

    // UPDATE
    // =========================================================================

    // As if it was a form in a UI
    // ---------------------------

    // const result = Admin.findById(4);
    // const myAdmin = (result as Admin);

    // /*  args needs to be a generic object to work as an associative array.
    //     It is acting here as a form (maybe in a UI) that receives the values
    //     that came from the database (findById). */
    // const args = {
    //     firstName: myAdmin.firstName,
    //     lastName: myAdmin.lastName,
    //     email: 'b@b.com',
    //     username: myAdmin.username,
    //     password: 'xyz',
    //     confirmPassword: ''
    // };

    // myAdmin.mergeAttributes(args);
    // const resultFromUpdating = myAdmin.save();

    // if (resultFromUpdating) {
    //     $.writeln("The admin was updated successfully.");
    // } else {
    //     for (let i = 0; i < myAdmin.errors.length; i += 1) {
    //         $.writeln(myAdmin.errors[i]);
    //     }
    // }

    // Updated directly from code
    // --------------------------

    // const result = Admin.findById(1);
    // const myAdmin = (result as Admin);
    // if (! result) {
    //     $.writeln(`The ID was not found!`);
    //     return;
    // }

    // myAdmin.firstName = 'Kevin'; // Kevin UPDATED
    // myAdmin.lastName = 'Skoglund'; // Skoglund
    // myAdmin.email = 'kevin@nowhere.com';
    // myAdmin.username = 'kskoglund';

    // myAdmin.save();

    // if (myAdmin.errors.length > 0) {
    //     for (let i = 0; i < myAdmin.errors.length; i += 1) {
    //         $.writeln(myAdmin.errors[i]);
    //     }
    // } else {
    //     $.writeln("The admin was updated successfully.");
    // }


    // PASSWORD VERIFICATION
    // =========================================================================

    // As if it was a form in a UI
    // ---------------------------

    // const result = Admin.findByUsername('kskoglund');
    // if (result === false) {
    //     $.writeln('Username not found!');
    // } else {
    //     const admin = result as Admin;
    //     const verificationResult = admin.verifyPassword('Password#1234');

    //     if (verificationResult) {
    //         $.writeln('Passwords match!');
    //     } else {
    //         $.writeln("Passwords DON'T MATCH!!!");
    //     }
    // }


}

main();
