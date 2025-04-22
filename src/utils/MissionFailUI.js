 class MissionFailUI {
    static show(scene, message, onRetry) {
      // Supprime l'existant s'il y a
      const existing = document.getElementById("mission-fail-ui");
      if (existing) existing.remove();
  
      const container = document.createElement("div");
      container.id = "mission-fail-ui";
      container.style.position = "absolute";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.justifyContent = "center";
      container.style.alignItems = "center";
      container.style.zIndex = "9999";
      container.style.color = "white";
      container.style.fontSize = "24px";
  
      const messageDiv = document.createElement("div");
      messageDiv.innerText = message;
      messageDiv.style.marginBottom = "20px";
  
      const retryBtn = document.createElement("button");
      retryBtn.innerText = "🔁 Recommencer";
      retryBtn.style.padding = "10px 20px";
      retryBtn.style.fontSize = "20px";
      retryBtn.style.cursor = "pointer";
  
      retryBtn.onclick = () => {
        container.remove();
        if (onRetry) onRetry();
      };
  
      container.appendChild(messageDiv);
      container.appendChild(retryBtn);
      document.body.appendChild(container);
    }
  }
  export default MissionFailUI