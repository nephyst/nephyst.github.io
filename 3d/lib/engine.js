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
      this.context = this.canvas.getContext("2d");
      this.depthbuffer = new Array(this.width * this.height);
    }
    Device.prototype.clear = function() {
      this.context.clearRect(0, 0, this.width, this.height);
      this.backbuffer = this.context.getImageData(0, 0, this.width, this.height);
      for (var i = 0; i < this.depthbuffer.length; i++) {
        this.depthbuffer[i] = 10000000;
      }
    };
    Device.prototype.present = function() {
      this.context.putImageData(this.backbuffer, 0, 0);
    };
    Device.prototype.project = function(coord, transMat) {
      var point = BABYLON.Vector3.TransformCoordinates(coord, transMat);
      var x = point.x * this.width + this.width / 2;
      var y = -point.y * this.height + this.height / 2;
      return (new BABYLON.Vector3(x, y, point.z));
    };
    Device.prototype.putPixel = function(x, y, z, color) {
      this.backbufferdata = this.backbuffer.data;
      var index = ((x >> 0) + (y >> 0) * this.width);
      var index4 = index * 4;
      if (this.depthbuffer[index] < z) {
        return;
      }
      this.depthbuffer[index] = z;
      this.backbufferdata[index4] = color.r * 255;
      this.backbufferdata[index4 + 1] = color.g * 255;
      this.backbufferdata[index4 + 2] = color.b * 255;
      this.backbufferdata[index4 + 3] = color.a * 255;
    };
    Device.prototype.drawPoint = function(point, color) {
      if (point.x >= 0 && point.y >= 0 && point.x < this.width && point.y < this.height) {
        this.putPixel(point.x, point.y, point.z, color);
      }
    };
    Device.prototype.processScanLine = function(y, pa, pb, pc, pd, color) {
      var normal1 = pa.y != pb.y ? (y - pa.y) / (pb.y - pa.y) : 1;
      var normal2 = pc.y != pd.y ? (y - pc.y) / (pd.y - pc.y) : 1;
      var sx = lerp(normal1, pa.x, pb.x) >> 0;
      var ex = lerp(normal2, pc.x, pd.x) >> 0;
      var z1 = lerp(normal1, pa.z, pb.z);
      var z2 = lerp(normal2, pc.z, pd.z);
      for (var x = sx; x < ex; x++) {
        var z = map(x, sx, ex, z1, z1);
        this.drawPoint(new BABYLON.Vector3(x, y, z), color);
      }
    };
    Device.prototype.drawTriangle = function(p1, p2, p3, color) {
      if (p1.y > p2.y) {
        var temp = p2;
        p2 = p1;
        p1 = temp;
      }
      if (p2.y > p3.y) {
        var temp = p2;
        p2 = p3;
        p3 = temp;
      }
      if (p1.y > p2.y) {
        var temp = p2;
        p2 = p1;
        p1 = temp;
      }
      var dP1P2;
      var dP1P3;
      if (p2.y - p1.y > 0) {
        dP1P2 = (p2.x - p1.x) / (p2.y - p1.y);
      } else {
        dP1P2 = 0;
      }
      if (p3.y - p1.y > 0) {
        dP1P3 = (p3.x - p1.x) / (p3.y - p1.y);
      } else {
        dP1P3 = 0;
      }
      if (dP1P2 > dP1P3) {
        for (var y = p1.y >> 0; y <= p3.y >> 0; y++) {
          if (y < p2.y) {
            this.processScanLine(y, p1, p3, p1, p2, color);
          } else {
            this.processScanLine(y, p1, p3, p2, p3, color);
          }
        }
      } else {
        for (var y = p1.y >> 0; y <= p3.y >> 0; y++) {
          if (y < p2.y) {
            this.processScanLine(y, p1, p2, p1, p3, color);
          } else {
            this.processScanLine(y, p2, p3, p1, p3, color);
          }
        }
      }
    };
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
          var color = 0.25 + ((j % mesh.Faces.length) / mesh.Faces.length) * 0.75;
          this.drawTriangle(pointA, pointB, pointC, new BABYLON.Color4(color, color, color, 1));
        }
      }
    };
    Device.prototype.LoadJSONFileAsync = function(fileName, callback) {
      var jsonObject = {};
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", fileName, true);
      var that = this;
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          jsonObject = JSON.parse(xmlhttp.responseText);
          callback(that.CreateMeshesFromJSON(jsonObject));
        }
      }
      xmlhttp.send(null);
    };
    Device.prototype.CreateMeshesFromJSON = function(jsonObject) {
      var meshes = [];
      for (var i = 0; i < jsonObject.meshes.length; i++) {
        var sourceMesh = jsonObject.meshes[i];
        var vertices = sourceMesh.vertices;
        var indices = sourceMesh.indices;
        var uvCount = sourceMesh.uvCount;
        var vertexStep = 1;

        switch (uvCount) {
          case 0:
            vertexStep = 6;
            break;
          case 1:
            vertexStep = 8;
            break;
          case 2:
            vertexStep = 10;
            break;
        }
        var vertexCount = vertices.length / vertexStep;
        var faceCount = indices.length / 3;
        var mesh = new Mesh(sourceMesh.name);
        for (var j = 0; j < vertexCount; j++) {
          var x = vertices[j * vertexStep];
          var y = vertices[j * vertexStep + 1];
          var z = vertices[j * vertexStep + 2];
          mesh.Vertices.push(new BABYLON.Vector3(x, y, z));
        }

        for (var j = 0; j < faceCount; j++) {
          var a = indices[j * 3];
          var b = indices[j * 3 + 1];
          var c = indices[j * 3 + 2];
          mesh.Faces.push({
            A: a,
            B: b,
            C: c
          });
        }

        var position = sourceMesh.position;
        mesh.Position = new BABYLON.Vector3(position[0], position[1], position[2]);
        meshes.push(mesh);
      }
      return meshes;

    };
    return Device;
  })();
  Engine.Device = Device;
})(Engine || (Engine = {}));
