/* global	DatabaseObject,
            numberFormat */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "Admin" }] */

/**
 * Class representing an admin.
 *
 * @class Admin
 * @extends {DatabaseObject}
 */
class Admin extends DatabaseObject {
    protected static tableName: string = 'admins';

    protected static dbColumns: string[] = [
        'id',
        'first_name',
        'last_name',
        'email',
        'username',
        'hashed_password',
    ];

    // -------------------------------------------------------------------------

    public id: number;

    public firstName: string;

    public lastName: string;

    public email: string;

    public username: string;

    protected hashedPassword: string;

    public password: string;

    public confirmPassword: string;

    /**
     * Creates an instance of Admin.
     * @param {object} [args]   Generic object, probably from an UI, with keys
     *                          corresponding to the admins table columns.
     * @memberof Admin
     */
    public constructor(args?) {
        super();
        if (typeof args !== 'undefined') {
            this.firstName = args.firstName ? args.firstName : '';
            this.lastName = args.lastName ? args.lastName : '';
            this.email = args.email ? args.email : '';
            this.username = args.username ? args.username : '';
            this.password = args.password ? args.password : '';
            this.confirmPassword = args.confirmPassword ? args.confirmPassword : '';
        }
    }

    public fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
