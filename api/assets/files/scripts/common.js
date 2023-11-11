

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
/** @return {pc.Entity}  */
pc.Entity.prototype.findFast = function (name) {
    for (var i = 0; i < this._children.length; i++) 
        if (this._children[i].name === name) return this._children[i];
    
    return null;
}

pc.Entity.prototype.getData = function () {
    const position = this.getLocalPosition();
    const rotation = this.getLocalRotation();
    return [position.x, position.y, position.z, rotation.x, rotation.y, rotation.z, rotation.w];
}
pc.Entity.prototype.setData = function (data) {
    this.setLocalPosition(data[0], data[1], data[2]);
    this.setLocalRotation(data[3], data[4], data[5], data[6]);
}


pc.Entity.prototype.setDataLerp = function (data, amount) {
    var currentPosition = this.getLocalPosition();
    var currentRotation = this.getLocalRotation();

    var newPosition = currentPosition.lerp (currentPosition, new pc.Vec3(data[0], data[1], data[2]), amount);
    var newRotation = currentRotation.slerp(currentRotation, new pc.Quat(data[3], data[4], data[5],data[6]), amount);
    
    this.setLocalPosition(newPosition);
    this.setLocalRotation(newRotation);
}
