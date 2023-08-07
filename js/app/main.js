require(['lib/three', 'lib/tween', 'dungeon', 'relativeDir', 'constants'], function(THREE, TWEEN, Dungeon, RelativeDir, Const) {
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer();

    renderer.setPixelRatio(window.devicePixelRatio);
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
    var cubeLight = new THREE.PointLight(0x66aac0, 0.6, 3);
    cube.add(cubeLight);
    scene.add(cube);

    var ambientLight = new THREE.AmbientLight(0x08131c);
    scene.add(ambientLight);

    party.light.castShadow = true;
    party.light.shadowMapWidth = 4096;
    party.light.shadowMapHeight = 4096;

    scene.add(party.camera);


    document.addEventListener('keydown', function(e) {
        var key = e.keyCode ? e.keyCode : e.which;

        party.handleKey(key);
    });

    window.addEventListener('resize', function() {
        party.camera.aspect = window.innerWidth/window.innerHeight;
        party.updateFov();
        party.camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function render(t) {
        requestAnimationFrame(render);
        TWEEN.update();

        party.tick();
        cube.rotation.x += 0.02;
        cube.rotation.y += 0.0187;
        cubeLight.intensity = 0.1 * Math.sin(t*0.002) + 0.6;
        cube.position.y = 0.1 * Math.sin(t*0.001) + 0.41
        renderer.render(scene, party.camera);
    }

    //render();

    var lightCoords = [[3, 8],
                       [2, 2],
                       [5, 4],
                       [9, 2],
                       [24, 4],
                       [27, 7],
                       [24, 7],
                       [27, 4]];

    var modelLoader = new THREE.JSONLoader();
    var textureLoader = new THREE.TextureLoader();

    modelLoader.load('models/bare_bulb.json', function(obj) {
        textureLoader.load('textures/bare_bulb_color.png', function (color) {
            color.magFilter = THREE.NearestFilter;
            textureLoader.load('textures/bare_bulb_emissive.png', function (emissive) {
                var material = new THREE.MeshPhongMaterial({
                    map: color,
                    emissive: 0xffffff,
                    emissiveMap: emissive
                });

                for (var i=0; i < lightCoords.length; i+=1) {
                    var bulb = new THREE.Mesh(obj, material);
                    bulb.position.x = lightCoords[i][0]
                    bulb.position.z = lightCoords[i][1]
                    bulb.castShadow = true;
                    var bulbLight = new THREE.PointLight(0xfff0dd, 0.8, 4);
                    bulbLight.position.y = 0.871;
                    //bulbLight.castShadow = true;
                    bulbLight.shadowMapWidth = 512;
                    bulbLight.shadowMapHeight = 512;
                    bulbLight.shadowCameraNear = 0.075;
                    bulbLight.shadowCameraFar = 0.13;
                    bulb.add(bulbLight)
                    scene.add(bulb);
                }

                render();
            });
        });
    });

});
