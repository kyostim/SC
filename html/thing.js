class thing {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }  
    static thingFromJSON(json) {
        //var obj = JSON.parse(json);
        return new thing(json.id, json.name);
    }  
}

module.exports = thing

