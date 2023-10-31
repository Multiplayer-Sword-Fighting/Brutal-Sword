
var clampMagnitude = function (vec3, maxMagnitude) {
    var currentMagnitude = vec3.length();

    if (currentMagnitude > maxMagnitude) {
        vec3.scale(maxMagnitude / currentMagnitude);
    }    
    return vec3;
};

function clampQuatByAngle(quaternion, maxAngle) {
    var halfAngle = Math.acos(quaternion.w) * 2; // Calculate the angle of the quaternion

    if (halfAngle > maxAngle) {
        var scaleFactor = maxAngle / halfAngle;
        quaternion.x *= scaleFactor;
        quaternion.y *= scaleFactor;
        quaternion.z *= scaleFactor;
        quaternion.w *= scaleFactor;
    }

    return quaternion;
}

pc.CollisionComponent.prototype =pc.CollisionComponent.prototype
Object.defineProperty(pc.CollisionComponent.prototype, 'onTriggerEnter', {
    set: function(callback) {
        this._onTriggerEnter = callback;
        this.on('triggerenter', this._onTriggerEnter, this);
    },
    /** @return {function(pc.Entity):void}  */
    get: function() {
        return this._onTriggerEnter;
    }
});
pc.Entity.prototype=pc.Entity.prototype
/** @return {pc.ScriptType}  */
pc.Entity.prototype.getComponentInParent = function(componentName) {
    let exist = this[componentName+"InParent"];
    if(exist) return exist;

    var parent = this.getParent();
    while (parent) {
        var component = parent.script?.[componentName]
        if (component) {
            return this[componentName+"InParent"]= component;
        }
        parent = parent.getParent();
    }
    return null;
};