
var st = {
    /** @type {Vr} */
    Vr: null,
    /** @type {Player} */
    Player: null,
    /** @type {Mirror} */
    Mirror: null,
    /** @type {CameraController} */
    CameraController: null,
    /** @type {Multiplayer} */
    Multiplayer: null,

}
var Types = {
    /** @type {Life[]} */
    Life: []
}


class bs extends pc.ScriptType {
    /** @type {string} */
    get text() {
        return this.entity.element.text;
    }
    set text(value) {
        this.entity.element.text = value;
    }
    constructor(params) {

        super(params);
        this.Awake();
        st[this.__scriptType.name] = this;

        var parent = this.entity.parent;
        while (parent) {
            parent.script?.scripts.forEach(s => {
                if (s[params.entity.name]===null) s[params.entity.name] = this;
                if (s.rigidbody === null && this.entity.rigidbody) s.rigidbody = this.entity.rigidbody;
            })
            if(parent.rigidbody===null) parent.rigidbody = this.entity.rigidbody;
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
