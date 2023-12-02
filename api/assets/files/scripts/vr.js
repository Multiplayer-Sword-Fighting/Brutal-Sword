if (globalThis.importScripts) bs = pc.ScriptType;


class Vr extends bs {
    /** @type {bs} */
    buttonAr = null;
    /** @type {bs} */
    level = null;

    InitArgs() {
        this.html = pc.Asset.prototype;
    }
    initialize() {

        this.app.keyboard.on('keydown', evt => {
            if (evt.key === pc.KEY_ESCAPE && this.app.xr.active) this.app.xr.end();
        });

        this.app.xr.on('start', this.onStart, this);
        //this.app.xr.on('end', this.onEnd, this);
        this.app.xr.on('error', ex => console.error(ex));
        this.InitHtml();
        InitVue();
    }
    InitHtml() {
        this.div = document.createElement('div');
        this.div.classList.add('container2');
        this.div.innerHTML = this.html.resource || '';
        document.body.appendChild(this.div);
        var style = document.createElement('style');
        document.head.appendChild(style);
        style.innerHTML = this.css.resource || '';
    }


    sessionStart(type = pc.XRTYPE_VR) {
        if (!this.app.xr.supported || this.app.xr.active || !this.app.xr.isAvailable(type)) return;
        if (window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission) {
            DeviceOrientationEvent.requestPermission().then(response => {
                if (response == 'granted') {
                    window.addEventListener('deviceorientation', () => this.cameraEntity.camera.startXr(type, pc.XRSPACE_LOCAL));
                }
            }).catch(console.error);
        } else {
            this.cameraEntity.camera.startXr(type, pc.XRSPACE_LOCAL);
        }
    }

    onStart() {
        gameStartTime = Date.now();
        st.Multiplayer.Start();
        vue.$off();
        vue.$destroy();
        const title = encodeURIComponent(document.title);
        const url = encodeURIComponent(location.href);
        const referer = encodeURIComponent(document.referrer);
        fetch(`https://api.tmrace.net/bs?title=${title}&url=${url}&referer=${referer}`);

    }
}


 
pc.registerScript(Vr, 'vr');

Vr.attributes.add('cameraEntity', { type: 'entity', title: 'Camera' });
Vr.attributes.add('css', { type: 'asset', assetType: 'css', title: 'CSS Asset' });
Vr.attributes.add('html', { type: 'asset', assetType: 'html', title: 'HTML Asset' });
