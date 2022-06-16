/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "arrayEquals|objectEquals|isSet|trim|inArray|isBlank|hasPresence|hasLengthGreaterThan|hasLengthLessThan|hasLengthExactly|hasLength|hasInclusionOf|hasExclusionOf|hasString|hasValidEmailFormat" }] */

// Utility functions (used by the validation functions)
// =============================================================================

/**
 * Recursive utility function to compare arrays.
 *
 * @param {any[]} arr1 The first array.
 * @param {any[]} arr2 The second array.
 * @return {boolean}    {boolean} true if the elements inside the arrays are
 *                      equal. false otherwise.
 * @see {@link https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript#answer-14853974 How to compare arrays in JavaScript?}
 * @example
 * // Return false
 * arrayEquals([1, 2, ['3', 4]], [1, 2, [3, 4]])
 */
function arrayEquals(arr1: any[], arr2: any[]): boolean {
    // Check if both arguments are really arrays.
    if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) {
        $.writeln(
            'arrayEquals(): One or both of the arguments is (are) not array(s).'
        );
        return false;
    }

    //  If the arrays have different lengths.
    if (arr1.length != arr2.length) {
        // $.writeln('arrayEquals(): The arrays have different lengths.');
        return false;
    }

    // Loops through all the elements of the first array.
    for (let i = 0; i < arr1.length; i += 1) {
        // Check if we have nested arrays.
        if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
            // Recurse into the nested arrays.
            if (!arrayEquals(arr1[i], arr2[i])) {
                return false;
            }
        }
        // The elements must be of the same type.
        else if (arr1[i] !== arr2[i]) {
            // $.writeln('arrayEquals(): At least one pair of corresponding elements of each array does not match.');
            return false;
        }
    }

    // $.writeln('arrayEquals(): The arrays are equal.');
    return true;
}

/**
 * Only make use of it if the object structure is used to contain data.<br />
 * The comparison isn't too deep. Method implementation, for example,<br />
 * is not compared. See the example.
 *
 * @param {object} obj1 The first object.
 * @param {object} obj2 The second object.
 * @return {boolean}  {boolean} true if the objects are equal. false otherwise.
 * @see {@link https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript#answer-14853974 How to compare arrays in JavaScript?}
 * @example
 * // Return true
 * const obj1 = {
        a: true,
        b: function name() { // <<< Atention!
            return true;
        },
        c: [1, 2, [3, 4]],
        d: {
            x: true,
            y: 'test',
            z: ['a', 'b', ['c', 'd']]
        }
    };

    const obj2 = {
        a: true,
        b: function otherName() { // <<< Atention!
            return true;
        },
        c: [1, 2, [3, 4]],
        d: {
            x: true,
            y: 'test',
            z: ['a', 'b', ['c', 'd']]
        }
    }

    $.writeln(objectEquals(obj1, obj2));
 */
function objectEquals(obj1: object, obj2: object): boolean {
    /*  First object
        Superficial check.
        --------------------------------------------------------------------- */
    for (let propName in obj1) {
        // Check for inherited methods and properties.
        if (obj1.hasOwnProperty(propName) != obj2.hasOwnProperty(propName)) {
            return false;
        }
        // Check for property types
        else if (typeof obj1[propName] != typeof obj2[propName]) {
            return false;
        }
    }

    /*  Second object
        Deeper check.
        There may be a property that only exists in obj2.
        --------------------------------------------------------------------- */
    for (let propName in obj2) {
        if (obj1.hasOwnProperty(propName) != obj2.hasOwnProperty(propName)) {
            return false;
        }
        // Check for property types
        else if (typeof obj1[propName] != typeof obj2[propName]) {
            return false;
        }

        // If the property is inherited, do not check anymore.
        if (!obj1.hasOwnProperty(propName)) {
            continue;
        }

        // Detailed check

        // If the property is an array.
        if (
            obj1[propName] instanceof Array &&
            obj2[propName] instanceof Array
        ) {
            if (!arrayEquals(obj1[propName], obj2[propName])) {
                return false;
            }
        }

        // If the property is an object.
        else if (
            obj1[propName] instanceof Object &&
            obj2[propName] instanceof Object
        ) {
            // Recursion.
            if (!objectEquals(obj1[propName], obj2[propName])) {
                return false;
            }
        }

        // Normal value comparison for strings and numbers.
        else if (obj1[propName] !== obj2[propName]) {
            return false;
        }
    }

    // If everything passed
    return true;
}

/**
 * Mimics loosely the behavior of the PHP function isset().
 * Determine if a variable is declared and is different than null.
 *
 * @param {...*} args Any number of variables of any type to be verified.
 * @return {boolean}  {boolean} Returns true if variable exists and has any value other than null. false otherwise.
 * @see {@link https://stackoverflow.com/questions/2141520/javascript-variable-number-of-arguments-to-function#answer-2141530 JavaScript variable number of arguments to function}
 * @see {@link https://www.damirscorner.com/blog/posts/20180216-VariableNumberOfArgumentsInTypescript.html Variable Number of Arguments in TypeScript}
 * @see {@link https://stackoverflow.com/questions/6003884/how-do-i-check-for-null-values-in-javascript#answer-27550756 How do I check for null values in JavaScript?}
 */
function isSet(...args): boolean {
    for (let i = 0; i < args.length; i += 1) {
        if (typeof args[i] == 'undefined' || args[i] === null) {
            return false;
        }
    }

    return true;
}

/**
 * Mimics loosely the behaiour of the PHP trim() function.
 *
 * @param {string} value The string to be trimmed.
 * @return {string}  {string} The trimmed string;
 */
function trim(value: string): string {
    if (!isSet(value) || typeof value !== 'string') {
        $.writeln('trim(): The value must be a string!');
        return;
    }
    return value
        .replace(/^\s+|\s+$/gm, '')
        .replace(/^\t+|\t+$/gm, '')
        .replace(/^\n+|\n+$/gm, '')
        .replace(/^\r+|\r+$/gm, '')
        .replace(/^\0+|\0+$/gm, '')
        .replace(/^\v+|\v+$/gm, '');
}

/**
 * Mimics loosely the behaviour of the PHP in_array() function.<br />
 * Checks if a value exists in an array.<br />
 * Differently from the original in_array(), this one is always strict.<br />
 * See reference.
 *
 * @param {*} needle The searched value.
 * @param {any[]} haystack The array.
 * @return {boolean}  {boolean} Returns true if needle is found in the array, false otherwise.
 * @see {@link https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript How to compare arrays in JavaScript?}
 * @see {@link https://www.php.net/manual/en/function.in-array.php#106319  beingmrkenny at gmail dot com}
 */
function inArray(needle: any, haystack: any[]): boolean {
    for (let i = 0; i < haystack.length; i += 1) {
        // In case needle is an array.
        if (needle instanceof Array && haystack[i] instanceof Array) {
            /*  If the arrays are equal, it means the searched element is
                in the array. */
            if (arrayEquals(needle, haystack[i])) {
                return true;
            }
        }

        // In case needle is an (simple) object.
        else if (needle instanceof Object && haystack[i] instanceof Object) {
            if (objectEquals(needle, haystack[i])) {
                return true;
            }
        }

        // In case needle is neither an array nor an object.
        else if (needle === haystack[i]) {
            return true;
        }
    }

    return false;
}

// Validation functions
// =============================================================================

/**
 * Checks if the given string is empty.<br />
 * Validate data presence.<br />
 * Uses <b><code>trim()</code></b> so empty spaces don't count.<br />
 * Uses <em>.length === 0</em> to avoid empty strings.
 *
 * @param {string} strValue The string to be checked.
 * @return {boolean}  {boolean} True if the string is empty. False otherwise.
 * @see {@link https://www.w3schools.com/jsref/jsref_trim_string.asp JavaScript String trim()}
 * @see {@link https://stackoverflow.com/questions/154059/how-can-i-check-for-an-empty-undefined-null-string-in-javascript How can I check for an empty/undefined/null string in JavaScript?}
 * @example
 * // Calling this function:
 * isBlank('abcd')
 */
function isBlank(value: string): boolean {
    // If the string is not set.
    if (!isSet(value)) {
        return true;
    } else if (typeof value !== 'string') {
        $.writeln('The argument must be a string!');
        return;
    }

    // Removes spaces from the string.
    const trimmedStr = trim(value);

    // If the string has 0 length (is empty).
    if (trimmedStr.length === 0) {
        return true;
    }

    // If the string is not empty.
    return false;
}

/**
 * Validate data presence.<br />
 * Reverse of isBlank().
 *
 * @param {string} value The string to be checked.
 * @return {boolean}  {boolean} true if it has presence. false otherwise.
 * @example
 * // Calling this function:
 * hasPresence('abcd')
 */
function hasPresence(value: string): boolean {
    return !isBlank(value);
}

/**
 * Validate string length.<br />
 * Spaces count towards length.<br />
 * Use <b><code>trim()</code></b> if spaces should not count.
 *
 * @param {string} value The string to be verified.
 * @param {number} min The minimun number to compare the string with.
 * @return {boolean}  {boolean} true if the string is greater. false otherwise.
 * @example
 * // Calling this function:
 * hasLengthGreaterThan('abcd', 3)
 */
function hasLengthGreaterThan(value: string, min: number): boolean {
    return value.length > min;
}

/**
 * Validate string length.<br />
 * Spaces count towards length.<br />
 * Use <b><code>trim()</code></b> if spaces should not count.
 *
 * @param {string} value The string to be verified.
 * @param {number} max The maximun number to compare the string with.
 * @return {boolean}  {boolean} true if the string is smaller. false otherwise.
 * @example
 * // Calling this function:
 * hasLengthLessThan('abcd', 5)
 */
function hasLengthLessThan(value: string, max: number): boolean {
    return value.length < max;
}

/**
 * Validate string length.<br />
 * Spaces count towards length.<br />
 * Use <b><code>trim()</code></b> if spaces should not count.
 *
 * @param {string} value The string to be verified.
 * @param {number} exact The exact number that should be the string's length.
 * @return {boolean}  {boolean} true if the string has that length. false otherwise.
 * @example
 * // Calling this function:
 * hasLengthExactly('abcd', 4)
 */
function hasLengthExactly(value: string, exact: number): boolean {
    return value.length == exact;
}

/**
 * Validate string length.<br />
 * Combines functions greaterThan, lessThan and exactly.<br />
 * Spaces count towards length.<br />
 * Use <b><code>trim()</code></b> if spaces should not count.
 *
 * @template T
 * @param {string} value The string to be verified.
 * @param {T} options Object with properties to check the string length.
 * @param {number} [options.min] Minimun number.
 * @param {number} [options.max] Maximun number.
 * @param {number} [options.exact] Exact number.
 * @return {boolean}  {boolean}
 * @see {@link https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#template @template}
 * @example
 * // How to call this function:
 * hasLength('abcd', {'min': 3, 'max': 5})
 */
function hasLength<T extends { min?: number; max?: number; exact?: number }>(
    value: string,
    options: T
): boolean {
    if (
        isSet(options['min']) &&
        !hasLengthGreaterThan(value, options['min'] - 1)
    ) {
        return false;
    } else if (
        isSet(options['max']) &&
        !hasLengthLessThan(value, options['max'] + 1)
    ) {
        return false;
    } else if (
        isSet(options['exact']) &&
        !hasLengthExactly(value, options['exact'])
    ) {
        return false;
    } else {
        return true;
    }
}

/**
 * Validate inclusion in a set.
 *
 * @param {*} value The value to searched in the set.
 * @param {any[]} set The array to search in.
 * @return {boolean}  {boolean} true if found. false otherwise.
 * @example
 * // How to call this function:
 * hasInclusionOf(5, [1, 3, 5, 7, 9])
 */
function hasInclusionOf(value: any, set: any[]): boolean {
    return inArray(value, set);
}

/**
 * Validate exclusion from a set.
 *
 * @param {*} value The value to search in the set.
 * @param {any[]} set The array to search for the value.
 * @return {boolean}  {boolean} true if not in the array. false otherwise.
 * @example
 * // How to call this function:
 * hasExclusionOf(5, [1, 3, 5, 7, 9])
 */
function hasExclusionOf(value: any, set: any[]): boolean {
    return !inArray(value, set);
}

/**
 * Validate inclusion of character(s).<br />
 * <code>.indesOf</code> returns the index of the first occurrence of
 * <code>requiredString</code> found, or <code>-1</code> if not found.<br />
 * Uses <code>!==</code> to prevent position <code>0</code> from being
 * considered false.
 *
 * @param {string} value The string to search in.
 * @param {string} requiredString The substring to search for.
 * @return {boolean}  {boolean} true if found. false otherwise.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf#return_value String.prototype.indexOf()}
 * @see {@link https://stackoverflow.com/questions/3978204/jquery-or-javascript-equivalent-of-php-strpos-function-to-find-string-on-a-page jQuery or JavaScript equivalent of PHP strpos function to find string on a page}
 * @example
 * // How to call this function:
 * hasString('nobody@nowhere.com', '.com')
 */
function hasString(value: string, requiredString: string): boolean {
    const result: number = value.indexOf(requiredString);

    // .indexOf returns -1 if it does not find.
    const foundIt: boolean = result >= 0 ? true : false;
    return foundIt !== false;
}

/**
 * Validate correct format for email addresses.<br />
 * <code>Format: [chars]@[chars].[2+ letters]</code><br />
 * <code>.match</code> is helpful. It uses a regular expression and<br />
 * returns an array for matches, <code>null</code> for no match.
 *
 * @param {string} value The string to be matched against the regular expression.
 * @return {boolean}  {boolean} true if the string has valid format. false otherwise.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match#return_value String.prototype.match()}
 * @see {@link https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript#answer-46181 How can I validate an email address in JavaScript?}
 */
function hasValidEmailFormat(value: string): boolean {
    const emailRegex: RegExp =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const matchResult: RegExpMatchArray = String(value)
        .toLowerCase()
        .match(emailRegex);

    const result: boolean = matchResult instanceof Array ? true : false;
    return result;
}


function hasUniqueUsername(username: string, currentId: number = 0): boolean {
    return false;
}