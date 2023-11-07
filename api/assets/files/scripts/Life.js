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

    }

    initialize() {
        this.blood = this.entity.findByName("blood")?.particlesystem;
        this.collider.collision.off('triggerenter');
        this.collider.collision.on('triggerenter', this.onTriggerEnter.bind(this));
        this.resetLife();
        
    }
    swap(old) {
        this.DoSwap(old);
        this.initialize();
    }
    update() {
        this.entity.parent.translate(this.tran);
        this.tran.scale(0.9);
    }
    tran = new pc.Vec3();
    onTriggerEnter(/** @type {pc.Entity} */ sword) {
        if (!pc.app.xr.session) return;
        let enemy = sword.getComponentInParent(Life.scriptName)
        let me = this.entity.script.Life;
        if (enemy == me || !enemy) return;

        this.blood.entity.setPosition(this.entity.getPosition());
        this.blood.reset();
        this.blood.play();

        let damage = sword.rigidbody.linearVelocity.length() + sword.rigidbody.angularVelocity.length();
        this.life -= damage; // Subtract life
        this.tran = enemy.entity.forward.clone()

        this.tran.y = 0;

        if (this.entity.script.player) {
            //this.tran.scale(damage/300);
            this.entity.script.player.controllers.forEach(function (controller) { controller.inputSource.gamepad?.vibrationActuator?.playEffect("dual-rumble", { duration: 50, strongMagnitude: 1, weakMagnitude: 1 }); });
            enemy.entity.parent.translate(this.tran.scale(-damage / 50));
            this.tran.set(0, 0, 0);
        }
        else {
            this.tran.scale(damage / 300);
            sword.getComponentInParent(Controller.scriptName)?.inputSource?.gamepad?.vibrationActuator?.playEffect("dual-rumble", { duration: 50, strongMagnitude: 1, weakMagnitude: 1 });
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