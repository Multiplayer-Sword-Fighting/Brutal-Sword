
if (globalThis.importScripts) bs = pc.ScriptType;

pc.Entity.prototype = pc.Entity.prototype;
pc.Entity.prototype.getData = function () {
    const position = this.getPosition();
    const rotation = this.getEulerAngles();
    return [position.x, position.y, position.z, rotation.x, rotation.y, rotation.z];
}
class WorldState {
    data = []
}
let worldState = new WorldState();
pc.Entity.prototype.setData = function (data) {
    this.setPosition(data[0], data[1], data[2]);
    this.setEulerAngles(data[3], data[4], data[5]);
}
/** @type {Photon.LoadBalancing.LoadBalancingClient} */
var photonNetwork;
var gameStartTime = 0;
class Multiplayer extends pc.ScriptType {
    /** @type {bs}*/
    UI=null;
    initialize() {
        st.Multiplayer=this;
        // Photon Settings
        photonNetwork = new Photon.LoadBalancing.LoadBalancingClient(this.wss ? 1 : 0, this.appId, this.appVersion);
        

        // pc.Application
        photonNetwork.app = this.app;
        // Connect to the master server
        if (!photonNetwork.isInLobby()) {
            photonNetwork.connectToRegionMaster(this.region);
        }
        photonNetwork.onRoomList = () => {
            photonNetwork.joinRandomOrCreateRoom({ maxPlayers: 2 });
        };
        
        photonNetwork.onJoinRoom = () => {
            console.log("Joined the room.");
        };
        photonNetwork.onStateChange = (state) => {
            if (state === Photon.LoadBalancing.LoadBalancingClient.State.Disconnected|| state===-1) {
                console.log("Disconnected from the server. Reconnecting...");
                photonNetwork.disconnect();
                setTimeout(() => {
                    photonNetwork.connectToRegionMaster(this.region);
                }, 1000);
            } else if (state === Photon.LoadBalancing.LoadBalancingClient.State.ConnectedToMaster) {
                console.log("Connected to master. Joining lobby...");
                //photonNetwork.joinLobby();
                
            }
        };

        
        photonNetwork.onActorJoin = (a)=>{
            console.log("Actor joined", a);
            this.RestartGame();
            //if(a.isLocal && photonNetwork.actorsArray.length>1) return;
            
            st.Mirror.enabled = photonNetwork.actorsArray.length<=1;
            let isMaster = globalThis.isMaster = photonNetwork.myActor().actorNr === photonNetwork.myRoom().masterClientId;
            if(isMaster)
            {
                st.CameraController.entity.setPosition(new pc.Vec3(0, 1.6, isMaster ? 0: -5));
                st.CameraController.entity.setEulerAngles(new pc.Vec3(0, isMaster ? 0:180));
                this.UI.entity.setEulerAngles(new pc.Vec3(0, isMaster ? 0 : 180, 0));
            }                

        };
        photonNetwork.onError = (a)=>{
            console.log("Error", a);
        };
        

        photonNetwork.onActorLeave = (a)=>{
            st.Mirror.enabled = true;
        };
        

        //read
        photonNetwork.onEvent = (code, /** @type {WorldState} */content, actorNr) => {
            switch (code) {
                case 1: {
                    const life = st.Mirror.entity.script.Life;
                    let sync = life.sync;
                    for (let i = 0; i < sync.length; i++) {
                        sync[i].setData(content.data[i]);
                    }
                }
                default:
            }
        };


    }
    RestartGame(){
        gameStartTime = Date.now();
        Types.Life.forEach(e => { e.life=100; e.killCount = 0; });                        
    }
    update() { //write
        if (photonNetwork.isJoinedToRoom) {
            let life = st.Player.entity.script.Life

            worldState.data = life.sync.map(e => e.getData());
            //worldState.player = st.Player.entity.getData();
            //worldState.ControllerL = st.Player.ControllerL.entity.getData();
            //worldState.ControllerR = st.Player.ControllerR.entity.getData();
            //worldState.Head = st.Head.entity.getData();

            photonNetwork.raiseEvent(1, worldState, { receivers: Photon.LoadBalancing.Constants.ReceiverGroup.Others });


        }
    }
    
}


pc.registerScript(Multiplayer, 'Multiplayer');

// photon-loadbalancing-playcanvas.js
Multiplayer.attributes.add("appId", { type: "string" });
Multiplayer.attributes.add("appVersion", { type: "string", default: "1.0" });
Multiplayer.attributes.add("wss", { type: "boolean", default: true });
Multiplayer.attributes.add("region", {
    type: "string", default: "eu",
    description: "Photon Cloud has servers in several regions, distributed across multiple hosting centers over the world.You can choose optimized region for you.",
    enum: [
        { "Select Region": "default" },
        { "Asia, Singapore": "asia" },
        { "Australia, Melbourne": "au" },
        { "Canada, East Montreal": "cae" },
        { "Chinese Mainland (See Instructions)	Shanghai": "cn" },
        { "Europe, Amsterdam": "eu" },
        { "India, Chennai": "in" },
        { "Japan, Tokyo": "jp" },
        { "Russia Moscow": "ru" },
        { "Russia, East Khabarovsk": "rue" },
        { "South Africa Johannesburg": "za" },
        { "South America, Sao Paulo": "sa" },
        { "South Korea, Seoul": "kr" },
        { "Turkey Istanbul": "tr" },
        { "USA, East Washington": "us" },
        { "USA, West San José": "usw" },
    ],
});