class featurevalue {
    constructor(id, thingid, featureid, value) {
        this.id = id;
        this.thingid = thingid;
        this.featureid = featureid;
        this.value = value;
    }  
    static featurevalueFromJSON(json) {
        return new featurevalue(json.id, json.thingid, json.featureid, json.value);
    }  
}

module.exports = featurevalue

//SELECT ID, ThingID, FeatureID, Value FROM FeatureValue;