//importScripts("https://launch.playcanvas.com/api/assets/files/scripts/bs.js?id=155145145&branchId=e0a7c654-a31b-4def-8047-2c11b1eface2")
if (globalThis.importScripts) bs = pc.ScriptType;

var Sword = class extends bs {
    InitArguments() {
        this.controllerTemplate = pc.Entity.prototype;
        this.dir = pc.Entity.prototype;
        this.debugPanel = pc.Entity.prototype;

    }
    swap(old) {
        this.DoSwap(old);
        this.initialize();
    };
    initialize() {
        /** @type {Life} */
        this.spark = this.entity.findByName("spark")?.particlesystem;
        this.slash = this.entity.findByName("slash")?.sound;




        if (this.entity.getComponentInParent(Player.scriptName)) {
            this.controllerTemplate.rigidbody.off('contact');
            this.controllerTemplate.rigidbody.on('contact', (/** @type {pc.ContactResult} */ result) => {
                //console.log(result);
                /*
                this.spark.entity.setPosition(result.contacts[0].point);
                this.spark.reset();
                this.spark.play();
                */
                let vel = this.controllerTemplate.rigidbody.linearVelocity.length() + this.controllerTemplate.rigidbody.angularVelocity.length()+result.other.rigidbody.linearVelocity.length() + result.other.rigidbody.angularVelocity.length();
                let impulse = pc.math.clamp(result.contacts[0].impulse/10*vel, 0, 1);
                this.entity.script.controller.inputSource.gamepad?.vibrationActuator?.playEffect("dual-rumble", { duration:  impulse, strongMagnitude: impulse, weakMagnitude:0});

                //if (!this.slash.isPlaying())this.slash.play(Utils.randomKey(this.slash.slots));
            });
        }


    }
 
    update() {
        if (!pc.app.xr.session) return;

        this.previousPosition = this.controllerTemplate.getPosition();
        this.currentPosition = this.dir.getPosition();
        var velocity = this.currentPosition.clone().sub(this.previousPosition).scale(30);
        this.controllerTemplate.rigidbody.linearVelocity = velocity //= pc.Vec3.ZERO;


        let previousRotation = this.controllerTemplate.getRotation();
        let currentRotation = this.dir.getRotation();
        var relativeRotation = currentRotation.clone().mul(previousRotation.invert());
        var angularVelocity = relativeRotation.getEulerAngles().scale(0.35);
        angularVelocity = Utils.clampMagnitude(angularVelocity, 30);
        this.controllerTemplate.rigidbody.angularVelocity = angularVelocity;



        let mass = (1 / (1 + velocity.length() + angularVelocity.length()));
        //mass = mass < .5 ? 5 : mass < .3 ? 3 : 100;
        //let fv = -this.controllerTemplate.up.dot(this.entity.parent.forward);
        //mass = pc.math.lerp(mass,1.1 - mass, fv)*1;
        //if(fv>.5)
        //mass = .1;

        //if (this.debugPanel) this.debugPanel.element.text = Math.round(mass*100).toString();

        if (this.controllerTemplate.rigidbody._mass != mass) {
            this.controllerTemplate.rigidbody._mass = mass;
            this.controllerTemplate.rigidbody.body.getCollisionShape().calculateLocalInertia(mass, this._ammoVec1);
            this.controllerTemplate.rigidbody.body.setMassProps(mass, this._ammoVec1);
        }
    }

    _ammoVec1 = new pc.Vec3();

};
pc.registerScript(Sword, 'Sword');

Sword.attributes.add('debugPanel', {
    type: 'entity',
});

Sword.attributes.add('controllerTemplate', {
    type: 'entity',
    title: 'Controller Template'
});

Sword.attributes.add('dir', {
    type: 'entity',
    title: 'dir'
});
