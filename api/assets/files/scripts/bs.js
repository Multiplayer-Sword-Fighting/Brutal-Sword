var /** @type {Life[]} */ lifeList = [];
class st {
    /** @type {bs} */ 
    static buttonAr;
    
    /** @type {Player} */ 
    static Player;
    
    /** @type {bs} */ 
    static Mirror;
    /** @type {CameraController} */
    static Camera;
    
}

class bs extends pc.ScriptType {
    constructor(params) {
        super(params);
        this.Awake();
        st[params.entity.name]=this;
    }
    Awake(){

    }
    DoSwap (old) {
        console.log("Swapped "+this.__scriptType.name)
        for (let prop in old) {
                this[prop] = old[prop];
        }
    }; 
    InitArguments(){
        
    }
    
    static Register()
    {
        
        this.prototype.InitArguments();
        pc.registerScript(this, this.name);
        const fields = Object.getOwnPropertyNames(instance).filter(prop => typeof instance[prop] !== 'function');
        //console.log(this);
    }
};

pc.registerScript(bs, 'bs');
