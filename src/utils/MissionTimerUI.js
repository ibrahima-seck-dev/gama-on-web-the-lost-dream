class MissionTimerUI {
    static create() {
      let existing = document.getElementById("mission-timer");
      if (existing) existing.remove();
  
      const timer = document.createElement("div");
      timer.id = "mission-timer";
      timer.style.position = "absolute";
      timer.style.top = "20px";
      timer.style.right = "20px";
      timer.style.padding = "10px 15px";
      timer.style.background = "rgba(0,0,0,0.7)";
      timer.style.color = "white";
      timer.style.fontSize = "20px";
      timer.style.borderRadius = "8px";
      timer.style.zIndex = "9999";
  
      document.body.appendChild(timer);
    }
  
    static update(timeLeft) {
        const timer = document.getElementById("mission-timer");
        if (timer) {
          timer.innerText = `⏱ Temps restant : ${timeLeft}s`;
      
          if (timeLeft <= 50) {
            timer.style.background = "rgba(255, 0, 0, 0.8)"; // 🔴 rouge
          } else {
            timer.style.background = "rgba(0, 0, 0, 0.7)";
          }
        }
      }
      
  
    static remove() {
      const timer = document.getElementById("mission-timer");
      if (timer) timer.remove();
    }
  }
  export default  MissionTimerUI;