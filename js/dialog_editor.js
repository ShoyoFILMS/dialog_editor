
var node_list=[];
var selected_node_id=false;
var article_empty_text="<p class=\"empty_text\">ボタンでセリフを追加してください。</p>";
var setting_empty_text="<p class=\"empty_text\">未選択</p>";

//左揃えノードを生成（reprintで呼び出し）
function get_left_node(id,img_id,text){
	var left_node="<div class=\"node left_node\" id=\"node"+id+"\" style=\"background-image:url("+img_list[img_id]+");\">";
	left_node+="<p class=\"line\">"+text+"</p>";
	left_node+="</div>";
	return left_node;
}

//右揃えノードを生成（reprintで呼び出し）
function get_right_node(id,img_id,text){
	var right_node="<div class=\"node right_node\" id=\"node"+id+"\" style=\"background-image:url("+img_list[img_id]+");\">";
	right_node+="<p class=\"line\">"+text+"</p>";
	right_node+="</div>";
	return right_node;
}

//会話劇を再描画（addNodeで呼び出し）
function reprint(){
	var article_body="";
	var node_len= node_list.length;
	for(var i=0; i<node_len; i++){
		if(node_list[i][0]=="left"){
			node=get_left_node(i,node_list[i][1],node_list[i][2]);
		}else if(node_list[i][0]=="right"){
			node=get_right_node(i,node_list[i][1],node_list[i][2]);
		}
		article_body+=node;
	}
	$("div.article").html(article_body);
	if(node_len>0){
		$("button.btn_save").removeAttr("disabled");
		$("button.btn_output").removeAttr("disabled");
	}else{
		$("div.article").html(article_empty_text);
		$("div.setting").html(setting_empty_text);
		$("button.btn_save").attr("disabled","disabled");
		$("button.btn_output").attr("disabled","disabled");
	}
}

//ノードを追加（addLeftNode,addRightNodeで呼び出し）
function addNode(node_data){
	if(isNumber(selected_node_id))
		node_list=array_putin(node_list,selected_node_id,[node_data,"empty","セリフを追加"]);
	else
		node_list.push([node_data,"empty","セリフを追加"]);
	$("div.setting").html("<p class=\"empty_text\">未選択</p>");
	selected_node_id=false;
	reprint();
}

//ブロマガ用に出力（ボタン呼び出し）
$("button.btn_output").click(function(){
	$("div.setting").html("<h2>出力データ</h2><textarea class=\"xml_io\"></textarea>");
	var output_html="";
	for(var i=0; i<node_list.length; i++){
		if(node_list[i][0]=="left"){
			output_html+="<div style=\"min-height: 110px;padding: 20px 20px 20px 150px;background:url("+img_list[node_list[i][1]]+") no-repeat 20px 20px;\">";
			output_html+="<p style=\"margin: 0;padding-bottom: 10px;\">"+node_list[i][2]+"</p></div>";
		}else if(node_list[i][0]=="right"){
			output_html+="<div style=\"min-height: 110px;padding: 20px 150px 20px 20px;background:url("+img_list[node_list[i][1]]+") no-repeat 550px 20px;\">";
			output_html+="<p>"+node_list[i][2]+"</p></div>";
		}
	}
	$("div.setting textarea").val(output_html);
});

//XML保存（ボタン呼び出し）
$("button.btn_save").click(function(){
	var save_xml="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<dialog>\n";
	for(var i=0; i<node_list.length; i++){
		save_xml+="<scene>\n";
		save_xml+="<direction>"+node_list[i][0]+"</direction>\n";
		save_xml+="<img_id>"+node_list[i][1]+"</img_id>\n";
		save_xml+="<line>"+node_list[i][2]+"</line>\n";
		save_xml+="</scene>\n";
	}
	save_xml+="</dialog>";
	$("div.setting").html("<h2>セーブデータ</h2><textarea class=\"xml_io\">"+save_xml+"</textarea>");
});

//XML読み込み（ボタン呼び出し）
$(".setting").on('click', '.btn_loadXML', function(){
	var direction_list=$($.parseXML($("div.setting textarea").val())).find("dialog").find("scene").find("direction");
	var img_id_list=$($.parseXML($("div.setting textarea").val())).find("dialog").find("scene").find("img_id");
	var line_list=$($.parseXML($("div.setting textarea").val())).find("dialog").find("scene").find("line");

	var num=line_list.length;
	for(var i=0; i<num; i++)
		node_list[i]=[direction_list[i].innerHTML,img_id_list[i].innerHTML,line_list[i].innerHTML];
	reprint();
});
//XML読み込み画面表示（ボタン呼び出し）
$("button.btn_load").click(function(){
	$("div.setting").html("<h2>データ読み込み</h2><textarea class=\"xml_io\">ここに貼り付け</textarea><button class=\"btn node_param btn_loadXML\">読み込み</button>");
});



//***ノードの選択・変更***
//settingをノードに反映（ボタン呼び出し）
$(".setting").on('click', '.change_node_param', function(){
	node_list[selected_node_id][1]=$("div.setting select.node_param option:selected").attr("name");
	node_list[selected_node_id][2]=$("div.setting textarea.node_param").val().replace(/\n/g,"<br />");
	reprint();
	
	$("div#node"+selected_node_id).addClass("selected_node");
});
$(".setting").on('click', '.delete_node', function(){
	node_list.splice(selected_node_id,1);
	reprint();
});
//ノード選択時に変更フォームをsettingに展開（toggle_node_select内で呼び出し）
function get_select_editor(node_data){
	var editor_html="<img class=\"node_param\" src=\""+img_list[node_data[1]]+"\" alt=\"\" />";
	editor_html+="<select class=\"node_param\">";
	$.each(img_list, function(key, value){
		editor_html+="<option name=\""+key+"\">"+key+"</option>";
	});
	editor_html+="</select>";
	editor_html+="<textarea class=\"node_param\">"+node_data[2]+"</textarea>";
	editor_html+="<button class=\"btn node_param change_node_param\">変更</button>";
	editor_html+="<hr />";
	editor_html+="<button class=\"btn node_param delete_node\">削除</button>";
	return editor_html;
}

$(".article").on('click', '.node', function(){
	var remove=$(this).attr("class").indexOf("selected_node");

	//古い選択ノードを非選択状態化
	$("div#node"+selected_node_id).removeClass("selected_node");

	if(remove!=-1){
		//非選択処理
		selected_node_id=false;
	}else{
		//選択処理

		//選択ノードIDを取得
		selected_node_id=parseInt($(this).attr("id").split("node")[1]);

		//設定画面を作成
		$("div.setting").html(get_select_editor(node_list[selected_node_id]));
		$("div.setting select.node_param").change(function(){
			$("div.setting img.node_param").attr("src",img_list[$("div.setting select.node_param option:selected").attr("name")]);
		});

		//選択したノードを選択状態化
		$("div#node"+selected_node_id).addClass("selected_node");
	}
});



$(function(){
	$("button.btn_add_left").click(function(){
		addNode("left");
	});
	$("button.btn_add_right").click(function(){
		addNode("right");
	});

	reprint();



});