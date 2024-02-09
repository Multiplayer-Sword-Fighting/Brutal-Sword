
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

        //photonNetwork.disconnect();location.reload();
    }
}


var gameStartTime = 0;
class Multiplayer extends bs {
    /** @type {bs}*/
    UI = null;
    /** @type {bs}*/
    PlayerNameField = null
    /** @type {bs}*/
    OponentNameField = null
    /** @type {WorldState}*/
    received = new WorldState();
    initialize() 
    {
        
        setInterval(this.SendData.bind(this), 1/30*1000);
        photonNetwork = new Photon.LoadBalancing.LoadBalancingClient(1, this.appId, this.appVersion);
        //photonNetwork.app = this.app;
        photonNetwork.connectToRegionMaster(Menu.save.region);
        
        
        photonNetwork.onRoomList = () => {
            Menu.roomList = photonNetwork.availableRooms();
            Menu.roomCount = "Room count: " + Menu.roomList.length;
        };

        photonNetwork.onJoinRoom = () => {
            console.log("Joined the room.");
        };
        photonNetwork.onStateChange = (state) => {
            this.PlayerNameField.text = Menu.save.playerName;
            photonNetwork.myActor().setName(Menu.save.playerName);
            Menu.roomCount = "Connecting: "+state;
                            
            if (state === Photon.LoadBalancing.LoadBalancingClient.State.Disconnected || state === -1) {
                console.log("Disconnected from the server. Reconnecting...");
                if (state !== Photon.LoadBalancing.LoadBalancingClient.State.Disconnected)
                    photonNetwork.disconnect();
                setTimeout(() => {
                    photonNetwork.connectToRegionMaster(Menu.save.region);
                }, 1000);
            } else if (state === Photon.LoadBalancing.LoadBalancingClient.State.ConnectedToMaster) {
                console.log("Connected to master. Joining lobby...");
                if(pc.app.xr.active)
                    this.Start();

            }
        };


        photonNetwork.onActorJoin = (a) => {
            console.log("Actor joined", a);
            this.RestartGame();
            this.OponentNameField.text = photonNetwork.actorsArray.find(a => !a.isLocal)?.name ?? "Shadow"
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
            if(!a.isLocal)
                photonNetwork.leaveRoom();                
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
    roomName;    
    Start() {
        var host = { maxPlayers: 2, propsListedInLobby: ["mod", "name","url"], customGameProperties: { url: currentMod.url, name: this.PlayerNameField.text, mod: currentMod._id } };
        console.log("Start", host);
        if(!this.roomName)
            photonNetwork.joinRandomOrCreateRoom({ expectedMaxPlayers: 2, expectedCustomRoomProperties: { mod: currentMod._id } }, null, host);
        else
            photonNetwork.joinRoom(this.roomName);
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
        if (photonNetwork?.isJoinedToRoom()) {
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