import * as GUI from "@babylonjs/gui";

class MessageUI {
  static async show(scene, text, imageUrl, duration = 4000) {
    return new Promise(resolve => {
      const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("MessageUI", true, scene);

      const container = new GUI.Rectangle();
      container.width = "60%";
      container.height = "45%";
      container.cornerRadius = 20;
      container.color = "white";
      container.thickness = 2;
      container.background = "rgba(0, 0, 0, 0.75)";
      ui.addControl(container);

      const stack = new GUI.StackPanel();
      container.addControl(stack);

      const textBlock = new GUI.TextBlock();
      textBlock.text = text;
      textBlock.color = "white";
      textBlock.fontSize = 26;
      textBlock.outlineWidth = 3;
      textBlock.outlineColor = "black";
      textBlock.height = "100px";
      stack.addControl(textBlock);

      if (imageUrl) {
        const image = new GUI.Image("infoImage", imageUrl);
        image.height = "200px";
        image.stretch = GUI.Image.STRETCH_UNIFORM;
        stack.addControl(image);
      }

      setTimeout(() => {
        ui.dispose();
        resolve();
      }, duration);
    });
  }
}

export default MessageUI;
