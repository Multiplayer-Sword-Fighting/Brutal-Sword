if (globalThis.importScripts) bs = pc.ScriptType;

var TriggerHelper = class extends bs {
    initialize(){
        this.entity.collision.on("triggerenter",this.onTriggerEnter.bind(this))
    }
    onTriggerEnter(e){
        console.log("asd");
    }
}
pc.registerScript(TriggerHelper, 'TriggerHelper');