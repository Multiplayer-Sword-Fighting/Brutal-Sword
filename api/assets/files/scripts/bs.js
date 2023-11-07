
var st = {
    /** @type {bs} */
    buttonAr: null,
    /** @type {Player} */
    Player: null,
    /** @type {Mirror} */
    Mirror: null,
    /** @type {CameraController} */
    Camera: null,
    
}
var Types = {
    /** @type {Life[]} */
    Life : []
}


class bs extends pc.ScriptType {
    constructor(params) {

        super(params);
        this.Awake();
        //if (!st[params.entity.name] || this.__scriptType.name === st[params.entity.name])
            st[params.entity.name] = this;


        var parent = this.entity.parent;
        while (parent) {
            parent.script?.scripts.forEach(s => { if (!s[params.entity.name]) s[params.entity.name] = this; })
            parent = parent.parent;
        }

        Types[this.__scriptType.__name]?.push(this);        
    }
    Awake() {

    }
    DoSwap(old) {
        console.log("Swapped " + this.__scriptType.name)
        for (let prop in old) {
            this[prop] = old[prop];
        }
    };
    InitArguments() {

    }

    
};

pc.registerScript(bs, 'bs');
