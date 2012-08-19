

/**
 * @typedef {function(*):*}
 */
var defineCallback;

/**
 * @param {(string|Array.<string>|defineCallback)} nameOrDepsOrCallback
 * @param {(Array.<string>|defineCallback)=} depsOrCallback
 * @param {defineCallback=} callback
 */
function define( nameOrDepsOrCallback, depsOrCallback, callback ) {};

/**
 * @param {(string|Array.<string>)} deps
 * @param {function(*):*=} callback
 */
function require(deps, callback) {}; 