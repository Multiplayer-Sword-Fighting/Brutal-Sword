if (globalThis.importScripts) bs = pc.ScriptType;


class Vr extends bs {
    /** @type {bs} */
    buttonAr = null;
    /** @type {bs} */
    level = null;

    InitArgs() {
        this.buttonVr = pc.Entity.prototype;
        this.html = pc.Asset.prototype;
    }
    initialize() {

        this.buttonVr.element.text = "Loading...";
        this.buttonVr.element.fontSize = 30;
        this.buttonVr.element.on('click', () => this.sessionStart());
        this.buttonAr.entity.element.on('click', () => this.sessionStart(pc.XRTYPE_AR));
        this.app.keyboard.on('keydown', evt => {
            if (evt.key === pc.KEY_ESCAPE && this.app.xr.active) this.app.xr.end();
        });

        this.checkButton(false);
        this.setEvents();

        this.InitMenu();
        InitVue();
    }
    InitMenu(){
    

        this.div = document.createElement('div');
        this.div.classList.add('container2');
        this.div.innerHTML = this.html.resource || '';
        document.body.appendChild(this.div);
    
        var style = document.createElement('style');
        document.head.appendChild(style);
        style.innerHTML = this.css.resource || '';
    
        
    }

    setEvents() {
        this.app.xr.on('available:' + pc.XRTYPE_AR, this.onAvailable, this);
        this.app.xr.on('start', this.onStart, this);
        this.app.xr.on('end', this.onEnd, this);
        this.app.xr.on('error', ex => console.error(ex));
    }

    checkButton(enteringVr) {
        if (this.app.xr.supported) {
            this.elementHttpsRequired.enabled = this.elementUnsupported.enabled = false;
            this.buttonVr.enabled = !enteringVr;
            gameStartTime = Date.now();
            if (!enteringVr) {
                let available = this.app.xr && !this.app.xr.active && this.app.xr.isAvailable(pc.XRTYPE_AR);
                this.buttonVr.element.opacity = available ? 0.2 : 0.1;
                this.buttonVr.children[0].element.opacity = available ? 1.0 : 0.2;
            }
        } else {
            this.buttonVr.enabled = false;
            this.elementUnsupported.enabled = window.location.protocol == "https:";
            this.elementHttpsRequired.enabled = !this.elementUnsupported.enabled;
        }
    }

    sessionStart(type = pc.XRTYPE_VR) {
        this.buttonAr.entity.enabled = false;
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

    onAvailable() { this.checkButton(false); }
    onStart() {
        this.checkButton(true);
        st.Multiplayer.Start();
        pc.app.xr.session.addEventListener('visibilitychange', VisChange);

    }
    onEnd() { this.checkButton(false); }
}



pc.registerScript(Vr, 'vr');

Vr.attributes.add('buttonVr', { type: 'entity', title: 'VR Button' });
Vr.attributes.add('elementUnsupported', { type: 'entity', title: 'Unsupported Message' });
Vr.attributes.add('elementHttpsRequired', { type: 'entity', title: 'HTTPS Required Message' });
Vr.attributes.add('cameraEntity', { type: 'entity', title: 'Camera' });
Vr.attributes.add('css', { type: 'asset', assetType: 'css', title: 'CSS Asset' });
Vr.attributes.add('html', { type: 'asset', assetType: 'html', title: 'HTML Asset' });
