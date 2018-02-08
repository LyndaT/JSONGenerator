var componentCategories = ['USERINTERFACE', 'LAYOUT', 'MEDIA', 'ANIMATION', 'SENSORS', 'SOCIAL', 'STORAGE', 'CONNECTIVITY', 'LEGOMINDSTORMS', 'EXPERIMENTAL', 'EXTENSION'];
var blockCategories = [];
var componentBlockCategories = [];

function toggleBlocks(id) {
	var checkbox = $('#' + id);
	if (checkbox.is(":checked")) {
		//Checking the checkbox
		addComponentBlocks(id);
	} else {
		//Unchecking the checkbox
		removeComponentBlocks(id);
	}
}

function addComponentCheckbox(name, id, categoryString) {
	var container = $('#' + categoryString);
	//id = id.substring(id.lastIndexOf(".")+1);
	var componentInp = $('<input />', { type: 'checkbox', id: id, value: name}).addClass('componentCheckbox');
	componentInp.change(function() {
	  toggleBlocks(id);
	});
	componentInp.appendTo(container);
	$('<label />', { 'for': id, text: id }).appendTo(container);
	$('<br>').appendTo(container);
}

function addBlockCheckbox(name, id, categoryString) {
	var container = $('#' + categoryString);
	//id = id.substring(id.lastIndexOf(".")+1);
	$('<input />', { type: 'checkbox', id: id, value: name, class: 'blockCheckbox'}).appendTo(container);
	$('<label />', { 'for': id, text: id }).appendTo(container);
	$('<br>').appendTo(container);
}

function clearCheckboxes() {
	$('input[type="checkbox"]:checked').attr('checked',false);
}

function addComponentBlocks(componentId) {
	//Generate the container
	var container = $('#ComponentBlocks');
	var id = componentId + 'Blocks';
	$('<div />', {id: id, text: componentId + ' Blocks'}).appendTo(container);
	var blockContainer = $('#' + id);
	$('<br>').appendTo(blockContainer);

	componentBlockCategories.push(componentId);

	//Generate all the block properties/events/methods
	$.getJSON("simple_components.json", function(components) {
		var filtered = components.filter(function(component) {return component.name == componentId;});
		filtered.forEach(function(component) {
			component.blockProperties.forEach(function(property) {
				$('<input />', { type: 'checkbox', id: id + "-" + property.name, checked:true }).appendTo(blockContainer);
				$('<label />', { 'for': id + "-" + property.name, text: property.name }).appendTo(blockContainer);
				$('<br>').appendTo(blockContainer);
			});
			component.events.forEach(function(property) {
				$('<input />', { type: 'checkbox', id: id + "-" + property.name, checked:true }).appendTo(blockContainer);
				$('<label />', { 'for': id + "-" + property.name, text: property.name }).appendTo(blockContainer);
				$('<br>').appendTo(blockContainer);
			});
			component.methods.forEach(function(property) {
				$('<input />', { type: 'checkbox', id: id + "-" + property.name, checked:true }).appendTo(blockContainer);
				$('<label />', { 'for': id + "-" + property.name, text: property.name }).appendTo(blockContainer);
				$('<br>').appendTo(blockContainer);
			});
		});
		$('<hr>').appendTo(blockContainer);
	});
}

function addCheckedComponentBlocks(componentId, checkedList) {
	//Generate the container
	console.log(checkedList);
	var container = $('#ComponentBlocks');
	var id = componentId + 'Blocks';
	$('<div />', {id: id, text: componentId + ' Blocks'}).appendTo(container);
	var blockContainer = $('#' + id);
	$('<br>').appendTo(blockContainer);

	componentBlockCategories.push(componentId);

	var nameMap = [];
	checkedList.forEach(function(elem){
		var nameId = elem["mutatorNameToValue"];
		if (nameId.event_name) {
			nameMap.push(nameId.event_name);
		} else if (nameId.property_name) {
			nameMap.push(nameId.property_name);
		} else {
			nameMap.push(nameId.method_name);
		}
	});

	//Generate all the block properties/events/methods
	$.getJSON("simple_components.json", function(components) {
		var filtered = components.filter(function(component) {return component.name == componentId;});
		filtered.forEach(function(component) {
			component.blockProperties.forEach(function(property) {
				if (nameMap.indexOf(property.name) > -1) {
					$('<input />', { type: 'checkbox', id: id + "-" + property.name, checked:true }).appendTo(blockContainer);
				} else {
					$('<input />', { type: 'checkbox', id: id + "-" + property.name}).appendTo(blockContainer);
				}
				$('<label />', { 'for': id + "-" + property.name, text: property.name }).appendTo(blockContainer);
				$('<br>').appendTo(blockContainer);
			});
			component.events.forEach(function(property) {
				if (nameMap.indexOf(property.name) > -1) {
					$('<input />', { type: 'checkbox', id: id + "-" + property.name, checked:true }).appendTo(blockContainer);
				} else {
					$('<input />', { type: 'checkbox', id: id + "-" + property.name}).appendTo(blockContainer);
				}
				$('<label />', { 'for': id + "-" + property.name, text: property.name }).appendTo(blockContainer);
				$('<br>').appendTo(blockContainer);
			});
			component.methods.forEach(function(property) {
				if (nameMap.indexOf(property.name) > -1) {
					$('<input />', { type: 'checkbox', id: id + "-" + property.name, checked:true }).appendTo(blockContainer);
				} else {
					$('<input />', { type: 'checkbox', id: id + "-" + property.name}).appendTo(blockContainer);
				}
				$('<label />', { 'for': id + "-" + property.name, text: property.name }).appendTo(blockContainer);
				$('<br>').appendTo(blockContainer);
			});
		});
		$('<hr>').appendTo(blockContainer);
	});
}

function removeComponentBlocks(componentId) {
	var blockContainer = $('#' + componentId + 'Blocks');
	blockContainer.remove();
	componentBlockCategories = componentBlockCategories.filter(e => e !== componentId);
}

function generate() {
	var jsonObj = {};
	var jsonCompObj = {};
	var jsonBlockObj = {};
	var jsonString = "";
	jsonBlockObj["ComponentBlocks"] = {};
	componentCategories.forEach(function(category) {
		jsonCompObj[category] = [];
	});
	blockCategories.forEach(function(category) {
		jsonBlockObj[category] = [];
	});
	componentBlockCategories.forEach(function(category) {
		jsonBlockObj["ComponentBlocks"][category] = [];
	});


	// Generates components
	$.getJSON("simple_components.json", function(components) {
		components.forEach(function(component) {
			//checkbox id = component.type;
			var checkedid = component.name;
			if (document.getElementById(checkedid)!= null && document.getElementById(checkedid).checked) {
				var obj = {type: checkedid};
				if (jsonCompObj[component.categoryString]) {
					jsonCompObj[component.categoryString].push(obj);
				} else {
					jsonCompObj[component.categoryString] = [obj];
				}
				component.events.forEach(function(prop) {
					// var blockobj = {name: prop.name};
					var blockPropId = checkedid + 'Blocks-' + prop.name;
					if (document.getElementById(blockPropId) != null && document.getElementById(blockPropId).checked) {
						//jsonBlockObj["ComponentBlocks"][checkedid].push(blockobj);
						var list = convertToXMLObjects("events", checkedid, prop);
						//console.log(list);
						for (var i = 0; i < list.length; i++) {
							var blockObj = list[i];
							jsonBlockObj["ComponentBlocks"][checkedid].push(blockObj);
						}
					}
				});
				component.methods.forEach(function(prop) {
					// var blockobj = {name: prop.name};
					var blockPropId = checkedid + 'Blocks-' + prop.name;
					if (document.getElementById(blockPropId) != null && document.getElementById(blockPropId).checked) {
						//jsonBlockObj["ComponentBlocks"][checkedid].push(blockobj);
						var list = convertToXMLObjects("methods", checkedid, prop);
						//console.log(list);
						for (var i = 0; i < list.length; i++) {
							var blockObj = list[i];
							jsonBlockObj["ComponentBlocks"][checkedid].push(blockObj);
						}
					}
				});

				//Get all the component blocks
				component.blockProperties.forEach(function(prop) {
					// var blockobj = {name: prop.name};
					var blockPropId = checkedid + 'Blocks-' + prop.name;
					if (document.getElementById(blockPropId) != null && document.getElementById(blockPropId).checked) {
						//jsonBlockObj["ComponentBlocks"][checkedid].push(blockobj);
						var list = convertToXMLObjects("blockProperties", checkedid, prop);
						//console.log(list);
						for (var i = 0; i < list.length; i++) {
							var blockObj = list[i];
							jsonBlockObj["ComponentBlocks"][checkedid].push(blockObj);
						}
					}

				});
			}
		});

		// Generates blocks
		$.getJSON("global_blocks.json", function(data) {
			for (key in data) {
				data[key].forEach(function(block) {
					//check if block.type or block.list is checked
					var checkedid = "";
					if (block.type != undefined) {
						checkedid = block.type;
					} else {
						checkedid = block.list;
					}
					if (document.getElementById(checkedid)!=null && document.getElementById(checkedid).checked) {
						jsonBlockObj[key].push(block);
					}
				});
			}

			jsonObj.shownComponentTypes = jsonCompObj;
			jsonObj.shownBlockTypes = jsonBlockObj;
			jsonString = JSON.stringify(jsonObj);
			$('#jsonStr').html(JSON.stringify(jsonObj));
		});
	});

}

function convertToXMLObjects(type, component, blockObj) {
	var xmlObjList = [];
	switch(type) {
		case "events":
			var obj = {};
			obj["type"] = "component_event";
			var mutator = {};
			mutator["component_type"] = component;
			mutator["event_name"] = blockObj.name; 
			obj["mutatorNameToValue"] = mutator;
			obj["fieldNameToValue"] = {};
			// params??
			xmlObjList.push(obj);
			break;
		case "blockProperties":
			var rw = blockObj["rw"];
			if (rw != "invisible") {
				var obj = {};
				obj["type"] = "component_set_get";
				var mutator = {};
				mutator["component_type"] = component;
				mutator["property_name"] = blockObj.name;
				var fields = {};
				fields["PROP"] = blockObj.name;
				obj["fieldNameToValue"] = fields;
				if (rw == "read-only") {
					mutator["set_or_get"] = "get";
					obj["mutatorNameToValue"] = mutator;
					xmlObjList.push(obj);
				} else if (rw == "write-only") {
					mutator["set_or_get"] = "set";
					obj["mutatorNameToValue"] = mutator;
					xmlObjList.push(obj);
				} else if (rw == "read-write") {
					var mutator_get = JSON.parse(JSON.stringify(mutator));
					var obj_get = JSON.parse(JSON.stringify(obj));
					mutator["set_or_get"] = "set";
					mutator_get["set_or_get"] = "get";
					obj["mutatorNameToValue"] = mutator;
					obj_get["mutatorNameToValue"] = mutator_get;
					xmlObjList.push(obj);
					xmlObjList.push(obj_get);
				}
			}
			break;
		case "methods":
			var obj = {};
			obj["type"] = "component_method";
			var mutator = {};
			mutator["component_type"] = component;
			mutator["method_name"] = blockObj.name; 
			obj["mutatorNameToValue"] = mutator;
			obj["fieldNameToValue"] = {};
			// params??
			xmlObjList.push(obj);
			break;
	}
	return xmlObjList;
}

function copyToClipboard() {
	if ($('#jsonStr').html() != undefined && $('#jsonStr').html() != "") {
		var $temp = $("<input>");
		$("body").append($temp);
		$temp.val($('#jsonStr').html()).select();
		document.execCommand("copy");
		$temp.remove();
		alert("JSON String copied");
	} else {
		alert("No JSON String to copy");
	}
}

function save() {
	if ($('#jsonStr').html() != undefined && $('#jsonStr').html() != "") {
		var text = $('#jsonStr').html()
  		var filename = $("#input-saveFile").val()
  		var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  		saveAs(blob, filename+".json");
  		alert("JSON string saved");
	} else {
		alert("No JSON String to save");	
	}
}

function loadComponents(JSONobj) {
	var shownComponents = JSONobj.shownComponentTypes;
	componentCategories.forEach(function(category) {
		if (shownComponents[category].length > 0) {
			for (var i = 0; i < shownComponents[category].length; i++) {
				//Get the checkbox and check the checkbox
				var shownid = shownComponents[category][i];
				$('#' + shownid.type).attr('checked',true);

				//Add the respective blocks
				if (JSONobj.shownBlockTypes != undefined && JSONobj.shownBlockTypes["ComponentBlocks"] != undefined && JSONobj.shownBlockTypes["ComponentBlocks"][shownid.type] != undefined) {
					addCheckedComponentBlocks(shownid.type, JSONobj.shownBlockTypes["ComponentBlocks"][shownid.type]);
				} else {
					addComponentBlocks(shownid.type);
				}
			}
		}
	});
}

function loadBlocks(JSONobj) {
	var shownBlocks = JSONobj.shownBlockTypes;
	blockCategories.forEach(function(category) {
		if (shownBlocks[category].length > 0) {
			for (var i = 0; i < shownBlocks[category].length; i++) {
				var shownid = shownBlocks[category][i];
				if (shownid.type) {
					$('#' + shownid.type).attr('checked',true);	
				} else { //shownid.list
					$('#' + shownid.list).attr('checked',true);
				}
			}
		}
	});
}

function load() {
	var selectedFile = document.getElementById('loadfile').files[0];
	//console.log(selectedFile.type);
	console.log(selectedFile);
	if (selectedFile.type == "application/json") {
		var reader = new FileReader();
		reader.onload = function(e) {
  			var loadedstr = reader.result;
  			var text = $('#jsonStr').html(loadedstr);
  			var JSONStrObj = JSON.parse(loadedstr);
  			console.log(JSON.parse(loadedstr));

  			//changed checked & unchecked
  			clearCheckboxes();
  			loadComponents(JSONStrObj);
  			loadBlocks(JSONStrObj);
  			
		}
		reader.readAsText(selectedFile);
	} else {
		alert("Please select a JSON file");
	}
}


$(document).ready(function() {

	// This only works when the JSON is served up by a server
	// Inside the file location run
	// python -m SimpleHTTPServer

	$.getJSON("simple_components.json", function(components) {
		components.forEach(function(component) {
			addComponentCheckbox(component.type, component.name, component.categoryString);
		});

	});

	$.getJSON("global_block_checkbox.json", function(data) {
		for (key in data) {
			data[key].forEach(function(block) {
				var name = "";
				if (block.type != undefined) {
					name = name + block.type;
				} else {
					name = name + block.list;
				}
				addBlockCheckbox(name, name, key);
			});
			blockCategories.push(key);
		}
	});

	var jsonexample = JSON.parse('{ "name":"John", "age":31, "city":"New York" }');
	console.log(jsonexample);


	$('#generatebutton').click(generate);
	$('#copybutton').click(copyToClipboard);
	$('#savebutton').click(save);
	$('#loadbutton').click(load);


});

