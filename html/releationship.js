class relationship {
    
    constructor(id, parentid, name, thingid) {
        this.id = id;
        this.parentid = parentid;
        this.name = name;
        this.thingid = thingid;
    }  
    get children() {
        return this._children;
    }
    addChildren(value) {
        if(!this._children) this._children = [];
        this._children.push(value);
    }
    get parent() {
        return this._parent;
    }
    set parent(value) {
        this._parent = value;
    }
    

    static relationshipFromJSON(json) {
        return new relationship(json.id, json.parentid, json.name, json.thingid);
    }  
}

module.exports = relationship
