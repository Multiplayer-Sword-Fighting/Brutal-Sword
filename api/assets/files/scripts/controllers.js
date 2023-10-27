
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

class Controllers extends pc.ScriptType {
    Controllers(){
        this.controllerTemplate1 = pc.Entity.prototype;
        this.controllerTemplate2 = pc.Entity.prototype;
    }    

    initialize() {
        let i=1;
        this.app.xr.input.on('add', (inputSource) => {
            var entity = i==1?this.controllerTemplate1: this.controllerTemplate2;
            i=2;
            entity.script.controller.setInputSource(inputSource);
            entity.reparent(this.cameraParent);
            entity.enabled = true;
        });
    }
}
pc.registerScript(Controllers, 'controllers');
Controllers.attributes.add('controllerTemplate1', {
    type: 'entity',
    title: 'Controller Template'
});
Controllers.attributes.add('controllerTemplate2', {
    type: 'entity',
    title: 'Controller Template'
});


Controllers.attributes.add('cameraParent', {
    type: 'entity',
    title: 'Camera Parent'
});

