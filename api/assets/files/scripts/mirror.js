if (globalThis.importScripts) bs = pc.ScriptType;
var Mirror = class extends bs {

    initialize() {
        /** @type {{position:pc.Vec3,rotation:pc.Quat,index:number,toEntity:pc.Entity}[]} */
        this.frameData = new Array(100).fill({ position: null, rotation: null, index: null });
        this.frameIndex = 0;
        /*
        this.entity.script.Life.sync.forEach(e => {
            let lossyScale = e.getLocalScale();
            let scale = e.getScale().clone().scale(1 / lossyScale.x, 1 / lossyScale.y, 1 / lossyScale.z);
            e.reparent(this.entity.parent);
            e.setLocalScale(scale);
        });
        let old = this.entity.getData();
        this.on("state", (enabled) =>{
            // play a sound effect when the entity is enabled or disabled
            if (enabled) {
                this.entity.setData(old);
            } else {
                this.entity.setPosition(0,0,0);
                this.entity.setEulerAngles(0,0,0);
            }
        });
        */
    }


    update(dt) {
        if (!pc.app.xr.session) return;

        let to = this.entity.script.Life.sync;
        let from = st.Player.entity.script.Life.sync;
        for (let i = 0; i < from.length; i++) {
            let fromEntity = from[i];
            // Save current position and rotation
            let fromPos = fromEntity.getPosition().clone();
            let fromRot = fromEntity.getRotation().clone();
            this.frameData[this.frameIndex] = { position: fromPos, rotation: fromRot, toEntity: to[i] };
            // Load 100 frames old position, rotation and toEntity
            let oldFrameIndex = (this.frameIndex + 1) % this.frameData.length;
            let oldFrameData = this.frameData[oldFrameIndex];
            if (oldFrameData.position && oldFrameData.rotation && oldFrameData.toEntity) {
                oldFrameData.position.x = -oldFrameData.position.x;
                oldFrameData.position.z = -oldFrameData.position.z-3;
                oldFrameData.toEntity.setPosition(oldFrameData.position);
                oldFrameData.toEntity.setRotation(oldFrameData.rotation);
                oldFrameData.toEntity.rotate(0, 180, 0);
            }
                
                
            
            // Update frame index
            this.frameIndex = oldFrameIndex;
        }
    }
    swap(old) {
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