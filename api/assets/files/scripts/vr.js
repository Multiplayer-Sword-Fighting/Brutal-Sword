if (globalThis.importScripts) bs = pc.ScriptType;


 var Vr = class extends bs {
    /** @type {bs} */
    buttonAr = null;
    /** @type {bs} */
    level = null;
    /** @type {bs} */
    menuGraphic = null;

    InitArgs() {
        this.html = pc.Asset.prototype; 
    }
    initialize() {

        this.app.keyboard.on('keydown', evt => {
            if (evt.key === pc.KEY_ESCAPE && this.app.xr.active) this.app.xr.end();
        });

        this.app.xr.on('start', () => setTimeout(() => { this.onStart(); st.Vr.menuGraphic.entity.enabled = false; }, 0), this);
        this.app.xr.on('end', () => { 
            st.Vr.menuGraphic.entity.enabled = true; 
            window.location.reload();
        }, this);
        
        this.app.xr.on('error', ex => console.error(ex));
        this.InitHtml();
        InitVue();
    }
    swap(old) {
        this.DoSwap(old); 
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


    sessionStart(roomName) {
        st.Multiplayer.roomName = roomName
        let type = Menu.save.platform === 'VR' ? pc.XRTYPE_VR : pc.XRTYPE_AR;
        if (!this.app.xr.supported || this.app.xr.active || !this.app.xr.isAvailable(type)) {
            alert('VR device not found');
            return;
        }
        if (window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission) {
            DeviceOrientationEvent.requestPermission().then(response => {
                if (response == 'granted') {
                    window.addEventListener('deviceorientation', () => this.cameraEntity.camera.startXr(type, pc.XRSPACE_LOCAL));
                }
            }).catch(console.error);
        } else {
            pc.app.xr.start(this.cameraEntity.camera, type, pc.XRSPACE_LOCAL, { planeDetection: false })
        }
    }
    update(dt) {
        if(this.app.xr.active) return;
        const time = Date.now() * 0.00001; // Convert milliseconds to seconds
        const position = new pc.Vec3(0, 2, 0);
        const rotation = this.cameraEntity.getRotation();
        const distance = 3;
        const x = position.x + distance * Math.cos(time);
        const z = position.z + distance * Math.sin(time);
        this.cameraEntity.setPosition(x, position.y-2, z);
        this.cameraEntity.lookAt(position);
    }

    onStart() {
        gameStartTime = Date.now();
        st.Multiplayer.Start();
        vue.$off();
        vue.$destroy();
    }
}

pc.registerScript(Vr, 'vr');

Vr.attributes.add('cameraEntity', { type: 'entity', title: 'Camera' });
Vr.attributes.add('css', { type: 'asset', assetType: 'css', title: 'CSS Asset' });
Vr.attributes.add('html', { type: 'asset', assetType: 'html', title: 'HTML Asset' });
try { XRSession.prototype.enabledFeatures = XRSession.prototype.enabledFeatures || []; } catch { }