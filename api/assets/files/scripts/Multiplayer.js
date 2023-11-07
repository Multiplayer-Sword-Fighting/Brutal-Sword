if (globalThis.importScripts) bs = pc.ScriptType;

pc.Entity.prototype = pc.Entity.prototype;
pc.Entity.prototype.getData = function () {
    const position = this.getPosition();
    const rotation = this.getEulerAngles();
    return [position.x, position.y, position.z, rotation.x, rotation.y, rotation.z];
}
class WorldState {
    player = []
    ControllerL = []
    ControllerR = []
}
let worldState = new WorldState();
pc.Entity.prototype.setData = function (data) {
    this.setPosition(data[0], data[1], data[2]);
    this.setEulerAngles(data[3], data[4], data[5]);
}

class Multiplayer extends pc.ScriptType {
    initialize() {
        // Photon Settings
        this.loadBalancingClient = new Photon.LoadBalancing.LoadBalancingClient(this.wss ? 1 : 0, this.appId, this.appVersion);


        // pc.Application
        this.loadBalancingClient.app = this.app;
        // Connect to the master server
        if (!this.loadBalancingClient.isInLobby()) {
            this.loadBalancingClient.connectToRegionMaster(this.region);
        }
        this.loadBalancingClient.onRoomList = () => {
            this.loadBalancingClient.joinRandomOrCreateRoom({ maxPlayers: 2 });
        };
        this.loadBalancingClient.onJoinRoom = (createdByMe) => {
            console.log("Joined the room.");
            
        };
        
        this.loadBalancingClient.onActorJoin = (a)=>{
            if(a.isLocal) return;
            st.Mirror.enabled = false;
        };
        this.loadBalancingClient.onActorLeave = (a)=>{
            st.Mirror.enabled = true;
        };

        this.loadBalancingClient.onEvent = (code, /** @type {WorldState} */content, actorNr) => {
            switch (code) {
                case 1: {
                      /** enemy @type {Life} */
                    const life = st.Mirror.Player;
                    
                    life.entity.setData(content.player);
                    life.ControllerL.entity.setData(content.ControllerL);
                    life.ControllerR.entity.setData(content.ControllerR);
                    
                    life.Head.entity.setData(content.Head);
                }
                default:
            }
        };


    }

    update() {
        if (this.loadBalancingClient.isJoinedToRoom) {
            worldState.player = st.Player.entity.getData();
            worldState.ControllerL = st.Player.ControllerL.entity.getData();
            worldState.ControllerR = st.Player.ControllerR.entity.getData();
            worldState.Head = st.Head.entity.getData();
            this.loadBalancingClient.raiseEvent(1, worldState, { receivers: Photon.LoadBalancing.Constants.ReceiverGroup.Others });


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