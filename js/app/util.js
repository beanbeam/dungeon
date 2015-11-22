define({

    // A modulo function that correctly handles negative numbers
    mod: function(n, m) {
        return ((n % m) + m) % m
    },

    fovConvert: function(fov, ratio) {
        return Math.atan(Math.tan(fov * Math.PI/360) * ratio) * 360 / Math.PI;
    }
});
