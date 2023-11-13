

/*
//fetch tailwind css
fetch('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css')
    .then(response => response.text())
    .then(data => {
        var style = document.createElement('style');
        document.head.appendChild(style);
        style.innerHTML = data;
    });
*/


var Menu = {
    region: 'eu',
    platform: 'VR',
    playerName: 'Player' + Math.floor(Math.random() * 100),
    playerLevel: 0,
    roomCount: "connecting...",
    StartGame: () => {
        console.log("StartGame");
        st.Vr.sessionStart(Menu.platform === 'VR' ? pc.XRTYPE_VR : pc.XRTYPE_AR);
    },

}
function SaveSettings() {
    localStorage.setItem('Menu', JSON.stringify(Menu));
}
Object.assign(Menu, JSON.parse(localStorage.getItem('Menu') || '{}'));

document.addEventListener('visibilitychange', SaveSettings);
window.onbeforeunload = function () {
    SaveSettings();

};
function InitVue() {

    new Vue({
        el: '#app',
        data: Menu,
        watch: {
            region: function (newRegion, oldRegion) {
                photonNetwork.disconnect();
                photonNetwork.connectToRegionMaster(newRegion);
            }, playerName: function (newName, oldName) {
                photonNetwork.myActor().setName(newName);
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', InitVue);

