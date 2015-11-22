define(['util'], function(Util) {
    return {
        NORTH: 0,
        EAST:  1,
        SOUTH: 2,
        WEST:  3,

        relativeTo: function(dir, relDir) {
            return Util.mod(dir+relDir, 4);
        },

        rotatedCW: function(dir) {
            return Util.mod(dir+1, 4);
        },

        rotatedCCW: function(dir) {
            return Util.mod(dir-1, 4);
        },

        deltaX: function(dir) {
            switch (dir) {
                case 0:
                case 2:
                    return 0;
                case 1:
                    return 1;
                case 3:
                    return -1;
                default:
                    throw "Invalid Direction"
            }
        },

        deltaY: function(dir) {
            switch (dir) {
                case 0:
                    return -1;
                case 1:
                case 3:
                    return 0;
                case 2:
                    return 1;
                default:
                    throw "Invalid Direction"
            }
        },

        asRadians: function(dir) {
            return (4-dir)%4 * 0.25 * 2 * Math.PI;
        }
    }
});
