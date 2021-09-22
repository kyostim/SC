var url = config.baseProtocol + '://' + config.baseURL + ':' + config.basePort + '/';

function getFeatures() {
    fetch(url + 'feature')
        .then(response => response.text())
        .then(data => handleFeatureResponse(data))
        .catch(function(err) {
            alert('Fetch Error :' + err);
        });               
}

function handleFeatureResponse(data) {
    var table = document.getElementById('tableFeatures');
    table.innerHTML = "";
    
    var trHeader = document.createElement('tr');
    trHeader.innerHTML ='<tr><th>ID</th><th>Name</th><th>Type</th></tr>';             
    table.appendChild(trHeader);             
                        
    const things = JSON.parse(data);
    things.forEach(element => {
        var tr = document.createElement('tr');
        tr.addEventListener("click",featureRowClicked, false);
        tr.innerHTML = '<td>' + element.ID + '</td>' +
                        '<td>' + element.Name + '</td>' +
                        '<td>' + element.Type + '</td>';
        table.appendChild(tr);
    });    
}

function featureRowClicked()
{               
    var id = this.cells[0].innerHTML;
    var name = this.cells[1].innerHTML;

    var labelID = document.getElementById('labelID');
    var inputName = document.getElementById('inputName');

    labelID.innerHTML = id;
    inputName.value = name;
}

function clearFeatureFields() {
    var labelID = document.getElementById('labelID');
    var inputName = document.getElementById('inputName');

    labelID.innerHTML = '0';
    inputName.value = '';
}

function updateFeature() {
    var labelID = document.getElementById('labelID');
    var inputName = document.getElementById('inputName');
    var selectType = document.getElementById('selectType');

    if(inputName.value === '') {
        alert('Name is mandatory field');
    }
    else{
        if(labelID.innerHTML === '0')
        {
            var newFeature = new feature(labelID.innerHTML, inputName.value, selectType.value);


            var jsonFeature = JSON.stringify(newFeature);

            fetch(url + 'feature', {
                                                                        method: 'PUT',
                                                                        body: jsonFeature,
                                                                        headers: {'Content-Type': 'application/json'}
                                                                    })
            .then(response => response.text())
            .then(response => getFeatures())
            .catch(function(err) {
                alert('Fetch Error :' + err);
            });  
        }
    }
}


function deleteFeature()
{
    var labelID = document.getElementById('labelID');

    if(labelID.innerHTML > 0)
    {
        fetch(url + 'feature/' + labelID.innerHTML, {
                                                                    method: 'DELETE'
                                                                    })
        .then(response => response.text())
        .then(response => getFeatures())
        .catch(function(err) {
            alert('Fetch Error :' + err);
        });  
    }
}