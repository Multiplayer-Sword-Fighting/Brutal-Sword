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
    };
    Sword() {
    }
    postInitialize() {
        //this.controllerTemplate.reparent(pc.app.root);
        // get mini-stats
        //const miniStats = new pcx.MiniStats(pc.app);
        //if (this.debugPanel) this.debugPanel.element.text = miniStats.stats.drawCalls.total;

    }
    update() {
        if (!pc.app.xr.session) return;
        //  this.controllerTemplate.rigidbody.disableSimulation()            
        //  this.controllerTemplate.setPosition(this.entity.getPosition());
        //this.controllerTemplate.setRotation(this.entity.getRotation());
        // this.controllerTemplate.rigidbody.enableSimulation()
        // Store the previous position
        this.previousPosition = this.controllerTemplate.getPosition();
        this.currentPosition = this.dir.getPosition();
        var velocity = this.currentPosition.clone().sub(this.previousPosition).scale(30);
        this.controllerTemplate.rigidbody.linearVelocity = velocity //= pc.Vec3.ZERO;


        let previousRotation = this.controllerTemplate.getRotation();
        let currentRotation = this.dir.getRotation();
        var relativeRotation = currentRotation.clone().mul(previousRotation.invert());
        var angularVelocity = relativeRotation.getEulerAngles().scale(0.35);
        clampMagnitude(angularVelocity, 10); 
        this.controllerTemplate.rigidbody.angularVelocity = angularVelocity;

        //let angle = relativeRotation.getAxisAngle(this.controllerTemplate.forward);
        //angularVelocity = new pc.Quat().setFromEulerAngles(angularVelocity).setFromAxisAngle(this.controllerTemplate.forward,angle).getEulerAngles();
        //pc.app.systems.rigidbody.dynamicsWorld.stepSimulation(0.001);
        // Set the angular velocity

        //let rad = 5 / (5 + velocity.length() + angularVelocity.length());
        //this.controllerTemplate.rigidbody.mass = 
        //let 
        
        
         
        
        let mass = (1 / (1+ velocity.length()+angularVelocity.length()));
        //mass = mass < .5 ? 5 : mass < .3 ? 3 : 100;;

        //let fv = -this.controllerTemplate.up.dot(this.entity.parent.forward);
        //mass = pc.math.lerp(mass,1.1 - mass, fv)*1;
        //if(fv>.5)
        //mass = .1;

        if (this.debugPanel) 
            this.debugPanel.element.text = Math.round(mass*100).toString();

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
