import { Engine, FreeCamera, HemisphericLight, Scene, Vector3, SceneLoader, MeshBuilder, Scalar } from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";
import "@babylonjs/loaders";

// Import des modèles 3D avec ?url pour que Webpack/Vite puisse les gérer
import mesUrl from "../assets/models/player.glb?url";
import terrainUrl from "../assets/models/terrain.glb?url";
const TRACK_WIDTH=5;
const TRACK_HEIGHT=0.1;
const TRACK_DEPTH=2;
const BORDER_HEIGHT=0.5;
let engine;
let scene;``
let canvas;
let obstacle;

class Game {
    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
        this.scene = null;
    }

    unit() {
        this.createScene();
        Inspector.Show(this.scene, {});
    }

    start() {
        this.scene = this.createScene();
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    createScene() {
        this.scene = new Scene(this.engine);

        const camera = new FreeCamera("camera1", new Vector3(3, 3.8, 5), this.scene);
        camera.setTarget( new Vector3(0,3,3));
        camera.attachControl(this.canvas, true);

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
       
        
        SceneLoader.ImportMesh("", mesUrl, "", this.scene, (newMeshes) => {
            newMeshes[0].scaling = new Vector3(0.1, 0.1, 0.1);
            newMeshes[0].name = "Player";
            camera.target = newMeshes[0];
        });
        let mainTrack=MeshBuilder.CreateBox("boxBuilder",{width:TRACK_WIDTH,height:TRACK_HEIGHT,depth:TRACK_DEPTH});

            let lefBorder=MeshBuilder.CreateBox("lefBorder",{width:TRACK_HEIGHT,height:0.5,depth:TRACK_DEPTH});
            lefBorder.position.set(-(TRACK_WIDTH/2),(BORDER_HEIGHT/2),-(TRACK_HEIGHT/2),0)
            lefBorder.parent=mainTrack;
            
            let rightBorder=MeshBuilder.CreateBox("rightBorder",{width:TRACK_HEIGHT,height:0.5,depth:TRACK_DEPTH});
            rightBorder.position.set((TRACK_WIDTH/2),(BORDER_HEIGHT/2),(TRACK_HEIGHT/2),0)
            rightBorder.parent=mainTrack
            for(let i =0 ;i > 23 ; i ++ ){
                let newTrack=mainTrack.clone()
                newTrack.position.z=-(TRACK_DEPTH *1)
            }
            
            this.obstacle=MeshBuilder.CreateCapsule("obtacle",this.scene)
            this.obstacle.position.sert(Scalar.RandomRange())
        
        /*
        SceneLoader.ImportMesh("", terrainUrl, "", this.scene, (newMeshes) => {
            newMeshes[0].name = "montagne";
            newMeshes[0].scaling = new Vector3(100, 12, 100);
        });
    */
        return this.scene;
    }
}

export default Game;
