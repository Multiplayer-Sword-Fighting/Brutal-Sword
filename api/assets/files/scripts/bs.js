var /** @type {Life[]} */ lifeList = [];
class  bs extends pc.ScriptType {
    
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
//pc.registerScript(bs2, 'bs2');
