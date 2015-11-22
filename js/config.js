// Require.js Configuration
var require = {
    baseUrl: 'js/app',
    paths: {
        lib: '../lib'
    },
    shim: {
        'lib/three': {exports: 'THREE'},
        'lib/tween': {exports: 'TWEEN'},
    }
};
