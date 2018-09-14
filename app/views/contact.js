/**
 * 
 */
var path_list;
var search_key;
var highlight_color = "#ffec47";

function highlightText(text) {
	return text.replace(new RegExp(search_key, "g"), //g: 2つ目以降も置換
			"<span style=\"background-color:"+highlight_color+
			"\">"+search_key+"</span>");
}

function getFile(file_path) {
	$.ajax ({
		async: false, //ポップアップブロックされないために同期通信にする
		type : "GET",
		url : "/api/file?path="+file_path,
		dataType : "text"
	})
	// リクエスト成功
	.done( data => {
		var tab = window.open("about:blank");
		tab.document.write(highlightText(data));
		tab.document.close();
	})
}

function getDataInFrame(target_id,file_path) {
	var target_node = document.getElementById(target_id);
	
	if (target_node.hasChildNodes()) { //既に子ノードがあるなら
		var fc = target_node.firstChild;
		
		while( fc ) {
	    target_node.removeChild( fc );
	    fc = target_node.firstChild; //全て削除
		}
		
		return //終了
	}
	
	$.ajax ({
		type : "GET",
		url : "/api/file?path="+file_path,
		dataType : "text"
	})
	// リクエスト成功
	.done( data => {
		var iframe = document.createElement('IFRAME');
		target_node.appendChild(iframe); //先に登録しておく
		
		var doc = iframe.contentDocument;
		doc.open();
		doc.write(highlightText(data));
		doc.close();
		iframe.width = "97%";
		iframe.height = "400";
	})
}

function act(jsonObj, target_id) {
	/*新たにdivを生成*/
	var newNode = document.createElement("div");
	newNode.id = target_id; //同じidのノードを作る
	/*検索結果に応じたリンクを生成*/
	for (var i in jsonObj) { //配列の中に辞書
		var newDiv = document.createElement("div");
		newDiv.id = "toggle"+i; //iframe用
		
		var newLink = document.createElement("a");
		newLink.href = "javascript:void(0)";
		//newLink.setAttribute("onclick", "getFile(\""+jsonObj[i].path.replace(/\\/g, "\\\\")+"\");");
		newLink.setAttribute("onclick",
				"getDataInFrame(\""+newDiv.id+"\", \""+jsonObj[i].path.replace(/\\/g, "\\\\")+"\");");
		newLink.appendChild(document.createTextNode(
				jsonObj[i].path + ": " + jsonObj[i].title));
		
		newNode.appendChild(newLink);
		newNode.appendChild(newDiv);
	}
	/*既に存在するdivと置換*/
	var targetNode = document.getElementById(target_id);
	targetNode.parentNode.replaceChild(newNode, targetNode);
}

function query(search_key, target_id) {
	$.ajax ({
		type : "GET",
		url : "/api/folder/search?key="+escape(search_key)+"&path="+escape(path_list.join(",")),
		dataType : "json"
	})
	//リクエスト成功
	.done (json => {act(json, target_id)})
}
