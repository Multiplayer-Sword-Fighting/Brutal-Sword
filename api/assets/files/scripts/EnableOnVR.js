
class EnableOnVR extends pc.ScriptType{
    
    constructor(params){
        super(params);
        this.Awake();
    }
    
    Awake(){
        this.entity.enabled = false;
        pc.app.xr.on('start', () => {
            this.entity.enabled = true;
        });
    }
}
pc.registerScript(EnableOnVR, 'EnableOnVR');

