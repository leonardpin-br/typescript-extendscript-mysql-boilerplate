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
        'firstName',
        'lastName',
        'email',
        'username',
        'hashedPassword',
    ];

    // -------------------------------------------------------------------------

    public id: number;

    public firstName: string;

    public lastName: string;

    public email: string;

    public username: string;

    protected hashedPassword: string;

    /**
     * This property <strong>MUST</strong> receive a value here, because, if it
     * does not, there will be an error in the
     * [DatabaseObject.mergeAttributes]{@link DatabaseObject#mergeAttributes}
     * inherited method.<br />
     * An empty string is the ideal choice.
     *
     * @type {string}
     * @memberof Admin
     */
    public password: string = '';

    public confirmPassword: string = '';

    /**
     * The usefulness of this property is in the possibility of updating an
     * user without updating the password.
     *
     * @protected
     * @type {boolean}
     * @memberof Admin
     */
    protected passwordRequired: boolean = true;

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
            this.confirmPassword = args.confirmPassword
                ? args.confirmPassword
                : '';
        }
    }

    public fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    protected setHashedPassword() {
        const result = passwordHash(this.password);
        if (typeof result == 'string') {
            this.hashedPassword = result;
        }
    }

    public verifyPassword(password: string): boolean | null {
        return passwordVerify(password, this.hashedPassword);
    }

    protected create() {
        this.setHashedPassword();
        return super.create();
    }

    protected update() {
        /*  If the user is being updated, but the password is not, it will
            allow updating the record, skipping the validation.
            If it comes from a form (like an UI) and the password field is
            empty, the validation will be skipped. */
        if (this.password != '') {
            this.setHashedPassword();
            // Validate password.
        } else {
            // Password not being updated, skip hashing and validation.
            this.passwordRequired = false;
        }

        return super.update();
    }

    protected validate(): string[] {
        this.errors = [];

        if (isBlank(this.firstName)) {
            this.errors.push('First name cannot be blank.');
        } else if (!hasLength(this.firstName, { min: 2, max: 255 })) {
            this.errors.push(
                'First name must be between 2 and 255 characters.'
            );
        }

        if (isBlank(this.lastName)) {
            this.errors.push('Last name cannot be blank.');
        } else if (!hasLength(this.lastName, { min: 2, max: 255 })) {
            this.errors.push('Last name must be between 2 and 255 characters.');
        }

        if (isBlank(this.email)) {
            this.errors.push('Email cannot be blank.');
        } else if (!hasLength(this.email, { max: 255 })) {
            this.errors.push('Email must be less than 255 characters.');
        } else if (!hasValidEmailFormat(this.email)) {
            this.errors.push('Email must be a valid format.');
        }

        if (isBlank(this.username)) {
            this.errors.push('Username cannot be blank.');
        } else if (!hasLength(this.username, { min: 8, max: 255 })) {
            this.errors.push('Username must be between 8 and 255 characters.');
        } else if (!hasUniqueUsername(this.username, (isSet(this.id) ? this.id : 0))) {
            this.errors.push('Username not allowed. Try another.');
        }

        /*  The validation will only happen (in the update process) if the
            password is given. The value of this.passwordRequired is being set
            in the Admin.update() method. */
        if (this.passwordRequired) {
            if (isBlank(this.password)) {
                this.errors.push('Password cannot be blank.');
            } else if (!hasLength(this.password, { min: 12 })) {
                this.errors.push(
                    'Password must contain 12 or more characters.'
                );
            } else if (this.password.match('/[A-Z]/')) {
                this.errors.push(
                    'Password must contain at least 1 uppercase letter.'
                );
            } else if (this.password.match('/[a-z]/')) {
                this.errors.push(
                    'Password must contain at least 1 lowercase letter.'
                );
            } else if (this.password.match('/[0-9]/')) {
                this.errors.push('Password must contain at least 1 number.');
            } else if (this.password.match('/[^A-Za-z0-9s]/')) {
                this.errors.push('Password must contain at least 1 symbol.');
            }

            if (isBlank(this.confirmPassword)) {
                this.errors.push('Confirm password cannot be blank.');
            } else if (this.password !== this.confirmPassword) {
                this.errors.push('Password and confirm password must match.');
            }
        }

        return this.errors;
    }

    public static findByUsername(username: string): false | object {
        let sql: string = `SELECT * FROM ${this.tableName} `;
        sql += `WHERE username='${this.database.escapeString(username)}'`;
        const objectArray = this.findBySql(sql);
        if (objectArray.length > 0) {
            /*  This function gets only one record, using the username.
                It only makes sense to return the first (and unique) element
                in the resulting array. */
            return objectArray[0];
        }

        return false;
    }
}
