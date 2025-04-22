import KeyItem from "../models/KeyItem";
import Door from "../models/Door";
import UIManager from "../utils/UIManager";
import MessageUI from "../utils/MessageUI";
import Constants from "../utils/Constants";
import MissionTimerUI from "../utils/MissionTimerUI";
import MissionFailUI from "../utils/MissionFailUI";
import GPSUI from "../utils/GPSUI";

import { Vector3 } from "@babylonjs/core";

class FindKeyMission {
  constructor(scene, playerMesh, skeleton, onSuccess) {
    this.scene = scene;
    this.playerMesh = playerMesh;
    this.skeleton = skeleton;
    this.key = null;
    this.door = null;
    this.keyCollected = false;
    this.doorOpened = false;
    this.onSuccess = onSuccess;
    this.timer = null;
    this.timeLeft = 60; // 60 secondes
  }

  async start() {
    await MessageUI.show(
      this.scene,
      "Trouve la clé pour ouvrir la porte 🔑",
      Constants.KEY_IMAGE_URL,
      5000
    );

    UIManager.createMessageDiv();
    MissionTimerUI.create();
    this.startTimer();

    this.key = await KeyItem.create(this.scene, Constants.KEY_MODEL_URL);
    this.key.mesh.scaling = new Vector3(0.05, 0.05, 0.05);
    this.key.mesh.position = new Vector3(3.2, 0.5, -7.8);

    this.door = await Door.create(this.scene, Constants.DOOR_MODEL_URL);
    this.door.mesh.position = new Vector3(41.82, 0.66, -3.25);

    this.scene.registerBeforeRender(() => this.update());
    GPSUI.init();
    GPSUI.show();

  }

  update() {
    if (!this.keyCollected) {
      GPSUI.update(this.key.mesh.position, this.playerMesh.position, "Clé");
      
      const dist = this.playerMesh.position.subtract(this.key.mesh.position).length();
      if (dist < 2) {
        this.key.collect(this.playerMesh, this.skeleton);
        this.keyCollected = true;
  
        UIManager.showMessage("Clé collectée !");
        MessageUI.show(
          this.scene,
          "Bien joué ! Maintenant trouve la porte 🚪",
          Constants.DOOR_IMAGE_URL,
          5000
        );
      }
    } else if (!this.doorOpened) {
      GPSUI.update(this.door.mesh.position, this.playerMesh.position, "Porte");
  
      const dist = this.playerMesh.position.subtract(this.door.mesh.position).length();
      if (dist < 1) {
        this.door.open();
        this.doorOpened = true;
  
        UIManager.showMessage("Porte ouverte !");
        MissionTimerUI.remove();
        clearInterval(this.timer);
  
        if (this.key?.mesh) this.key.mesh.setEnabled(false);
  
        GPSUI.hide(); // On masque le GPS une fois la mission finie
  
        setTimeout(() => {
          if (this.onSuccess) this.onSuccess();
        }, 2000);
      }
    }
  }
  

  startTimer() {
    MissionTimerUI.update(this.timeLeft);

    this.timer = setInterval(() => {
      this.timeLeft--;
      MissionTimerUI.update(this.timeLeft);

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.failMission();
      }
    }, 1000);
  }

  failMission() {
    MissionTimerUI.remove();
    UIManager.showMessage("Temps écoulé !");

    if (this.key?.mesh) this.key.mesh.setEnabled(false);
    if (this.door?.mesh) this.door.mesh.setEnabled(false);

    // ✅ Appelle la fonction de rappel uniquement après clic
    MissionFailUI.show(
      this.scene,
      "⏰ Temps écoulé ! Veux-tu réessayer la mission ?",
      () => {
        if (this.onSuccess) this.onSuccess("retry");
      }
    );
  }
}

export default FindKeyMission;
