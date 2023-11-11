/*



this.div = document.createElement('div');
this.div.classList.add('container2');
this.div.innerHTML = this.html.resource || '';
document.body.appendChild(this.div);

var style = document.createElement('style');
document.head.appendChild(style);
style.innerHTML = this.css.resource || '';

//fetch tailwind css
fetch('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css')
    .then(response => response.text())
    .then(data => {
        var style = document.createElement('style');
        document.head.appendChild(style);
        style.innerHTML = data;
    });

Menu ={
    region: 'eu',
    platform: 'vr',
    StartGame: () => {
        console.log("StartGame");
        st.Multiplayer.Start();
    }

}
new Vue({
    el: '#app',
    data: Menu,    
});



*/