import { Vector3, KeyboardEventTypes } from "@babylonjs/core";
import { ActionManager } from "@babylonjs/core";

class PlayerController {
  constructor(scene, playerMesh, animations = {}, speed = 0.1, jumpSound = null, boundaries = null) {
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
    this.boundaries = boundaries;

    this.initControls();
    this.lockCameraWithinBounds();
  }

  initControls() {
    this.scene.actionManager = new ActionManager(this.scene);
    this.scene.onKeyboardObservable.add((kbInfo) => {
      const key = kbInfo.event.key.toLowerCase();
      this.inputMap[key] = kbInfo.type === KeyboardEventTypes.KEYDOWN;
    });
    this.scene.onBeforeRenderObservable.add(() => {
      if (this.active) this.updateMovement();
    });
  }

  lockCameraWithinBounds() {
    this.scene.onBeforeRenderObservable.add(() => {
      if (!this.boundaries || !this.scene.activeCamera) return;
      const cam = this.scene.activeCamera;
      const lim = this.boundaries;
      const margin = 1;
      cam.position.x = Math.max(lim.minX + margin, Math.min(lim.maxX - margin, cam.position.x));
      cam.position.z = Math.max(lim.minZ + margin, Math.min(lim.maxZ - margin, cam.position.z));
    });
  }

  setLimits(boundaries) {
    this.boundaries = boundaries;
  }

  clampPosition(pos) {
    if (!this.boundaries) return pos;
    return new Vector3(
      Math.max(this.boundaries.minX, Math.min(this.boundaries.maxX, pos.x)),
      pos.y,
      Math.max(this.boundaries.minZ, Math.min(this.boundaries.maxZ, pos.z))
    );
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

    const dir = new Vector3(
      (this.inputMap['d'] || this.inputMap['arrowright']) ? 1 : (this.inputMap['q'] || this.inputMap['arrowleft']) ? -1 : 0,
      0,
      (this.inputMap['s'] || this.inputMap['arrowdown']) ? 1 : (this.inputMap['z'] || this.inputMap['arrowup']) ? -1 : 0
    );

    const moving = dir.lengthSquared() > 0;

    if (moving && !this.isJumping) {
      dir.normalize();
      const move = dir.scale(this.speed);
      let nextPos = this.playerMesh.position.add(move);
      nextPos = this.clampPosition(nextPos);
      this.playerMesh.moveWithCollisions(nextPos.subtract(this.playerMesh.position));

      // Rotation fluide vers la direction de déplacement
      const desiredAngle = Math.atan2(dir.x, dir.z);
      const currentY = this.playerMesh.rotation.y;
      const deltaAngle = desiredAngle - currentY;
      const wrappedDelta = Math.atan2(Math.sin(deltaAngle), Math.cos(deltaAngle));
      this.playerMesh.rotation.y += wrappedDelta * 0.2;

      this.playAnimation('Run');
    } else if (!moving && !this.isJumping) {
      this.playAnimation('Idle');
    }

    if (this.inputMap[' '] && !this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = 0.2;
      this.playAnimation('Jump', false);
      if (this.jumpSound?.isReady()) this.jumpSound.play();
    }

    if (this.isJumping) {
      this.playerMesh.moveWithCollisions(new Vector3(0, this.jumpVelocity, 0));
      this.jumpVelocity -= this.gravity;
      if (this.playerMesh.position.y <= this.minY) {
        this.playerMesh.position.y = this.minY;
        this.isJumping = false;
        this.playAnimation(moving ? 'Run' : 'Idle');
      }
    }

    this.playerMesh.position.copyFrom(this.clampPosition(this.playerMesh.position));
  }
}

export default PlayerController