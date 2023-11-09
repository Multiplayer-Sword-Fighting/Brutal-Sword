

class Utils {
    static clampMagnitude(vec3, maxMagnitude) {
        var currentMagnitude = vec3.length();

        if (currentMagnitude > maxMagnitude) {
            vec3.scale(maxMagnitude / currentMagnitude);
        }
        return vec3;
    };
    static randomKey(_this) {
        return Object.keys(_this)[Math.floor(Math.random() * Object.keys(_this).length)];
    }
}

pc.ScriptComponent.prototype = pc.ScriptComponent.prototype
/** @type {Player} */
pc.ScriptComponent.prototype.player 
/** @type {Controller} */
pc.ScriptComponent.prototype.controller 
/** @type {Life} */
pc.ScriptComponent.prototype.Life
/** @type {Sword} */
pc.ScriptComponent.prototype.Sword

pc.CollisionComponent.prototype = pc.CollisionComponent.prototype
Object.defineProperty(pc.CollisionComponent.prototype, 'onTriggerEnter', {
    set: function (callback) {
        this._onTriggerEnter = callback;
        this.on('triggerenter', this._onTriggerEnter, this);
    },
    /** @return {function(pc.Entity):void}  */
    get: function () {
        return this._onTriggerEnter;
    }
});
pc.Entity.prototype = pc.Entity.prototype
/** @return {pc.ScriptType}  */
pc.Entity.prototype.getComponentInParent = function (componentName) {
    let exist = this[componentName + "InParent"];
    if (exist) return exist;

    var parent = this.getParent();
    while (parent) {
        var component = parent.script?.[componentName]
        if (component) {
            return this[componentName + "InParent"] = component;
        }
        parent = parent.getParent();
    }
    return null;
};


pc.Entity.prototype.getData = function () {
    const position = this.getPosition();
    const rotation = this.getEulerAngles();
    return [position.x, position.y, position.z, rotation.x, rotation.y, rotation.z]; 
}
pc.Entity.prototype.setData = function (data) {
    this.setPosition(data[0], data[1], data[2]);
    this.setEulerAngles(data[3], data[4], data[5]);
}