
class Vr extends pc.ScriptType {


    initialize() {
        this.buttonVr.element.on('click', () => this.sessionStart());
        this.app.keyboard.on('keydown', evt => {
            if (evt.key === pc.KEY_ESCAPE && this.app.xr.active) this.app.xr.end();
        });
        this.checkButton(false);
        this.setEvents('on');
        this.on('destroy', () => this.setEvents('off'));
    }

    setEvents(offOn) {
        this.app.xr[offOn]('available:' + pc.XRTYPE_VR, this.onAvailable, this);
        this.app.xr[offOn]('start', this.onStart, this);
        this.app.xr[offOn]('end', this.onEnd, this);
    }

    checkButton(enteringVr) {
        if (this.app.xr.supported) {
            this.elementHttpsRequired.enabled = this.elementUnsupported.enabled = false;
            this.buttonVr.enabled = !enteringVr;
            if (!enteringVr) {
                let available = this.app.xr && !this.app.xr.active && this.app.xr.isAvailable(pc.XRTYPE_VR);
                this.buttonVr.element.opacity = available ? 0.2 : 0.1;
                this.buttonVr.children[0].element.opacity = available ? 1.0 : 0.2;
            }
        } else {
            this.buttonVr.enabled = false;
            this.elementUnsupported.enabled = window.location.protocol == "https:";
            this.elementHttpsRequired.enabled = !this.elementUnsupported.enabled;
        }
    }

    sessionStart() {
        if (!this.app.xr.supported || this.app.xr.active || !this.app.xr.isAvailable(pc.XRTYPE_VR)) return;
        if (window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission) {
            DeviceOrientationEvent.requestPermission().then(response => {
                if (response == 'granted') {
                    window.addEventListener('deviceorientation', () => this.cameraEntity.camera.startXr(pc.XRTYPE_VR, pc.XRSPACE_LOCAL));
                }
            }).catch(console.error);
        } else {
            this.cameraEntity.camera.startXr(pc.XRTYPE_VR, pc.XRSPACE_LOCAL);
        }
    }

    onAvailable() { this.checkButton(false); }
    onStart() { this.checkButton(true); }
    onEnd() { this.checkButton(false); }
}
Vr.attributes.add('buttonVr', { type: 'entity', title: 'VR Button' });
Vr.attributes.add('elementUnsupported', { type: 'entity', title: 'Unsupported Message' });
Vr.attributes.add('elementHttpsRequired', { type: 'entity', title: 'HTTPS Required Message' });
Vr.attributes.add('cameraEntity', { type: 'entity', title: 'Camera' });


pc.registerScript(Vr, 'vr');