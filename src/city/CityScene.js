// villeScene.js
import { Scene, FreeCamera, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";
import BaseScene from "../BaseScene"



    function createCityeScene(engine, canvas) {
  const scene = new Scene(engine);

  const camera = new FreeCamera("cameraCity", new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, true);

  const light = new HemisphericLight("lightCity", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  const ground = MeshBuilder.CreateGround("groundCitys", { width: 10, height: 10 }, scene);

  // Ajoutez ici les éléments sspécifiques à la ville

  return scene;
}
