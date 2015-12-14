var Engine;
(function(Engine) {
  var Camera = (function() {
    function Camera() {
      this.Position = BABYLON.Vector3.Zero();
      this.Target = BABYLON.Vector3.Zero();
    }
    return Camera;
  })();
  Engine.Camera = Camera;
  var Mesh = (function() {
    function Mesh(name) {
      this.name = name;
      this.Vertices = [];
      this.Faces = [];
      this.Rotation = BABYLON.Vector3.Zero();
      this.Position = BABYLON.Vector3.Zero();
    }
    return Mesh;
  })();
  Engine.Mesh = Mesh;
  var Device = (function() {
    function Device(canvas) {
      this.canvas = canvas;
      this.width = canvas.width;
      this.height = canvas.height;
      this.context = canvas.getContext("2d");
    }
    Device.prototype.clear = function() {
      this.context.clearRect(0, 0, this.width, this.height);
    };
    Device.prototype.project = function(coord, transMatrix) {
      var point = BABYLON.Vector3.TransformCoordinates(coord, transMatrix);
      var x = point.x * this.width + (this.width / 2.0) >> 0;
      var y = -point.y * this.height + (this.height / 2.0) >> 0;
      return (new BABYLON.Vector2(x, y));
    };
    Device.prototype.drawPoint = function(point) {
      this.context.beginPath();
      this.context.arc(point.x, point.y, 1, 0, Math.PI * 2, true);
      this.context.fill();
    }
    Device.prototype.drawLine = function(point0, point1) {
      this.context.beginPath();
      this.context.moveTo(point0.x, point0.y);
      this.context.lineTo(point1.x, point1.y);
      this.context.stroke();
    }
    Device.prototype.render = function(camera, meshes) {
      var viewMatrix = BABYLON.Matrix.LookAtLH(camera.Position, camera.Target, BABYLON.Vector3.Up());
      var projectionMatrix = BABYLON.Matrix.PerspectiveFovLH(0.78, this.width / this.height, 0.01, 1.0);
      for (var i = 0; i < meshes.length; i++) {
        var mesh = meshes[i];
        var rotationMatrix = BABYLON.Matrix.RotationYawPitchRoll(mesh.Rotation.y, mesh.Rotation.x, mesh.Rotation.z);
        var positionMatrix = BABYLON.Matrix.Translation(mesh.Position.x, mesh.Position.y, mesh.Position.z);
        var worldMatrix = rotationMatrix.multiply(positionMatrix);
        var transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);
        for (var j = 0; j < mesh.Faces.length; j++) {
          var face = mesh.Faces[j];
          var vertexA = mesh.Vertices[face.A];
          var vertexB = mesh.Vertices[face.B];
          var vertexC = mesh.Vertices[face.C];

          var pointA = this.project(vertexA, transformMatrix);
          var pointB = this.project(vertexB, transformMatrix);
          var pointC = this.project(vertexC, transformMatrix);

          this.drawLine(pointA, pointB);
          this.drawLine(pointB, pointC);
          this.drawLine(pointC, pointA);
        }
      }
    }
    return Device;
  })();
  Engine.Device = Device;
})(Engine || (Engine = {}));
