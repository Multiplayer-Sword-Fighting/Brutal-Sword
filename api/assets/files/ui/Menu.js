let site = "https://api.tmrace.net"
var vue;


class Mod {
    constructor() {
        this.name = "Mod";
        this.playCount = 0;
        this.userName = "Player";
        this.url = "";
        this.icon = "";
    }
}
var Menu = {
    window:window,
    save: {
        region: 'eu',
        platform: 'VR',
        playerName: 'Player' + Math.floor(Math.random() * 100),
        playerLevel: 0,
    },
    showModal: false, 
    createMod: () => {
        window.open("https://playcanvas.com/project/"+(currentMod.project?.id??"1188202")+"/overview/brutalsword");
    },
    JoinRoom(/** @type {Photon.LoadBalancing.RoomInfo} */ room) {
        if(room.playerCount >= room.maxPlayers) 
            alert("Room is full");
        else if(room._customProperties.mod !== currentMod._id)
            window.open(room._customProperties.url);
        else
            st.Vr.sessionStart(room.name);
    },
    mods: [new Mod(),new Mod(),new Mod(),new Mod(),new Mod()],
    roomList:[{name:"room1",count:2},{name:"room2",count:3},{name:"room3",count:4}],
    roomCount: "connecting...",
    StartGame: () => {        
        console.log("StartGame");
        st.Vr.sessionStart();
    },
}

function SaveSettings() {
    localStorage.setItem('Menu.save', JSON.stringify(Menu.save));
}

document.addEventListener('visibilitychange', SaveSettings);
window.onbeforeunload = function () {
    SaveSettings();

};
function InitVue() {

    vue = new Vue({
        el: '#app',
        data: Menu,
        watch: {
            "save.region": function (newRegion, oldRegion) {
                photonNetwork.disconnect();
                photonNetwork.connectToRegionMaster(newRegion);
            }, "save.playerName": function (newName, oldName) {
                photonNetwork.myActor().setName(newName);
                st.Multiplayer.PlayerNameField.text = newName;
            }
        }
    });
    Object.assign(Menu.save, JSON.parse(localStorage.getItem('Menu') || '{}'));

}
document.addEventListener('DOMContentLoaded', InitVue);

var config;
let file = location.pathname.split('/').pop();
let id = config ? file : window.SCENE_PATH?.replace(".json", "");
let currentMod  = {
    _id: id,
    title: config ? config.project.name : document.title,
    url: config ? "https://playcanvas.com/project/" + config.project.id : location.href,
    href:location.href,
    referer: document.referrer,
    project:config?.project,
    self:config?.self,
    userName:config?.self?.username,
    add: 1
}
if(!config)
    currentMod.icon = "https://s3-eu-west-1.amazonaws.com/apps.playcanvas.com/"+file+"/thumbs/180.jpg";

fetch(site+`/brutalsword?query=${JSON.stringify(currentMod)}`).then(r => r.json()).then(r => {
    Menu.mods = r.mods;
    currentMod = r.mods.find(m=>m._id == currentMod._id) || currentMod;
    console.log(r);
});

