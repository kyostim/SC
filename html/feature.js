class feature {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }  
    static featureFromJSON(json) {
        return new feature(json.id, json.name, json.type);
    }  
}

module.exports = feature