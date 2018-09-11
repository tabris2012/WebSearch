/**
 * 
 */
function loadTree(method, select_node) {
	$.ajax({
		async : true,
		type : "GET",
		url : "./Servlet?method="+method,
		dataType : "json",
		
		success : function (jsonData) {
			$('#'+method).jstree(true).settings.core.data = jsonData;
			
			if (select_node == null) {
				$('#'+method).jstree(true).refresh();
			}
			else { //refreshは非同期のため、終了時のイベントで新規ノード選択
				$('#'+method).one(
					"refresh.jstree", function (e, data) {
						data.instance.select_node(select_node);
					}).jstree(true).refresh();
			}
		}
	});
}
