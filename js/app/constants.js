define({
    FOV: 110,

    CAMERA_HEIGHT: 0.3,

    PARTY: {
        MOVE_TIME: 250,
        BUMP_TIME: 150,
        ROTATE_TIME: 150,

        LIGHT: {
            COLOR: 0xffee99,
            INTENSITY: 0.8,
            RADIUS: 4.5
        }
    },

    KEYBINDINGS: {
        move_forward:  [87], // W
        move_left:     [65], // A
        move_backward: [83], // S
        move_right:    [68], // D

        rotate_left:   [81], // Q
        rotate_right:  [69], // E
    },

    TILES: [{
        isSolid: true
    },
    {
        isSolid: false
    },
    {
        isSolid: true
    }]
});
