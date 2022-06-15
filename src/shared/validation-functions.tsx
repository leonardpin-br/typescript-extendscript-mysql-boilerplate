/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "isSet|isBlank|hasPresence" }] */

/**
 * Mimics loosely the behavior of the PHP function isset().
 * Determine if a variable is declared and is different than null.
 *
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
 * Checks if the given string is empty.<br />
 * Validate data presence.<br />
 * Uses <em>.replace()</em> so empty spaces don't count.<br />
 * Uses <em>.length === 0</em> to avoid empty strings.
 *
 * @param {string} strValue The string to be checked.
 * @return {boolean}  {boolean} True if the string is empty. False otherwise.
 * @see {@link https://www.w3schools.com/jsref/jsref_trim_string.asp JavaScript String trim()}
 * @see {@link https://stackoverflow.com/questions/154059/how-can-i-check-for-an-empty-undefined-null-string-in-javascript How can I check for an empty/undefined/null string in JavaScript?}
 */
function isBlank(strValue: string): boolean {
    // If the string is not set.
    if (!isSet(strValue)) {
        return true;
    } else if (typeof strValue !== 'string') {
        $.writeln('The argument must be a string!');
        return;
    }

    // Removes spaces from the string.
    const trimmedStr = strValue.replace(/^\s+|\s+$/gm, '');

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
 */
function hasPresence(value: string): boolean {
    return !isBlank(value);
}










/**
 * Checks if the string has acceptable length.
 *
 * @param {string} strValue The string to be checked.
 * @param {number} [minValue=2] The minimun value. Defaults to 2.
 * @param {number} [maxValue=255] The maximun value. Defaults to 255.
 * @return {boolean}  {boolean} False if the length is not acceptable. True otherwise.
 */
function hasLength(
    strValue: string,
    minValue: number = 2,
    maxValue: number = 255
): boolean {
    if (strValue.length < minValue || strValue.length > maxValue) {
        return false;
    }
    return true;
}
