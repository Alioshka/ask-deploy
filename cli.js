'use strict';

const argv = require('minimist')(process.argv.slice(2), {
    alias: {
        c: 'config'
    }
});

const ALLOWED_ARGV = [
    'config'
];

let args = {};

for (let key of ALLOWED_ARGV) {
    if (argv[key]) {
        args[key] = argv[key];
    }
}


module.exports.args = args;