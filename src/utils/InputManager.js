import { KeyboardEventTypes } from "@babylonjs/core";

class InputManager {
  constructor(scene) {
    this.scene = scene;
    this.inputMap = {};
    this.enabled = true;

    this._setup();
  }

  _setup() {
    this.scene.onKeyboardObservable.add((kbInfo) => {
      if (!this.enabled) return;

      const key = kbInfo.event.key.toLowerCase();
      if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
        this.inputMap[key] = true;
      } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
        this.inputMap[key] = false;
      }
    });
  }

  isKeyDown(key) {
    return !!this.inputMap[key.toLowerCase()];
  }

  getInputs() {
    return { ...this.inputMap };
  }

  reset() {
    this.inputMap = {};
  }

  disable() {
    this.enabled = false;
    this.reset();
  }

  enable() {
    this.enabled = true;
  }
}

export default InputManager;
