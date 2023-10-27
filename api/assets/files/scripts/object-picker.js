var ObjectPicker = pc.createScript('objectPicker');

ObjectPicker.prototype.initialize = function() {
    this.entities = this.app.root.findByTag('pickable');
    
    this.ray = new pc.Ray();
    this.vec3A = new pc.Vec3();
    this.vec3B = new pc.Vec3();
    
    this.app.on('object:pick', this.pick, this);
};

ObjectPicker.prototype.pick = function(controller) {
    var hovered = null;
    var distance = Infinity;
    
    this.ray.set(controller.inputSource.getOrigin(), controller.inputSource.getDirection());

    // iterate through each interactible entities
    for(var e = 0; e < this.entities.length; e++) {
        if (! this.entities[e].render)
            continue;

        // get mesh
        var mesh = this.entities[e].render.meshInstances[0];

        // check if it intersects with controllers ray
        if (mesh.aabb.intersectsRay(this.ray, this.vec3A)) {
            // check distance between ray origin and intersecting point
            var dist = this.vec3A.distance(this.ray.origin);
            if (dist < distance) {
                // if closer than previous candidate, remember it
                distance = dist;
                hovered = this.entities[e];
                this.vec3B.copy(this.vec3A);
            }
        }
    }

    if (hovered) {
        controller.fire('hover', hovered, this.vec3B);
    } else if (controller.hoverEntity) {
        controller.fire('blur');
    }
};