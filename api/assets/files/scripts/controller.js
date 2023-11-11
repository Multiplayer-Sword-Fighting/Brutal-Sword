
var Controller = class extends bs {
    

    initialize() {

        this.vecA = new pc.Vec3();
        this.vecB = new pc.Vec3();
        this.matA = new pc.Mat4();
        this.quat = new pc.Quat();
        this.color = new pc.Color(1, 1, 1);

        this.modelEntity = this.entity.findFast('model');
        this.hoverEntity = null;

        this.targetPointerSize = 2;
        this.targetTeleportable = false;
        this.pointer = this.entity.findFast('pointer');

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
        this.entity.enabled = false;
    }
    //inputSourceIndex=0;
    //get inputSource(){ return pc.app.xr.input.inputSources[this.inputSourceIndex]; }
    //set inputSource(value){  this.inputSourceIndex = pc.app.xr.input.inputSources.indexOf(value)}
    setInputSource(/** @type {pc.XrInputSource} */inputSource) {
        this.entity.enabled = true;
        this.inputSource = inputSource;
        inputSource.once('remove', this.onRemove.bind(this));
        
        

        this.on('hover', this.onHover.bind(this));
        this.on('blur', this.onBlur.bind(this));

        if (inputSource.gamepad && inputSource.gamepad.buttons) {
            inputSource.gamepad.vibrationActuator.playEffect("dual-rumble", { duration: 100, strongMagnitude: 1, weakMagnitude: 1 });
            let previousButtonState = new Array(inputSource.gamepad.buttons.length).fill(false);
            pc.app.on('update', function (dt) {
                inputSource.gamepad.buttons.forEach(function (button, index) {
                    if (button.pressed && !previousButtonState[index]) {
                        // pc.app.fire('gamepad:button:' + index + ':pressed', { button: index });
                        
                        //toggleWorld(true)
                    } else if (!button.pressed && previousButtonState[index]) {
                        // pc.app.fire('gamepad:button:' + index + ':released', { button: index });
                        //toggleWorld(false)
                    }
                    previousButtonState[index] = button.pressed;
                }, this);
            }, this);
        }
        inputSource.on('select', this.onSelect.bind(this));
    }

    onRemove() {
        this.entity.destroy();
    }

    onSelect() {
        if (this.targetTeleportable) 
            st.CameraController.onTeleport(this.hoverPoint);
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
        var pointerSize = this.targetPointerSize * (this.targetTeleportable ? 1 : 1);
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
                st.CameraController.onMove(gamepad.axes[2], gamepad.axes[3], dt);
            } else if (this.inputSource.handedness === pc.XRHAND_RIGHT && gamepad.axes[2]) {
                st.CameraController.onRotate(gamepad.axes[2], dt);
            }
        }


    }
    swap(old) {
        this.DoSwap(old);
    };

}
function toggleWorld(value) {
    let mainCamera = pc.app.systems.camera.cameras[0];
    if (value)
        mainCamera.layers = mainCamera.layers.filter(a => a != pc.LAYERID_WORLD);
    else
        mainCamera.layers = [...mainCamera.layers, pc.LAYERID_WORLD];
    ;
}


pc.registerScript(Controller, 'controller');