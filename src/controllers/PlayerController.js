import { ActionManager, Vector3, KeyboardEventTypes } from "@babylonjs/core";

class PlayerController {
  constructor(scene, playerMesh, animations = {}, speed = 0.1, jumpSound = null) {
    this.scene = scene;
    this.playerMesh = playerMesh;
    this.animations = animations;
    this.speed = speed;
    this.jumpSound = jumpSound;

    this.inputMap = {};
    this.currentAnim = "";
    this.isJumping = false;
    this.jumpVelocity = 0;
    this.gravity = 0.01;
    this.minY = 0.5;
    this.active = true;

    this.initControls();
  }

  initControls() {
    this.scene.actionManager = new ActionManager(this.scene);

    this.scene.onKeyboardObservable.add((kbInfo) => {
      const key = kbInfo.event.key.toLowerCase();
      if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
        this.inputMap[key] = true;
      } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
        this.inputMap[key] = false;
      }
    });

    this.scene.onBeforeRenderObservable.add(() => {
      if (this.active) this.updateMovement();
    });
  }

  playAnimation(name, loop = true) {
    if (this.currentAnim === name) return;

    if (this.animations[this.currentAnim]?.isStarted) {
      this.animations[this.currentAnim].stop();
    }

    if (this.animations[name]) {
      this.animations[name].start(loop);
      this.currentAnim = name;
    }
  }

  updateMovement() {
    if (!this.playerMesh) return;

    const direction = new Vector3(0, 0, 0);

    if (this.inputMap["arrowup"] || this.inputMap["z"]) direction.z -= 1;
    if (this.inputMap["arrowdown"] || this.inputMap["s"]) direction.z += 1;
    if (this.inputMap["arrowleft"] || this.inputMap["q"]) direction.x -= 1;
    if (this.inputMap["arrowright"] || this.inputMap["d"]) direction.x += 1;

    const hasMovement = direction.lengthSquared() > 0;

    if (hasMovement && !this.isJumping) {
      direction.normalize();
      this.playerMesh.moveWithCollisions(direction.scale(this.speed));

      const targetRotationY = Math.atan2(direction.x, direction.z);
      const currentY = this.playerMesh.rotation.y;
      this.playerMesh.rotation.y = currentY + (targetRotationY - currentY) * 0.2;

      this.playAnimation("Run");
    } else if (!hasMovement && !this.isJumping) {
      this.playAnimation("Idle");
    }

    if (this.inputMap[" "] && !this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = 0.2;
      this.playAnimation("Jump", false);

      if (this.jumpSound && this.jumpSound.isReady) {
        this.jumpSound.play();
      }
    }

    if (this.isJumping) {
      this.playerMesh.moveWithCollisions(new Vector3(0, this.jumpVelocity, 0));
      this.jumpVelocity -= this.gravity;

      if (this.playerMesh.position.y <= this.minY) {
        this.playerMesh.position.y = this.minY;
        this.isJumping = false;

        this.playAnimation(hasMovement ? "Run" : "Idle");
      }
    }
  }

  setLimits(cityMesh) {
    this.cityMesh = cityMesh;
    // Tu peux ajouter des limites de mouvement ici si nécessaire
  }
}

export default PlayerController;
