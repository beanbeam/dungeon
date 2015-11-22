define(['lib/three', 'lib/tween', 'util', 'constants', 'direction', 'relativeDir'], function(THREE, TWEEN, Util, Const, Direction, RelativeDir) {
    function Party(x, y, dir, collisions) {
        this.position = {x: x, y: y};
        this.direction = dir;
        this.collidesWith = collisions;

        var self = this;
        this.keyActions = {
            move_forward: {movement: true, action: function() {
                self.moveRelative(RelativeDir.FORWARD);
            }},
            move_right: {movement: true, action: function() {
                self.moveRelative(RelativeDir.RIGHT);
            }},
                move_left: {movement: true, action: function() {
                self.moveRelative(RelativeDir.LEFT);
            }},
            move_backward: {movement: true, action: function() {
                self.moveRelative(RelativeDir.BACKWARD);
            }},
            rotate_left: {movement: true, action: function() {
                self.rotateCCW();
            }},
            rotate_right: {movement: true, action: function() {
                self.rotateCW();
            }}
        };
        
        this.moving = false;
        this.nextMove = null;

        this.camera = new THREE.PerspectiveCamera(Const.FOV, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.y = Const.CAMERA_HEIGHT;

        this.light = new THREE.PointLight(Const.PARTY.LIGHT.COLOR, Const.PARTY.LIGHT.INTENSITY, Const.PARTY.LIGHT.RADIUS);
        this.light.position.x = Const.PARTY.LIGHT.OFFSET.x;
        this.light.position.z = Const.PARTY.LIGHT.OFFSET.y;
        this.light.position.y = Const.PARTY.LIGHT.OFFSET.z;

        this.light.shadowBias = 0.01; // Prevents shadow lines at seams in walls. Not sure why. Side-effects?
        this.light.shadowCameraNear = 0.05;
        this.camera.add(this.light); // Parent the light to the camera

        this.updateFov();
        this.updateLocation();
        this.updateRotation();
    }

    Party.prototype = {
        updateLocation: function() {
            this.camera.position.x = this.position.x;
            this.camera.position.z = this.position.y;
        },

        updateRotation: function() {
            this.camera.rotation.y = Direction.asRadians(this.direction);
            
            this.camera.updateProjectionMatrix();
        },

        updateFov: function() {
            vFov = Util.fovConvert(Const.FOV, 1/this.camera.aspect);
            this.camera.fov = vFov;
        },

        move: function(dir) {
            this.moving = true;
            var self = this;
            
            var newX = this.position.x + Direction.deltaX(dir);
            var newY = this.position.y + Direction.deltaY(dir);
            
            if (this.collidesWith(newX, newY)) {
                var bumpPath = {
                    x: [this.position.x + Direction.deltaX(dir)*0.05, this.position.x],
                    z: [this.position.y + Direction.deltaY(dir)*0.05, this.position.y]};

                new TWEEN.Tween(this.camera.position)
                    .to(bumpPath, Const.PARTY.BUMP_TIME)
                    .easing(TWEEN.Easing.Sinusoidal.InOut)
                    .onComplete(function() {
                        self.moving = false;
                    }).start();
            } else {
                this.position.x = newX;
                this.position.y = newY;

                new TWEEN.Tween(this.camera.position)
                    .to({x: newX, z: newY}, Const.PARTY.MOVE_TIME)
                    .easing(TWEEN.Easing.Sinusoidal.InOut)
                    .onComplete(function() {
                        self.moving = false;
                        self.updateLocation();
                    }).start();
            }
        },

        moveRelative: function(relDir) {
            moveDir = Direction.relativeTo(this.direction, relDir);
            this.move(moveDir);
        },

        setLocation: function(x, y) {
            this.position.x = x;
            this.position.y = y;
            this.updateLocation();
        },

        rotateTo: function(dir) {
            this.moving = true;

            this.direction = dir;
            var self = this;

            var rotateAmount = Direction.asRadians(dir) - Util.mod(this.camera.rotation.y, 2*Math.PI);
            rotateAmount = Util.mod(rotateAmount + Math.PI, 2*Math.PI) - Math.PI

            new TWEEN.Tween(this.camera.rotation)
                .to({y: self.camera.rotation.y + rotateAmount}, Const.PARTY.ROTATE_TIME)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .onUpdate(function() {self.camera.updateProjectionMatrix()})
                .onComplete(function() {
                    self.moving = false;
                    self.updateRotation();
                }).start();
        },

        rotateCW: function() {
            this.rotateTo(Direction.rotatedCW(this.direction));
        },

        rotateCCW: function() {
            this.rotateTo(Direction.rotatedCCW(this.direction));
        },

        handleKey: function(key) {
            for (var action in this.keyActions) {
                if (Const.KEYBINDINGS[action].indexOf(key) >= 0) {
                    var actionObject = this.keyActions[action];

                    if (actionObject.movement && this.moving) {
                        this.nextMove = action;
                    } else {
                        actionObject.action();
                    }
                }
            }
        },

        tick: function() {
            if (!this.moving && this.nextMove != null) {
                this.keyActions[this.nextMove].action();
                this.nextMove = null;
            }
        }
    };

    return Party;
});
