//@include "../node_modules/extendscript-es5-shim/index.js";
//@include "../node_modules/extendscript-es6-shim/index.js";
//@include "../node_modules/json2/lib/JSON2/static/json2.js";

//@include 'db-credentials.jsx';
//@include '../dist/classes/connection.jsx';
//@include '../dist/shared/functions.jsx';
//@include '../dist/shared/validation-functions.jsx';
//@include '../dist/classes/database-object.jsx';
//@include '../dist/classes/bicycle.jsx';
//@include '../dist/classes/admin.jsx';

/* global	dbConnect,
            Bicycle,
            Admin */
/* eslint no-var: off */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "database" }] */

var database = dbConnect();

/*  Unfortunately, it cannot be set by inheritance like
    DatabaseObject.setDatabase(database);
    It needs to be done by every class that connects to the database. */
Bicycle.setDatabase(database);
Admin.setDatabase(database);
