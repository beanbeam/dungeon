require(['lib/three', 'lib/tween', 'dungeon', 'relativeDir', 'constants'], function(THREE, TWEEN, Dungeon, RelativeDir, Const) {
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    
    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = 1000;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 4096;
    renderer.shadowMapHeight = 4096;

    var dungeon = new Dungeon();

    var party = dungeon.spawnParty();

    dungeon.addMeshesToScene(scene);

    var geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    var material = new THREE.MeshPhongMaterial({
        color: 0x88ddff,
        emissive: 0x66aac0,
        shininess: 200});
    var cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.position.x = 7;
    cube.position.y = 0.31;
    cube.position.z = 9;
    cube.add(new THREE.PointLight(0x66aac0, 0.6, 3));
    scene.add(cube);

    var geometry = new THREE.PlaneGeometry(50, 50, 50, 50);
    var material = new THREE.MeshPhongMaterial({color: 0x888888});
    var floor = new THREE.Mesh(geometry, material);
    floor.receiveShadow = true;
    floor.rotation.x = Math.PI*-0.5
    scene.add(floor);
    
    var ceiling = new THREE.Mesh(geometry, material);
    ceiling.receiveShadow = true;
    ceiling.rotation.x = Math.PI*0.5;
    ceiling.position.y = 1;
    scene.add(ceiling);

    var ambientLight = new THREE.AmbientLight(0x08131c);
    scene.add(ambientLight);

    party.light.castShadow = true;
    party.light.shadowMapWidth = 4096;
    party.light.shadowMapHeight = 4096;
    
    scene.add(party.camera);
    

    var keyActions = {
        move_forward: function() {
            party.moveRelative(RelativeDir.FORWARD);
        },
        move_right: function() {
            party.moveRelative(RelativeDir.RIGHT);
        },
        move_left: function() {
            party.moveRelative(RelativeDir.LEFT);
        },
        move_backward: function() {
            party.moveRelative(RelativeDir.BACKWARD);
        },
        rotate_left: function() {
            party.rotateCCW();
        },
        rotate_right: function() {
            party.rotateCW();
        }
    };

    document.addEventListener('keydown', function(e) {
        var key = e.keyCode ? e.keyCode : e.which;

        for (var action in keyActions) {
            if (Const.KEYBINDINGS[action].indexOf(key) >= 0) {
                keyActions[action]();
            }
        }
    });

    window.addEventListener('resize', function() {
        party.camera.aspect = window.innerWidth/window.innerHeight;
        party.updateFov();
        party.camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function render() {
        requestAnimationFrame(render);
        TWEEN.update();

        cube.rotation.x += 0.02;
        cube.rotation.y += 0.0187;
        renderer.render(scene, party.camera);
    }

    render();

    /*
    new THREE.JSONLoader().load('models/angled_obelisk.json', function(obj) {
        var obelisk = new THREE.Mesh(obj, material);
        obelisk.position.x = 1;
        obelisk.castShadow = true;
        obelisk.receiveShadow = true;
        scene.add(obelisk);

        render();
    });
    */
});
