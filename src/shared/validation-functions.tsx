/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "isSet|isBlank|hasPresence" }] */

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
function hasLength<T extends {min?: number, max?: number, exact?: number}>(value: string, options: T): boolean {
    if (isSet(options['min']) && !hasLengthGreaterThan(value, options['min'] - 1)) {
        return false;
    } else if (isSet(options['max']) && !hasLengthLessThan(value, options['max'] + 1)) {
        return false;
    } else if (isSet(options['exact']) && !hasLengthExactly(value, options['exact'])) {
        return false;
    } else {
        return true;
    }
}
