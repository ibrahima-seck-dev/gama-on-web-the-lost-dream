export default class UIManager {
    static createMessageDiv() {
      const div = document.createElement("div");
      div.id = "game-message";
      div.style.position = "absolute";
      div.style.top = "10%";
      div.style.left = "50%";
      div.style.transform = "translateX(-50%)";
      div.style.padding = "20px";
      div.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      div.style.color = "white";
      div.style.fontSize = "24px";
      div.style.borderRadius = "10px";
      div.style.zIndex = 1000;
      div.style.display = "none";
      document.body.appendChild(div);
    }
  
    static showMessage(text, duration = 3000) {
      let div = document.getElementById("game-message");
      if (!div) UIManager.createMessageDiv();
      div = document.getElementById("game-message");
      div.innerText = text;
      div.style.display = "block";
  
      if (duration > 0) {
        setTimeout(() => {
          div.style.display = "none";
        }, duration);
      }
    }
  
    static hideMessage() {
      const div = document.getElementById("game-message");
      if (div) div.style.display = "none";
    }
  }
  