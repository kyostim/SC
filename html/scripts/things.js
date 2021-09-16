var features = [];
var url = config.baseProtocol + '://' + config.baseURL + ':' + config.basePort + '/';

function getThings() {
    //fetch(url + 'thing')
    fetch(url + 'thing')
        .then(response => response.text())
        .then(data => handleThingResponse(data))
        .catch(function(err) {
            alert('Fetch Error :' + err);
    });  
          
    getFeatures();
}

function handleThingResponse(data) {
    var table = document.getElementById('tableThings');
    table.innerHTML = "";
    
    var trHeader = document.createElement('tr');
    trHeader.innerHTML ='<tr><th>ID</th><th>Name</th></tr>';             
    table.appendChild(trHeader);             
                        
    const things = JSON.parse(data);
    things.forEach(element => {
        var tr = document.createElement('tr');
        tr.addEventListener("click",thingRowClicked, false);
        tr.innerHTML = '<td>' + element.ID + '</td>' +
                        '<td>' + element.Name + '</td>';
        table.appendChild(tr);
    });
    
}

function getThingFeatureValues(id) {

    fetch(url + 'featurevalue?thingid=' + id)
        .then(response => response.text())
        .then(data => handleThingFeatureValueResponse(data))
        .catch(function(err) {
            alert('Fetch Error :' + err);
        });  
}

function handleThingFeatureValueResponse(data) {
    var table = document.getElementById('tableThingFeatures');
    table.innerHTML = "";
    
    var trHeader = document.createElement('tr');
    trHeader.innerHTML ='<tr><th>Name</th><th>Value</th><th>Type</th></tr>';             
    table.appendChild(trHeader);             
                        
    const featureValues = JSON.parse(data);
    for(var featureValue of featureValues) {
        let featureObject = getFeature(featureValue.FeatureID);

        var tr = document.createElement('tr');
        //tr.addEventListener("click",thingRowClicked, false);
        tr.innerHTML = '<td>' + featureObject.name + '</td>' +
                        '<td>' + featureValue.Value + '</td>' +
                        '<td>' + featureObject.type + '</td>';
        table.appendChild(tr);

    }
}

function getFeature(id) {
    for(var featureObject of features) {
        if(featureObject.id == id) {            
            return featureObject;
        }
    }
}



function thingRowClicked()
{               
    var id = this.cells[0].innerHTML;
    var name = this.cells[1].innerHTML;

    var labelID = document.getElementById('labelID');
    var inputName = document.getElementById('inputName');
    

    labelID.innerHTML = id;
    inputName.value = name;

    getThingFeatureValues(id);
}

function clearThingFields() {
    var labelID = document.getElementById('labelID');
    var inputName = document.getElementById('inputName');

    labelID.innerHTML = '0';
    inputName.value = '';

    getThingFeatureValues(0);
}

function updateThing() {
    var labelID = document.getElementById('labelID');
    var inputName = document.getElementById('inputName');

    if(inputName.value === '') {
        alert('Name is mandatory field');
    }
    else{
        var newThing = new thing(labelID.innerHTML, inputName.value);


        var jsonThing = JSON.stringify(newThing);

        fetch(url + 'thing', {
                                                                    method: 'PUT',
                                                                    body: jsonThing,
                                                                    headers: {'Content-Type': 'application/json'}
                                                                })
        .then(response => response.text())
        .then(response => getThings())
        .catch(function(err) {
            alert('Fetch Error :' + err);
        });  
    }
}

function deleteThing()
{
    var labelID = document.getElementById('labelID');

    if(labelID.innerHTML > 0)
    {
        fetch(url + 'thing/' + labelID.innerHTML, {
                                                                    method: 'DELETE'
                                                                    })
        .then(response => response.text())
        .then(response => getThings())
        .catch(function(err) {
            alert('Fetch Error :' + err);
        });  
    }
}

function getFeatures() {
    fetch(url + 'feature')
        .then(response => response.text())
        .then(data => handleFeatureResponse(data))
        .catch(function(err) {
            alert('Fetch Error :' + err);
        });  
}

function handleFeatureResponse(data) {
    
    const featureObjects = JSON.parse(data);
    for(var featureObject of featureObjects) {
        features.push(new feature(featureObject.ID, featureObject.Name, featureObject.Type));
    }
}


function openAddNewFeatureValue(event) {
    var thingID = labelID = document.getElementById('labelID').innerHTML;

    var $dropdownFeatures = $("#selectFeature");
    $dropdownFeatures.empty();
    for(var featureObject of features) {
        $dropdownFeatures.append($("<option />").val(featureObject.id).text(featureObject.name));
    }
    featureSelectionChanged();


    $("#modalFeatureValues").modal();
}

function featureSelectionChanged() {
    var $dropdownFeatures = $("#selectFeature");
    var $labelType = $("#labelType");

    var featureID = $dropdownFeatures.val();
    for(var featureObject of features) {
        if(featureObject.id == featureID) {            
            $labelType.text(featureObject.type);
            break;
        }
    }
}

function saveFeatureValue() {
    var $dropdownFeatures = $("#selectFeature");
    var $inputValue = $("#inputValue");
    var $labelID = $("#labelID");
    
    var featureID = $dropdownFeatures.val();
    var featureValue = $inputValue.val();
    var thingID = $labelID.text();

    if(featureID > 0 && featureValue !=='' && thingID>0) {
        var newFeatureValue = new featurevalue(0, thingID, featureID, featureValue);
        var jsonFeatureValue = JSON.stringify(newFeatureValue);

        fetch(url + 'featurevalue', {
                                                                    method: 'PUT',
                                                                    body: jsonFeatureValue,
                                                                    headers: {'Content-Type': 'application/json'}
                                                                })
        .then(response => response.text())
        .then(response => getThingFeatureValues(thingID))
        .catch(function(err) {
            alert('Fetch Error :' + err);
        });  
    }

    $("#modalFeatureValues").modal('hide');
}




