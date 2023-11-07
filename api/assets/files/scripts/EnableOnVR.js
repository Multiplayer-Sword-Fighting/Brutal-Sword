
class EnableOnVR extends pc.ScriptType{
    initArguments(){
        this.hideOnAR = false;
    }   
    constructor(params){
        super(params);
        this.Awake();
    }
    
    Awake(){
        if(this.hideOnAR)
            this.entity.enabled = false;
        pc.app.xr.on('start', () => {
            if(this.hideOnAR && pc.app.xr.type == pc.XRTYPE_AR)
                this.entity.enabled = false;
            else
                this.entity.enabled = true;
        });
    }
}

pc.registerScript(EnableOnVR, 'EnableOnVR');


EnableOnVR.attributes.add('hideOnAR', { type: 'boolean'});