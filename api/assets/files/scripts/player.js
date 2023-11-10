
if (globalThis.importScripts) bs = pc.ScriptType; 


var Player = class extends bs {
    /** @type {Controller} */
    ControllerR=null
    /** @type {Controller} */
    ControllerL= null
    /** @type {Entity} */
    body = null;

    Awake() {
        this.app.xr.input.on('add', (/** @type {pc.XrInputSource} */ inputSource) => {
            /** @type {Controller} */
            var controller = ((inputSource.handedness == '' ? inputSource.id == 2 : inputSource.handedness == pc.XRHAND_LEFT) ? this.ControllerL : this.ControllerR);
            controller.setInputSource(inputSource);
            //entity.reparent(this.cameraParent); 
            controller.enabled = true;            
        });
    }
    initialize() {        
        this.body = this.entity.findByName("body");
        this.controllers = [this.ControllerL, this.ControllerR];
        pc.app.systems.rigidbody.fixedTimeStep = 1 / 220;
    }
    
    InitArguments() {
        
        this.head = pc.Entity.prototype;
    }
    update() {
        if (!pc.app.xr.session) return;


        // Get the positions of the controllers
        var leftPos = this.ControllerL.entity.getPosition();
        var rightPos = this.ControllerR.entity.getPosition();

        // Calculate rotation based on the two positions
        var direction = new pc.Vec3(); 
        direction.sub2(rightPos, leftPos);
        var angle = Math.atan2(direction.z, direction.x);
        var euler = new pc.Vec3(0, -pc.math.RAD_TO_DEG * angle, 0);  // Convert to Euler angles in degrees

        // Set the rotation and position of the player entity

        this.body.setEulerAngles(euler);
        this.body.setRotation(new pc.Quat().slerp(pc.app.xr.camera.getRotation(), this.body.getRotation(), 0.5))
        this.body.setPosition(pc.app.xr.camera.getPosition());
        this.head.setRotation(pc.app.xr.camera.getRotation());


    }
    

    swap(old) {
        this.DoSwap(old);
    };

}
pc.registerScript(Player, 'player');

Player.attributes.add('head', { type: 'entity' });
