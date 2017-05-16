module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "commonjs": true
    },
    "extends": "airbnb",
    //"extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 8 // or 2017
    },
    "globals" : {
        "require": false
    },
    "rules": {
        "indent": [
            "warn",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "warn",
            "single"
        ],
        "semi": [
            "warn",
            "never"
        ],
        "no-unused-vars": [
            "warn"
        ],
        "no-console": [
            "off"
        ],
        "no-param-reassign": [
          "off"
        ],
        "no-restricted-syntax": [
            "off"
        ],
        'array-bracket-spacing': ['error', 'never']
    }
};
