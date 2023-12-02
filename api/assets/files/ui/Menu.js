
var vue;


class Mod {
    constructor() {
        this.name = "Mod";
        this.playcount = 0;
        this.userName = "Player";
        this.url = "";
        this.img = "https://png.pngtree.com/png-vector/20190330/ourmid/pngtree-mod-file-document-icon-png-image_897977.jpg";
    }
}
var Menu = {
    save: {
        region: 'eu',
        platform: 'VR',
        playerName: 'Player' + Math.floor(Math.random() * 100),
        playerLevel: 0,
    },
    showModal: false, // Assuming the modal is visible by default

    mods: [new Mod(),new Mod(),new Mod(),new Mod(),new Mod()],
    roomCount: "connecting...",
    StartGame: () => {
        console.log("StartGame");
        st.Vr.sessionStart(Menu.platform === 'VR' ? pc.XRTYPE_VR : pc.XRTYPE_AR);
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

