// src/utils/MiniMap.js
import {
    FreeCamera,
    Vector3,
    Camera,
    RenderTargetTexture,
    MeshBuilder,
    StandardMaterial,
    Color3
  } from "@babylonjs/core";
  
  class MiniMap {
    constructor(scene, mainCamera) {
      this.scene = scene;
      this.mainCamera = mainCamera;
      this.init();
    }
  
    init() {
      // Créer la caméra de mini-map
      const minimapCamera = new FreeCamera("minimapCam", new Vector3(0, 50, 0), this.scene);
      minimapCamera.setTarget(new Vector3(0, 0, 0));
      minimapCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
  
      const d = 30;
      minimapCamera.orthoLeft = -d;
      minimapCamera.orthoRight = d;
      minimapCamera.orthoTop = d;
      minimapCamera.orthoBottom = -d;
      minimapCamera.layerMask = 0x10000000;
  
      // Texture de rendu
      const renderTexture = new RenderTargetTexture("minimapRTT", 512, this.scene);
      renderTexture.renderList = this.scene.meshes;
      renderTexture.activeCamera = minimapCamera;
  
      // Plan de la mini-map
      const plane = MeshBuilder.CreatePlane("minimapPlane", { width: 5, height: 5 }, this.scene);
      plane.position = new Vector3(0, 25, 10);
      plane.billboardMode = MeshBuilder.BILLBOARDMODE_ALL;
  
      const mat = new StandardMaterial("minimapMat", this.scene);
      mat.diffuseTexture = renderTexture;
      mat.emissiveColor = Color3.White();
      plane.material = mat;
  
      plane.layerMask = 0x0FFFFFFF;
  
      // Mise à jour à chaque frame
      this.scene.registerBeforeRender(() => {
        if (this.mainCamera.lockedTarget) {
          const pos = this.mainCamera.lockedTarget.position;
          minimapCamera.position.x = pos.x;
          minimapCamera.position.z = pos.z;
        }
      });
  
      this.scene.customRenderTargets.push(renderTexture);
    }
  }
  
  export default MiniMap;
  