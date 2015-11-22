define(['lib/three', 'constants', 'party', 'direction'], function(THREE, Const, Party, Direction) {
    function Dungeon() {
        this.map = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0],
                    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
                    [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
                    [0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0],
                    [0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0],
                    [0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0],
                    [0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0],
                    [0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
                    [0, 0, 1, 1, 1, 0, 1, 2, 1, 1, 1, 0],
                    [0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        
        this.spawn_loc = {x: 3, y: 9};
        this.spawn_dir = Direction.NORTH;
    }

    Dungeon.prototype = {
        partyCollidesWith: function(x, y) {
            return Const.TILES[this.map[y][x]].isSolid;
        },

        spawnParty: function() {
            var self = this;
            return new Party(this.spawn_loc.x,
                             this.spawn_loc.y,
                             this.spawn_dir,
                             function(x, y) {
                                 return self.partyCollidesWith(x, y);
                             });
        },

        addMeshesToScene: function(scene) {
            var material = new THREE.MeshPhongMaterial({color: 0x888888});

            for (var y = 0; y < this.map.length; y++) {
                var row = this.map[y];
                for (var x = 0; x < row.length; x++) {
                    var type = row[x];

                    if (type == 0) {
                        var geometry = new THREE.BoxGeometry(1, 1, 1);
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;

                        mesh.position.x = x;
                        mesh.position.y = 0.5;
                        mesh.position.z = y;
                        scene.add(mesh)
                    }
                }
            }
        }
    };

    return Dungeon;
});
