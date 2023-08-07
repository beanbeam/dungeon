Dungeon
=======
A 3D dungeon crawler game, based on a bunch of games, particularly Legend of Grimrock.

![A spinning cube that does nothing useful!](/screenshot.png?raw=true)

Runs in browser using WebGL / THREE.js.

Developed as a project for a Computer Graphics class.

WASD to move, QE to rotate.

Status
------
Nothing in the way of gameplay yet, just a small hardcoded area to wander around in.


Dependencies
------------
Eventually I will get a real dependency/build set up working, but until then, I've included
a copy of the following required libraries, all of which are available under the MIT License:

+ [Require.js](https://github.com/jrburke/requirejs)
+ [Three.js](https://github.com/mrdoob/three.js)
+ [Tween.js](https://github.com/tweenjs/tween.js)

Getting it Running
------------------
Check it out [here](https://beanbeam.github.io/dungeon), or make the files available with a webserver:
```
cd {whatever}/dungeon
python3 -m http.server
```
Then just connect to the server, `localhost:8000` if you ran the above command.
