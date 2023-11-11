
if (globalThis.importScripts) bs = pc.ScriptType;

class WorldState {
    data = []
}
let worldState = new WorldState();

/** @type {Photon.LoadBalancing.LoadBalancingClient} */
var photonNetwork;



document.addEventListener('visibilitychange', VisChange);

function VisChange(a) {
    console.log("change")
    if (a.target.visibilityState != "visible") {
        photonNetwork.onStateChange = null;
        photonNetwork.disconnect();
        location.reload();
    }
}


var gameStartTime = 0;
var username = "";
class Multiplayer extends bs {
    /** @type {bs}*/
    UI = null;
    /** @type {bs}*/
    PlayerNameField = null
    /** @type {bs}*/
    OponentNameField = null
    /** @type {WorldState}*/
    received = new WorldState();

    initialize() {

        (username = localStorage.getItem("username")) || localStorage.setItem("username", username = prompt("Enter your name", "Player" + Math.floor(Math.random() * 99)));

        this.PlayerNameField.text = username;

        setInterval(this.SendData.bind(this), 1/30*1000);

    }
    Start() {
        // Photon Settings
        photonNetwork = new Photon.LoadBalancing.LoadBalancingClient(this.wss ? 1 : 0, this.appId, this.appVersion);


        // pc.Application
        photonNetwork.app = this.app;
        // Connect to the master server
        if (!photonNetwork.isInLobby()) {
            photonNetwork.connectToRegionMaster(this.region);
        }

        photonNetwork.onRoomList = () => {

        };

        photonNetwork.onJoinRoom = () => {
            console.log("Joined the room.");
        };
        photonNetwork.onStateChange = (state) => {
            photonNetwork.myActor().setName(username);
            if (state === Photon.LoadBalancing.LoadBalancingClient.State.JoinedLobby)
                photonNetwork.joinRandomOrCreateRoom({ maxPlayers: 2 });

            if (state === Photon.LoadBalancing.LoadBalancingClient.State.Disconnected || state === -1) {
                console.log("Disconnected from the server. Reconnecting...");
                if (state !== Photon.LoadBalancing.LoadBalancingClient.State.Disconnected)
                    photonNetwork.disconnect();
                setTimeout(() => {
                    photonNetwork.connectToRegionMaster(this.region);
                }, 1000);
            } else if (state === Photon.LoadBalancing.LoadBalancingClient.State.ConnectedToMaster) {
                console.log("Connected to master. Joining lobby...");
                //photonNetwork.joinLobby();

            }
        };


        photonNetwork.onActorJoin = (a) => {
            console.log("Actor joined", a);
            this.RestartGame();
            this.OponentNameField.text = photonNetwork.actorsArray.find(a => !a.isLocal)?.name || "Shadow"
            //if(a.isLocal && photonNetwork.actorsArray.length>1) return;

            st.Mirror.enabled = photonNetwork.actorsArray.length <= 1;

            let isMaster = globalThis.isMaster = photonNetwork.myActor().actorNr === photonNetwork.myRoom().masterClientId;

            st.CameraController.entity.setPosition(new pc.Vec3(0, 1.6, isMaster ? 0 : -5));
            st.CameraController.entity.setEulerAngles(new pc.Vec3(0, isMaster ? 0 : 180));
            this.UI.entity.setEulerAngles(new pc.Vec3(0, isMaster ? 0 : 180, 0));

        };
        photonNetwork.onError = (a) => {
            console.log("Error", a);
        };


        photonNetwork.onActorLeave = (a) => {
            this.OponentNameField.text = "Shadow"
            st.Mirror.enabled = true;
        };


        //read
        photonNetwork.onEvent = (code, /** @type {WorldState} */content, actorNr) => {
            switch (code) {
                case 1: {
                    const life = st.Mirror.entity.script.Life;
                    let sync = life.sync;
                    for (let i = 0; i < sync.length; i++) {
                        if(!life.syncLerp.includes(life.sync[i]))
                            sync[i].setData(content.data[i]);
                    }
                    this.received = content;
                }
                default:
            }
        };


    }
    RestartGame() {
        gameStartTime = Date.now();
        Types.Life.forEach(e => { e.life = 100; e.killCount = 0; });
    }
    update(dt) {
        if (!photonNetwork || photonNetwork.actorsArray.length<2) return;
        const life = st.Mirror.entity.script.Life;
        for (let i = 0; i < this.received.data.length; i++) {
            if(life.syncLerp.includes(life.sync[i]))
                life.sync[i].setDataLerp(this.received.data[i], 10 * dt);
        }
    }
    SendData() {
        if (photonNetwork?.isJoinedToRoom) {
            let life = st.Player.entity.script.Life

            worldState.data = life.sync.map(e => e.getData());

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