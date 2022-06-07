//@include "./example-superclass.jsx";

/* global	$
			ExampleSuperclass */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "ExampleSubclass" }] */

/**
 * Creates an instance of the example subclass.
 *
 * @class ExampleSubclass
 * @extends {ExampleSuperclass}
 */
class ExampleSubclass extends ExampleSuperclass {
    public publicMessage: string;

    /**
     * Creates an instance of ExampleSubclass.
     * @param {string} [anyMessage='Hello from subclass!'] An example parameter of type string. Defaults to &lsquo;Hello from subclass!&rsquo;.
     * @memberof ExampleSubclass
     */
    constructor(anyMessage: string = 'Hello from subclass!') {
        super();
        this.publicMessage = anyMessage;
    }

    /**
     * Greets the user.
     *
     * @memberof ExampleSubclass
     */
    greeter() {
        $.writeln(
            `The default message from the constructor is: ${this.publicMessage}\n` +
                `The value of the INHERITED protected property "anyProtectedString" is: ${this.anyProtectedString}.\n`
        );
    }
}
