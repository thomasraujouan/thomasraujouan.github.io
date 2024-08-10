/**
 * Execute a callback on a file, treated as a string.
 * @param {String} source 
 * @param {Function} callback 
 * @returns the promise
 */
function loadText(source, callback) {
    return fetch(source)
        .then((response) => response.text())
        .then(callback);
};

export { loadText }