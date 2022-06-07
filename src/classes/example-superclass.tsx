/* global	$ */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "ExampleSuperclass" }] */

/**
 * Example of a superclass.
 *
 * @class ExampleSuperclass
 */
class ExampleSuperclass {
    // Properties do not show up in the documentation.
    public anyPublicNumber: number;

    protected anyProtectedString: string;

    private anyPrivateBoolean: boolean;

    /**
     * Creates an instance of ExampleSuperclass.
     * @param {number} [anyNumber=10] An example parameter of type number. Defaults to 10.
     * @memberof ExampleSuperclass
     */
    constructor(anyNumber: number = 10) {
        this.anyPublicNumber = anyNumber;
        this.anyProtectedString = 'Inside anyProtectedString';
        this.anyPrivateBoolean = true;
    }

    /**
     * Prints an example message, accessing public, protected and private properties.
     *
     * @memberof ExampleSuperclass
     */
    printMessage() {
        $.writeln(
            `The default value of the public property "anyPublicNumber" is: ${this.anyPublicNumber}.\n` +
                `The value of the protected property "anyProtectedString" is: ${this.anyProtectedString}.\n` +
                `The value of the private property "anyPrivateBoolean" is: ${this.anyPrivateBoolean}.\n`
        );
    }
}
