class MissionManager {
    constructor(scene) {
      this.scene = scene;
      this.currentMission = null;
    }
  
    startMission(mission) {
      this.currentMission = mission;
      mission.start();
    }
  
    update() {
      if (this.currentMission) {
        this.currentMission.update();
      }
    }
  }
  
  export default MissionManager;
  