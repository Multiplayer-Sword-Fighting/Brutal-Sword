
if (globalThis.importScripts) bs = pc.ScriptType;


var Life = class extends bs {
    
    /** @type {Sword} */
    ControllerL = null;
    /** @type {Sword} */
    ControllerR = null;
    /** @type {bs} */
    Head = null;

    _life = 100;
    _killCount = 0;
    set life(life) {
        this._life = life;
        this.lifebar.setLocalScale(this._life / 100, 1, 1); // Scale lifebar
    }
    get life() {
        return this._life;
    }
    set killCount(killCount) {
        this._killCount = killCount;
        this.score.element.text = "Score: " + this._killCount;
    }
    get killCount() {
        return this._killCount;
    }

    InitArguments() {
        this.collider = pc.Entity.prototype;
        this.lifebar = pc.Entity.prototype;
        this.score = pc.Entity.prototype;
          /** @type {pc.Entity[]} */
        this.sync = [];
        this.syncLerp = [];
    }

    initialize() {
        this.entity.setPosition(0, 0, 0);
        //this.Head.entity.reparent(this.entity.parent);
        //this.ControllerL.entity.reparent(this.entity.parent);
        //this.ControllerR.entity.reparent(this.entity.parent);
        
        this.blood = this.entity.findByName("blood")?.particlesystem;
        this.collider.collision.off('triggerenter');
        this.collider.collision.on('triggerenter', this.onTriggerEnter.bind(this));
        this.resetLife();
        
    }
    swap(old) {
        this.DoSwap(old);
        this.initialize();
    }
    update() 
    {
        st.CameraController.entity.translate(this.tran);
        //st.Vr.level.entity.translate(this.tran.scale(-1));
        this.tran.scale(0.9);
    }
    tran = new pc.Vec3();
    onTriggerEnter(/** @type {pc.Entity} */ sword) {
        if (!pc.app.xr.session) return;
        if(Date.now()-gameStartTime<1000)
            return;
        let enemy = sword.getComponentInParent(Life.scriptName)
        let me = this.entity.script.Life;
        if (enemy == me || !enemy) return;

        this.blood.entity.setPosition(this.entity.getPosition());
        this.blood.reset();
        this.blood.play();

        let damage = sword.rigidbody.linearVelocity.length() + sword.rigidbody.angularVelocity.length();
        this.life -= damage; // Subtract life

        
        if (this.entity.script.player) {
            this.entity.script.player.controllers.forEach(function (controller) { controller.inputSource.gamepad?.vibrationActuator?.playEffect("dual-rumble", { duration: 50, strongMagnitude: 1, weakMagnitude: 1 }); });
            
        }
        else {
            sword.getComponentInParent(Controller.scriptName)?.inputSource?.gamepad?.vibrationActuator?.playEffect("dual-rumble", { duration: 50, strongMagnitude: 1, weakMagnitude: 1 });
            this.tran = enemy.entity.forward.clone()
            this.tran.y = 0;
            this.tran.scale(0.003*damage*(this.entity.script.player?1:-1));
        }

        if (this.life <= 0) {
            this.resetLife();
            enemy.killCount++;
        }
        /*
        let dispatcher = pc.app.systems.rigidbody.dynamicsWorld.getDispatcher();
        const manifold = dispatcher.getManifoldByIndexInternal(0);
        const btContactPoint = manifold.getContactPoint(0);
        const contactPoint = this._createContactPointFromAmmo(btContactPoint);
        this._createSingleContactResult(e0, e1, contactPoint);
        */
    }
    resetLife() {
        Types.Life.forEach(function (component) {
            component.life = 100; // Reset life to 100
        });
    }


}

pc.registerScript(Life, 'Life');
Life.attributes.add('collider', { type: 'entity' });
Life.attributes.add('lifebar', { type: 'entity' });
Life.attributes.add('score', { type: 'entity' });

Life.attributes.add('sync', {
    type: 'entity',
    array: true,
});
