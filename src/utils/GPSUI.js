import { Vector3 } from "@babylonjs/core";


class GPSUI {
    static init() {
      this.gpsText = document.getElementById("gps-text");
      this.gpsArrow = document.getElementById("gps-arrow");
      this.visible = true;
    }Ò
  
    static update(targetPosition, playerPosition, label = "Objectif") {
      if (!this.visible || !this.gpsText || !this.gpsArrow) return;
  
      const direction = targetPosition.subtract(playerPosition).normalize();
      const angle = Math.atan2(direction.x, direction.z); 
      const angleDeg = (angle * 180) / Math.PI;
      this.gpsArrow.style.transform = `rotate(${angleDeg}deg)`;
  
      const distance = Vector3.Distance(playerPosition, targetPosition);
      this.gpsText.textContent = `${label} à ${distance.toFixed(1)} m`;
    }
  
    static hide() {
      this.visible = false;
      if (this.gpsText && this.gpsArrow) {
        this.gpsText.textContent = "";
        this.gpsArrow.style.display = "none";
      }
    }
  
    static show() {
      this.visible = true;
      if (this.gpsArrow) this.gpsArrow.style.display = "inline";
    }
  }
  export default  GPSUI;