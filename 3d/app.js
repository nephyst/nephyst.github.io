window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

  /*
      var meshes = [];
      var mesh = new Engine.Mesh("Cube", 8);
      meshes.push(mesh);
      var camera = new Engine.Camera();
      var device = new Engine.Device(canvas);

      camera.Position = new BABYLON.Vector3(0, 0, 10);
      camera.Target = new BABYLON.Vector3(0, 0, 0);

      mesh.Vertices.push(new BABYLON.Vector3(1, 1, 1));
      mesh.Vertices.push(new BABYLON.Vector3(1, 1, -1));
      mesh.Vertices.push(new BABYLON.Vector3(1, -1, 1));
      mesh.Vertices.push(new BABYLON.Vector3(1, -1, -1));
      mesh.Vertices.push(new BABYLON.Vector3(-1, 1, 1));
      mesh.Vertices.push(new BABYLON.Vector3(-1, 1, -1));
      mesh.Vertices.push(new BABYLON.Vector3(-1, -1, 1));
      mesh.Vertices.push(new BABYLON.Vector3(-1, -1, -1));
      mesh.Faces.push({A:0, B:1, C:3});
      mesh.Faces.push({A:0, B:2, C:3});
      mesh.Faces.push({A:0, B:1, C:5});
      mesh.Faces.push({A:0, B:4, C:5});
      mesh.Faces.push({A:0, B:2, C:6});
      mesh.Faces.push({A:0, B:4, C:6});
      mesh.Faces.push({A:7, B:3, C:1});
      mesh.Faces.push({A:7, B:5, C:1});
      mesh.Faces.push({A:7, B:3, C:2});
      mesh.Faces.push({A:7, B:6, C:2});
      mesh.Faces.push({A:7, B:5, C:4});
      mesh.Faces.push({A:7, B:6, C:4});
      update();
  */

  //var camera = new Engine.Camera();
  var camera = new Engine.Camera();
  //var device = new Engine.Device(canvas);
  var device = new Engine.Device(canvas);
  camera.Position = new BABYLON.Vector3(0, 0, -10);
  camera.Target = new BABYLON.Vector3(0, 0, 0);
  device.LoadJSONFileAsync("res/monkey.json", loadJSONCompleted);

  function loadJSONCompleted(meshesLoaded) {
    meshes = meshesLoaded;
    requestAnimationFrame(update);
  }

  function update() {
    device.clear();

    for (var i = 0; i < meshes.length; i++) {
      //meshes[i].Rotation.x += 0.005;
      meshes[i].Rotation.y += 0.01;
    }

    device.render(camera, meshes);
    device.present();

    requestAnimationFrame(update);
  }

};
