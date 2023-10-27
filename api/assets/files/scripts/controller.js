

var Controller = class extends pc.ScriptType {
    modelEntity = null;
    Controller() {
    Vec3.prototype.add
        this.controllerTemplate = pc.Entity.prototype;
        this.dir = pc.Entity.prototype;
    }
    postInitialize() {
        console.log("PostInitialize");
        this.controllerTemplate.reparent(pc.app.root);
    }
    initialize() {


        
            this.entity.enabled = false;
    

        this.vecA = new pc.Vec3();
        this.vecB = new pc.Vec3();
        this.matA = new pc.Mat4();
        this.quat = new pc.Quat();
        this.color = new pc.Color(1, 1, 1);

        this.modelEntity = this.entity.findByName('model');
        this.hoverEntity = null;

        this.targetPointerSize = 2;
        this.targetTeleportable = false;
        this.pointer = this.entity.findByName('pointer');

        // Create a clone on the UI material that doesn't depth test
        var pointerElement = this.pointer.element;
        var pointerMaterial = pointerElement.material.clone();
        pointerElement.material = pointerMaterial;
        pointerMaterial.depthTest = false;
        pointerElement.material = pointerMaterial;

        // Dirty the element to reapply values to parameters to the renderable mesh
        var tempColor = pointerElement.color.clone();
        pointerElement.color = new pc.Color(tempColor.r, tempColor.g + 0.01, tempColor.b);
        pointerElement.color = tempColor;

        var tempOpacity = pointerElement.opacity;
        pointerElement.opacity = 0;
        pointerElement.opacity = tempOpacity;

        pointerMaterial.update();

        this.hoverPoint = new pc.Vec3();
        this.pointerDistance = 3;

        this.on('destroy', function () {
            pointerElement.material = null;
            pointerMaterial.destroy();
        }, this);
    }
    //inputSourceIndex=0;
    //get inputSource(){ return pc.app.xr.input.inputSources[this.inputSourceIndex]; }
    //set inputSource(value){  this.inputSourceIndex = pc.app.xr.input.inputSources.indexOf(value)}
    setInputSource(inputSource) {
        this.inputSource = inputSource;
        inputSource.once('remove', this.onRemove.bind(this));

        this.on('hover', this.onHover.bind(this));
        this.on('blur', this.onBlur.bind(this));

        inputSource.on('select', this.onSelect.bind(this));
    }

    onRemove() { 
        this.entity.destroy();
    }

    onSelect() {
        this.app.fire('object:pick', this);

        if (this.hoverEntity) {
            // teleport
            if (this.targetTeleportable) {
                this.app.fire('controller:teleport', this.hoverPoint);

                // paint interactible model
            } else if (this.hoverEntity.tags.has('interactive')) {
                var mesh = this.hoverEntity.render.meshInstances[0];
                if (!mesh.pickedColor) mesh.pickedColor = new pc.Color();

                mesh.pickedColor.set(Math.random(), Math.random(), Math.random());
                mesh.setParameter('material_diffuse', mesh.pickedColor.data3);
            }
        }
    }

    onHover(entity, point) {
        this.hoverEntity = entity;
        this.hoverPoint.copy(point);
        this.targetPointerSize = 16;
        this.targetTeleportable = this.hoverEntity.tags.has('teleportable');
    }

    onBlur() {
        this.hoverEntity = null;
        this.targetPointerSize = 4;
        this.targetTeleportable = false;
    }

    update(dt) {
      
            const FIXED_DELTA_TIME = 90; // approximately 0.01667 seconds
            pc.app.systems.rigidbody.fixedTimeStep =  1 /  FIXED_DELTA_TIME;

            // pick entities
            this.app.fire('object:pick', this);

            // is can be gripped, enable model and transform it accordingly
            if (this.inputSource.grip) {
                this.modelEntity.enabled = true;
                this.entity.setPosition(this.inputSource.getPosition());
                this.entity.setRotation(this.inputSource.getRotation());

                // render ray line
                this.vecA.copy(this.inputSource.getOrigin());
                this.vecB.copy(this.inputSource.getDirection());
                this.vecB.scale(1000).add(this.vecA);
                if (this.inputSource.selecting) {
                    this.color.set(0, 1, 0);
                } else {
                    this.color.set(1, 1, 1);
                }
                this.app.renderLine(this.vecA, this.vecB, this.color);
            }
            
            // hovered entity pointer distance
            if (this.hoverEntity) {
                var dist = this.vecA.copy(this.hoverPoint).sub(this.inputSource.getOrigin()).length();
                this.pointerDistance += (dist - this.pointerDistance) * 0.3;
            }

            // pointer position
            this.vecA.copy(this.inputSource.getDirection()).scale(this.pointerDistance).add(this.inputSource.getOrigin());
            this.pointer.setPosition(this.vecA);

            // pointer size
            var pointerSize = this.targetPointerSize * (this.targetTeleportable ? 8 : 1);
            if (this.pointer.element.width !== pointerSize) {
                this.pointer.element.width += (pointerSize - this.pointer.element.width) * 0.3;

                if (Math.abs(this.pointer.element.width - pointerSize) <= 1)
                    this.pointer.element.width = pointerSize;

                this.pointer.element.height = this.pointer.element.width;
            }

            // rotate pointer
            if (this.targetTeleportable) {
                // can teleport on the floor
                this.pointer.setEulerAngles(-90, 0, 0);
            } else if (this.app.xr.camera) {
                // towards camera
                this.pointer.lookAt(this.app.xr.camera.getPosition(), pc.Vec3.DOWN);
                this.pointer.rotateLocal(0, 180, 0);
            }

            // gamepad input
            var gamepad = this.inputSource.gamepad;
            if (gamepad) {
                // left controller thumbstick for move
                if (this.inputSource.handedness === pc.XRHAND_LEFT && (gamepad.axes[3] || gamepad.axes[2])) {
                    this.app.fire('controller:move', gamepad.axes[2], gamepad.axes[3], dt);

                    // right controller thumbstick for turn
                } else if (this.inputSource.handedness === pc.XRHAND_RIGHT && gamepad.axes[2]) {
                    this.app.fire('controller:rotate', -gamepad.axes[2], dt);
                }
            }

          //  this.controllerTemplate.rigidbody.disableSimulation()            
          //  this.controllerTemplate.setPosition(this.entity.getPosition());
            //this.controllerTemplate.setRotation(this.entity.getRotation());
           // this.controllerTemplate.rigidbody.enableSimulation()
            // Store the previous position
            this.previousPosition = this.controllerTemplate.getPosition();

            // Update the current position
            this.currentPosition = this.dir.getPosition();

            // Calculate the velocity 
            var velocity = this.currentPosition.clone().sub(this.previousPosition).scale(FIXED_DELTA_TIME);

            // Set the velocity
            this.controllerTemplate.rigidbody.linearVelocity = velocity //= pc.Vec3.ZERO;
            //this.controllerTemplate.rigidbody.teleport(this.currentPosition,this.dir.getRotation())

            
            // Store the previous rotation
            this.previousRotation = this.controllerTemplate.getRotation();

            // Update the current rotation
            this.currentRotation = this.dir.getRotation();

            // Calculate the relative rotation
            var relativeRotation = this.currentRotation.clone().mul(this.previousRotation.invert());

            
            // The angular velocity is the angle divided by the time elapsed
            var angularVelocity = clampMagnitude(relativeRotation.getEulerAngles().scale(0.7),10);
            
            
            //pc.app.systems.rigidbody.dynamicsWorld.stepSimulation(0.001);
            

            // Set the angular velocity
            this.controllerTemplate.rigidbody.angularVelocity = angularVelocity;

            
           this.controllerTemplate.rigidbody.mass = 5 / (5+ velocity.length()+angularVelocity.length());
    

    }
    
    swap (old) {
        for (let prop in old) {
                this[prop] = old[prop];
        }
    };
    
    //controllerTemplate 

}
function GetFromAToBRotation() {
 
}



pc.registerScript(Controller, 'controller'); 
Controller.attributes.add('controllerTemplate', {
    type: 'entity',
    title: 'Controller Template'
}); 

Controller.attributes.add('dir', {
    type: 'entity',
    title: 'dir'
});
