var Mirror = class extends bs {
    initialize() {
        this.frameData = new Array(100).fill({ position: null, rotation: null,index: null });
        this.frameIndex = 0;
    }
    InitArguments() {
        this.from = [this.entity,this.entity,this.entity];
        this.to = [this.entity,this.entity,this.entity];
    }
    update(dt) {
        if (!pc.app.xr.session) return;
        for (let i = 0; i < this.from.length; i++) {
            let fromEntity = this.from[i];
            // Save current position and rotation
            let fromPos = fromEntity.getLocalPosition().clone();
            let fromRot = fromEntity.getLocalRotation().clone();
            this.frameData[this.frameIndex] = { position: fromPos, rotation: fromRot, toEntity: this.to[i] };
            // Load 100 frames old position, rotation and toEntity
            let oldFrameIndex = (this.frameIndex + 1) % this.frameData.length;
            let oldFrameData = this.frameData[oldFrameIndex];
            if (oldFrameData.position && oldFrameData.rotation && oldFrameData.toEntity) {
                oldFrameData.toEntity.setLocalPosition(oldFrameData.position); 
                oldFrameData.toEntity.setLocalRotation(oldFrameData.rotation);
            }
            // Update frame index
            this.frameIndex = oldFrameIndex;
        }
    }
    swap (old) {
        this.DoSwap(old);  
    };
}
pc.registerScript(Mirror, 'Mirror');
Mirror.attributes.add('from', {
    type: 'entity',
    array: true,
});
Mirror.attributes.add('to', {
    type: 'entity',
    array: true,
});