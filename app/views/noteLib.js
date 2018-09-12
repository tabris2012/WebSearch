/**
 * 
 */
var simplemde;
var select_folder;

function rename(from_path, to_path) {
	$.ajax ({
		async: false,
		type : "GET",
		url : "./Servlet",
		data: {
			method: "note",
			path: from_path,
			key: "rename",
			data: to_path,
		},
		dataType : "text"
	})
	// リクエスト成功
	.done( data => {
	})
}

function mkdir(dir_path) {
	$.ajax ({
		async: false,
		type : "POST",
		url : "./Servlet",
		data: {
			method: "note",
			path: dir_path,
			key: "mkdir",
		},
		dataType : "text"
	})
	// リクエスト成功
	.done( data => {
	})
}

function searchFile(query, note_id) {
	$.ajax ({
		url: "./Servlet",
		dataType: "json",
		type: "GET",
		data : {
			method: "note",
			key: "search",
			data: query
		}
	})
	.done( data => {
		$('#'+note_id).jstree(true).search(data);
	})
}

function loadFile(file_path) {
	$.ajax ({
		type : "POST",
		url : "./Servlet",
		data : {
			method: "note",
			path: file_path,
			key: "load",
		},
		dataType : "text"
	})
	// リクエスト成功
	.done( data => {
		simplemde.value(data);
		
		if (simplemde.isPreviewActive()) { //Previewがオンの時オフにする
			simplemde.togglePreview(); //1回呼んで編集画面に戻す
			//simplemde.togglePreview(); //2回呼んでPreviewのままにする
		}
	})
}

function saveFile(filepath, res_id) {
	$.ajax ({
		async: false,
		type : "POST",
		url : "./Servlet",
		data: {
			method: "note",
			path: filepath,
			key: "save",
			data: simplemde.value()
		},
		dataType : "text"
	})
	// リクエスト成功
	.done( data => {
		var newNode = document.createElement("span");
		newNode.id = res_id; //同じidのノードを作る
		newNode.style = "color:#ff0000;";
		newNode.appendChild(document.createTextNode(data));
		/*既に存在するdivと置換*/
		var targetNode = document.getElementById(res_id);
		targetNode.parentNode.replaceChild(newNode, targetNode);
		
		setTimeout(function() {
			var targetNode = document.getElementById(res_id);
			targetNode.removeChild(targetNode.firstChild);
		}, 2000);
	})
}