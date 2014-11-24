Appbase.credentials('filter_example', 'ecb48fcbb53a678fb0dc55683d5644f7');
var vRef = Appbase.ns('filter-example').v('test');

var addToView = function(edgeRef, edgeSnap) {
  var li = document.createElement("li");
  var span = document.createElement("span");
  var button = document.createElement("button");
  span.innerHTML = 'name: ' + edgeSnap.name() + ' | ' + 'priority: ' + edgeSnap.priority() + ' | ' + 'priorityToTime: ' + new Date(edgeSnap.priority()).toTwitterRelativeTime();
  button.innerHTML = 'X';
  button.onclick = function() {edgeRef.inVertex().removeEdge(edgeSnap.name());};
  li.appendChild(span);
  li.appendChild(button);
  li.id = edgeSnap.name();
  document.getElementById('list').appendChild(li);
}

var removeFromView = function(edgeRef, edgeSnap) {
  var li = document.getElementById(edgeSnap.name());
  li.parentNode.removeChild(li);
}

var add = function() {
  var name = document.getElementById('edge_name').value;
  name = (name === "") ? Appbase.uuid() : name;
  var priority = document.getElementById('priority').value;
  document.getElementById('priority').value = '';
  document.getElementById('edge_name').value = '';
  var callback = function(error) {if(error) return console.error(error);};
  if(priority === '') {
    vRef.setEdge(name, callback);
  } else {
    vRef.setEdge(name, parseInt(priority), callback);
  }
}

var setFilters = function() {
  clearView();
  var filters = {
    onlyNew: document.getElementById('onlyNew').checked
  };
  
  ['limit', 'startAt', 'endAt', 'skip'].forEach(function(filter) {
    var filterValueFromView = document.getElementById(filter).value;
    if(filterValueFromView !== '') {
      filters[filter] = parseInt(filterValueFromView);
    }
  })
  
  document.getElementById('filters').innerHTML = JSON.stringify(filters);
  console.log('Filters:', filters);
  vRef.on('edge_added', filters,  function(error, e, s) {
    if(error) return console.error(error);
    addToView(e, s);
  })
  
  vRef.on('edge_changed', filters,  function(error, e, s) {
    if(error) return console.error(error);
    removeFromView(e, s);
    addToView(e, s);
  })
  
  vRef.on('edge_removed', filters, function(error, e, s) {
    if(error) return console.error(error);
    removeFromView(e, s);
  })
}

var clearFilters = function() {
  ['limit', 'startAt', 'endAt', 'skip'].forEach(function(filter) {
    document.getElementById(filter).value = '';
  })
  document.getElementById('onlyNew').checked = false;
}

var clearView = function() {
  vRef.off();
  var feedElement = document.getElementById('list');
    while (feedElement.lastChild) {
        feedElement.removeChild(feedElement.lastChild);
    }
}

var reset = function() {
  clearFilters();
  setFilters();
}

var main = function() {
  setFilters();
}

main();