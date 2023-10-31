
var FIXED_DELTA_TIME = 120; // approximately 0.01667 seconds
if (globalThis.importScripts) bs = pc.ScriptType;


var Player = class extends bs {

    Controllers() {

        this.controllerTemplate1 = pc.Entity.prototype;
        this.controllerTemplate2 = pc.Entity.prototype;
        this.collider = pc.Entity.prototype;
        this.head = pc.Entity.prototype;

    }
    update() {
        if (!pc.app.xr.session) return;


        // Get the positions of the controllers
        var leftPos = this.controllerTemplate1.getPosition();
        var rightPos = this.controllerTemplate2.getPosition();

        // Calculate rotation based on the two positions
        var direction = new pc.Vec3();
        direction.sub2(rightPos, leftPos);
        var angle = Math.atan2(direction.z, direction.x);
        var euler = new pc.Vec3(0, -pc.math.RAD_TO_DEG * angle, 0);  // Convert to Euler angles in degrees

        // Set the rotation and position of the player entity

        this.entity.setEulerAngles(euler);
        this.entity.setRotation(new pc.Quat().slerp(pc.app.xr.camera.getRotation(), this.entity.getRotation(), 0.5))
        this.entity.setPosition(pc.app.xr.camera.getPosition());
        if (this.head) {
            this.head.setRotation(pc.app.xr.camera.getRotation());
        }
        

    }
    initialize() {
        this.app.xr.input.on('add', (/** @type {pc.XrInputSource} */ inputSource) => {
            
            var entity = (inputSource.handedness == '' ? inputSource.id == 2 : inputSource.handedness == pc.XRHAND_LEFT) ? this.controllerTemplate1 : this.controllerTemplate2;
            entity.script.controller.setInputSource(inputSource);
            //entity.reparent(this.cameraParent); 
            entity.enabled = true;
        });
        pc.app.systems.rigidbody.fixedTimeStep = 1 / FIXED_DELTA_TIME;

    }

    swap(old) {
        this.DoSwap(old);
    };

}
pc.registerScript(Player, 'player');

Player.attributes.add('collider', { type: 'entity' });
Player.attributes.add('controllerTemplate1', { type: 'entity' });
Player.attributes.add('controllerTemplate2', { type: 'entity', });
Player.attributes.add('head', { type: 'entity' });
