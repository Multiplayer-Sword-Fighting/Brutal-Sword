if (globalThis.importScripts) bs = pc.ScriptType;


var Life = class extends bs {
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
        lifeList.push(this);
        this.collider.collision.on('triggerenter', this.onTriggerEnter.bind(this));
        this.resetLife();
    }
    onTriggerEnter(/** @type {pc.Entity} */ sword) {
        if (!pc.app.xr.session) return;
        let enemy = sword.getComponentInParent(Life.scriptName) 
        let me = this.entity.script.Life;
        if (enemy == me|| !enemy) return;
        //if(!this.entity.script.player) return
        let damage = sword.rigidbody.linearVelocity.length()+sword.rigidbody.angularVelocity.length();
        this.life -= damage; // Subtract life
        let tran = enemy.entity.forward.clone()
        tran.y = 0;
        //this.entity.parent.translate(tran.scale(damage/50));
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
        var lifeComponents = lifeList; // Find all life components

        for (var i = 0; i < lifeComponents.length; i++) {
            lifeComponents[i].life = 100; // Reset life to 100
        }
    }
    swap(old) {
        this.DoSwap(old);
    };

}

pc.registerScript(Life, 'Life');
Life.attributes.add('collider', { type: 'entity' });
Life.attributes.add('lifebar', { type: 'entity' });
Life.attributes.add('score', { type: 'entity' });