var CameraController = pc.createScript('camera-controller');


CameraController.attributes.add('height', {
    type: 'number',
    default: 1.6,
    placeholder: 'm',
    title: 'Height from Floor'
});

CameraController.attributes.add('movementSpeed', {
    type: 'number',
    default: 1.5,
    placeholder: 'm/s',
    title: 'Movement Speed'
});

CameraController.attributes.add('rotateSpeed', {
    type: 'number',
    default: 45,
    placeholder: '°',
    title: 'Rotation Speed'
});

CameraController.attributes.add('rotateThreshold', {
    type: 'number',
    default: 0.5,
    min: 0,
    max: 1,
    title: 'Rotation thumbstick threshold'
});

CameraController.attributes.add('rotateResetThreshold', {
    type: 'number',
    default: 0.25,
    min: 0,
    max: 1,
    title: 'Rotation thumbstick reset threshold'
});

CameraController.attributes.add('camera', {
    type: 'entity',
    title: 'Camera Entity'
});


// initialize code called once per entity
CameraController.prototype.initialize = function() {
    this.vec2A = new pc.Vec2();
    this.vec2B = new pc.Vec2();
    this.vec3A = new pc.Vec3();
    
    this.lastRotate = 0;
    this.lastRotateValue = 0;
    
    this.app.on('controller:teleport', this.onTeleport, this);
    this.app.on('controller:move', this.onMove, this);
    this.app.on('controller:rotate', this.onRotate, this);

    this.on('destroy', function() {
        this.app.off('controller:teleport', this.onTeleport, this);
        this.app.off('controller:move', this.onMove, this);
        this.app.off('controller:rotate', this.onRotate, this);
    }, this);
};

CameraController.prototype.onTeleport = function(position) {
    if (this.app.xr.type === pc.XRTYPE_AR)
        return;
    
    this.vec3A.copy(this.camera.getLocalPosition()).scale(-1);
    this.entity.setPosition(position);
    this.entity.translate(0, this.height, 0);
    this.entity.translateLocal(this.vec3A);
};

CameraController.prototype.onMove = function(x, y, dt) {
    this.vec2A.set(x, y);
    
    if (this.vec2A.length()) {
        this.vec2A.normalize();
        
        this.vec2B.x = this.camera.forward.x;
        this.vec2B.y = this.camera.forward.z;
        this.vec2B.normalize();
        
        var rad = Math.atan2(this.vec2B.x, this.vec2B.y) - (Math.PI / 2);
        
        var t =        this.vec2A.x * Math.sin(rad) - this.vec2A.y * Math.cos(rad);
        this.vec2A.y = this.vec2A.y * Math.sin(rad) + this.vec2A.x * Math.cos(rad);
        this.vec2A.x = t;
            
        this.vec2A.scale(this.movementSpeed);
        this.entity.translate(this.vec2A.x * dt, 0, this.vec2A.y * dt);
    }
};

CameraController.prototype.onRotate = function(yaw, dt) {
    var now = Date.now();
    
    if ((now - this.lastRotate) < 200)
        return;
    
    if (this.lastRotateValue !== 0) {
        if (this.lastRotateValue > 0) {
            if (yaw < this.rotateResetThreshold) {
                this.lastRotateValue = 0;
            } else {
                return;
            }
        } else {
            if (yaw > -this.rotateResetThreshold) {
                this.lastRotateValue = 0;
            } else {
                return;
            }
        }
    }
    
    if (Math.abs(yaw) > this.rotateThreshold) {
        this.lastRotateValue = Math.sign(yaw);
        
        this.vec3A.copy(this.camera.getLocalPosition());
        this.entity.translateLocal(this.vec3A);
        this.entity.rotateLocal(0, Math.sign(yaw) * this.rotateSpeed, 0);
        this.entity.translateLocal(this.vec3A.scale(-1));
    }
};