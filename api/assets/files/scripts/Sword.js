
//importScripts("https://launch.playcanvas.com/api/assets/files/scripts/bs.js?id=155145145&branchId=e0a7c654-a31b-4def-8047-2c11b1eface2")
if (globalThis.importScripts) bs = pc.ScriptType;

var Sword = class extends bs {
    InitArguments() {
        this.debugPanel = pc.Entity.prototype;
        this.shield = false;

    }
    swap(old) {
        this.DoSwap(old);
        this.initialize();
    };
    /** @type {pc.RigidBodyComponent} */
    rigidbody = null;

    initialize() {
        /** @type {Life} */
        this.spark = this.entity.findFast("spark")?.particlesystem;
        this.slash = this.entity.findFast("slash")?.sound;
        this.dir =this.rigidbody.entity.parent;



        if (this.entity.getComponentInParent(Player.scriptName)) {
            this.rigidbody.off('contact');
            this.rigidbody.on('contact', (/** @type {pc.ContactResult} */ result) => {
                //console.log(result);
                /*
                this.spark.entity.setPosition(result.contacts[0].point);
                this.spark.reset();
                this.spark.play();
                */
                let vel = this.rigidbody.linearVelocity.length() + this.rigidbody.angularVelocity.length() + result.other.rigidbody.linearVelocity.length() + result.other.rigidbody.angularVelocity.length();
                let impulse = pc.math.clamp(result.contacts[0].impulse / 10 * vel, 0, 1);
                this.entity.script.controller.inputSource.gamepad?.vibrationActuator?.playEffect("dual-rumble", { duration: impulse, strongMagnitude: impulse, weakMagnitude: 0 });                
                
                //if (!this.slash.isPlaying())this.slash.play(Utils.randomKey(this.slash.slots));
            });
        }
        this.originalMass = this.rigidbody.mass

    }


    update() {
        if (!pc.app.xr.session) return;
        

        this.previousPosition = this.rigidbody.entity.getPosition();
        this.currentPosition = this.dir.getPosition();
        var velocity = this.currentPosition.clone().sub(this.previousPosition).scale(this.shield?10:30);
        this.rigidbody.linearVelocity = velocity //= pc.Vec3.ZERO;

        let previousRotation = this.rigidbody.entity.getRotation();
        let currentRotation = this.dir.getRotation();
        var relativeRotation = currentRotation.clone().mul(previousRotation.invert());
        let euler = relativeRotation.getEulerAngles();
        var angularVelocity = euler.scale(this.shield?0.05:0.35);
        angularVelocity = Utils.clampMagnitude(angularVelocity, 30);

        this.rigidbody.angularVelocity = angularVelocity;


        //if (!this.shield) 
        {
            let mass = (this.originalMass  / (1 + velocity.length() + angularVelocity.length()));
            mass = this.shield?0.1: (mass * mass) // < .1 ? 3 : 100;
            //let fv = -this.rigidbody.entity.up.dot(this.entity.parent.forward);
            //mass = pc.math.lerp(mass,1.1 - mass, fv)*1;
            //if(fv>.5)
            //mass = .1;

            //if (this.debugPanel) this.debugPanel.element.text = Math.round(mass*100).toString();

            if (this.rigidbody._mass != mass) {
                this.rigidbody._mass = mass;
                this.rigidbody.body.getCollisionShape().calculateLocalInertia(mass, this._ammoVec1);
                
                this.rigidbody.body.setMassProps(mass,pc.Vec3.LEFT);
            }
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
Sword.attributes.add('shield', {
    type: 'boolean',
});
