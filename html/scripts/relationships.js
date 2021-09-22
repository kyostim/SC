const { relationshipFromJSON } = require("../releationship");

var url = config.baseProtocol + '://' + config.baseURL + ':' + config.basePort + '/';

function getRelationships() {
    fetch(url + 'relationship')
        .then(response => response.text())
        .then(data => handleRelationshipResponse(data))
        .catch(function(err) {
            alert('Fetch Error :' + err);
        });  

    getThingsToDropdown();

    $("#addRelationship").modal('hide');
}

function handleRelationshipResponse(data) {
    const jsonRelationships = JSON.parse(data);
    var relationshipObjects = [];
    jsonRelationships.forEach(element => {
       relationshipObject = new relationship(element.ID, element.ParentID, element.Name, element.ThingID);
       relationshipObjects.push(relationshipObject);
    });  

    var hierarchialList = [];
    relationshipObjects.forEach(relationshipObject => {
        if(!relationshipObject.parent) {
            var parentFound = findParent(relationshipObjects, relationshipObject);
            if(!parentFound) {
                hierarchialList.push(relationshipObject);
            }
        }
    });

    //var ulRelationship = document.createElement("ul");
    var ulRelationships = document.getElementById("ulRelationships");
    ulRelationships.innerHTML = "";
    for(var relationshipObject of hierarchialList) {
        var liRootItem = document.createElement("li");
        liRootItem.setAttribute("id", relationshipObject.id);
        liRootItem.innerHTML = relationshipObject.name;
        if(relationshipObject.children) {
            var ulParent = document.createElement("ul");
            for(var childObject of relationshipObject.children) {
                populateChildItems(ulParent, childObject)
            }
            liRootItem.appendChild(ulParent);
        }
        ulRelationships.append(liRootItem);
    }
}

function populateChildItems(ulParent, childObject) {

    var liItem = document.createElement("li");
    liItem.setAttribute("id", childObject.id);
    liItem.innerHTML = childObject.name;
    if(childObject.children) {
        var parent = document.createElement("ul");
        for(var child of childObject.children) {
            populateChildItems(parent, child)
        }
        liItem.appendChild(parent);
    }
    ulParent.append(liItem);
}

function findParent(relationshipObjects, childObject) {
    var parentFound = false;

    for(var relationshipObject of relationshipObjects) {
        if(relationshipObject.id !== childObject.id) {      
            if(relationshipObject.id === childObject.parentid) {
                childObject.parent = relationshipObject;
                relationshipObject.addChildren(childObject);
                parentFound = true;
                break;
            }
        }
    }
    return parentFound;
}





function treeviewMouseDown(event) {
    if(event.button === 2) {
        var id = event.target.id;
        if(id) {
            //$("#addRelationship").modal();
            var contextMenu = document.getElementById("contextMenu");
            if(contextMenu.style.display === "none") {
                contextMenu.style.position = "fixed";
                contextMenu.style.display = "block";
                contextMenu.style.position = "absolute";
                contextMenu.style.left = event.pageX + 'px';
                contextMenu.style.top = event.pageY + 'px';
                $('#contextMenu').data('id', id);
            }
            else {
                contextMenu.style.display = "none";
            }

            //$("#contextMenu").show();
            

        }
        //alert("You pressed button: " + event.button);
        //event.stopPropagation();
    }
}

function hideContextMenu() {
    var contextMenu = document.getElementById("contextMenu");
    contextMenu.style.display = "none";
}

function removeItem(event) {
    var id = $('#contextMenu').data('id');
    deleteRelationship(id);
}

function addRootItem() {
    var parentID = 0;
    var $labelParentID = $("#labelParentID");
    var $inputName = $("#inputName");
    var $selectThing =$("#selectThing");

    $labelParentID.text(parentID);
    $inputName.val('');
    $selectThing.val(0);

    $("#addRelationship").modal();
}

function addChildItem(event) {
    var parentID = $('#contextMenu').data('id');
    var $labelParentID = $("#labelParentID");
    var $inputName = $("#inputName");
    var $selectThing =$("#selectThing");

    $labelParentID.text(parentID);
    $inputName.val('');
    $selectThing.val(0);

    $("#addRelationship").modal();
}

function editItem(event) {
    var id = $('#contextMenu').data('id');

    fetch(url + 'relationship?id=' + id)
        .then(response => response.text())
        .then(data => handleRelationshipGET(data))
        .catch(function(err) {
            alert('Fetch Error :' + err);
        });  

   
}

function handleRelationshipGET(data) {
    const jsonRelationships = JSON.parse(data);
    var relationshipObject = new relationship(jsonRelationships.ID, jsonRelationships.ParentID, jsonRelationships.Name, jsonRelationships.ThingID);
    if(relationshipObject.id) {
    
        var $labelID = $("#labelID");
        var $labelParentID = $("#labelParentID");
        var $inputName = $("#inputName");
        var $selectThing =$("#selectThing");

        $labelID.text(relationshipObject.id);
        $labelParentID.text(relationshipObject.parentid);
        $inputName.val(relationshipObject.name);
        $selectThing.val(relationshipObject.thingid ? relationshipObject.thingid : 0);

        $("#addRelationship").modal();
    }
}



function getThingsToDropdown() {
    fetch(url + 'thing')
        .then(response => response.text())
        .then(data => populateThingsToDropdown(data))
        .catch(function(err) {
            alert('Fetch Error :' + err);
        });               
}

function populateThingsToDropdown(data) {

    const things = JSON.parse(data);

    var $dropdownThings = $("#selectThing");
    $dropdownThings.empty();
    $dropdownThings.append("<option value='0'>None</option>");
    
    things.forEach(element => {
        $dropdownThings.append($("<option />").val(element.ID).text(element.Name));
    });    
}

function saveRelationship(event) {
    var $labelID = $("#labelID");
    var $inputName = $("#inputName");
    var $labelParentID = $("#labelParentID");
    var $selectThing =$("#selectThing");

    var id = $labelID.text();
    var name = $inputName.val();
    var parentid = $labelParentID.text();
    var thingid = $selectThing.val();
    if(name) {
        var newRelationship = new relationship(id, parentid, name, thingid);
        var jsonRelationship = JSON.stringify(newRelationship);

        fetch(url + 'relationship', {
                                                                    method: 'PUT',
                                                                    body: jsonRelationship,
                                                                    headers: {'Content-Type': 'application/json'}
                                                                })
        .then(response => response.text())
        .then(response => getRelationships())
        .catch(function(err) {
            alert('Fetch Error :' + err);
        }); 
    }
    else {
        alert('Name is mandatory field');
    }
}

function deleteRelationship(id) {
    if(id > 0)
    {
        fetch(url + 'relationship/' + id, {
                                                                    method: 'DELETE'
                                                                    })
        .then(response => response.text())
        .then(response => getRelationships())
        .catch(function(err) {
            alert('Fetch Error :' + err);
        });  
    }
}

