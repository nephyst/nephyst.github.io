window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

  var meshes = [];
  var mesh = new Engine.Mesh("Cube", 8);
  meshes.push(mesh);
  var camera = new Engine.Camera();
  var device = new Engine.Device(canvas);

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

  mesh.Faces[0]

  camera.Position = new BABYLON.Vector3(0, 0, 10);
  camera.Target = new BABYLON.Vector3(0, 0, 0);

  update();

  function update() {
    device.clear();

    mesh.Rotation.x += 0.01;
    mesh.Rotation.y += 0.01;

    device.render(camera, meshes);

    requestAnimationFrame(update);
  }

};
