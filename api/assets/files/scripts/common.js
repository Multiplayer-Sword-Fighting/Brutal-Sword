


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