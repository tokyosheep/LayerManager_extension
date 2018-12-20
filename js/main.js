/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

window.onload = function(){
    'use strict';

    const csInterface = new CSInterface();
	const dir_home = process.env[process.platform == `win32` ? `USERPROFILE` : `HOME`];
    const dir_desktop = require(`path`).join(dir_home, `Desktop`);//デスクトップパス
	const extensionId = csInterface.getExtensionID(); 
    const filePath = csInterface.getSystemPath(SystemPath.EXTENSION) +`/js/`;
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
	const layer_list = document.getElementById(`layer_list`);
	const get_layers = `get_layers.jsx`;
	const GetAction = `GetAction.jsx`;
	const id_list = [`get_ID_layer.jsx`,`get_ID_layer_copy.jsx`,`get_ID_layer_del.jsx`,
					 `get_ID_layer_setd.jsx`,`get_ID_layer_Open.jsx`,`get_ID_layer_close.jsx`,
					 `get_ID_layer_Make.jsx`,`get_ID_layer_move.jsx`,`get_ID_layer_placed.jsx`];
	
	const load_action = document.getElementById(`load_action`);
	const all_off = document.getElementById(`all_off`);
	const all_on = document.getElementById(`all_on`);
	
	const done = document.getElementById(`done`);
	const setlist = document.getElementById(`setlist`);
	const child_list = document.getElementById(`child_list`);
	
	const form_pros = document.forms.process;
	const form_act = document.forms.action;
	const object_move = document.forms.object_move;
	
	loadJSX(`json2.js`); 
	
    prevent_drag_event();
 	themeManager.init();
 	make_layer_list();
	function loadJSX (fileName) {
        console.log(extensionRoot + fileName);
        csInterface.evalScript(`$.evalFile("${extensionRoot + fileName}")`);
    }
	
	csInterface.addEventListener(`documentAfterActivate`,make_layer_list);
	
	function make_layer_list(e){
		console.log(e);
		csInterface.evalScript(`$.evalFile("${extensionRoot + get_layers}")`,(o)=>{
			
			const layers = (()=>{//try内ではconst,letの宣言はスコープで包まれるため即時関数で結果を返すようにする
				try{
					return JSON.parse(o);
				}catch(e){
					layer_list.innerHTML = ``;
					return false;
				}
			})();	
			if(!layers){ return; }
			
			layer_list.innerHTML = write_list(layers);
			const dis_event = new Layer_list_event();
			
			function write_list(obj){
				let list = ``;
				obj.name.forEach((v,i)=>{
					let branch = ``;
					let layer_kind = `adjust`;
					/*
					if(obj.type[i] === `folder`){
						branch +=`<ul>${write_list(obj.folders[i])}</ul>`;
					}
					*/
					switch(obj.type[i]){
						case `folder`:
							branch +=`<ul>${write_list(obj.folders[i])}</ul>`;
							layer_kind = `folder`;	
							break;
							
						case `LayerKind.SMARTOBJECT`:	
							layer_kind = `smart`;
							break;
							
						case `LayerKind.TEXT`:
							layer_kind = `text`;
							break;
							
						case `LayerKind.NORMAL`:
							layer_kind = `normal`;
							break;
							
						case `LayerKind.SOLIDFILL`:
						case `LayerKind.GRADIENTFILL`:	
						case `LayerKind.PATTERNFILL`:
							layer_kind = `fillout`;
							break;
							
						default:
							break;
							
						   }
					list += `<li><label><input type="checkbox" name="one_of_layer" class="${layer_kind}" checked><span class="layer_box" data-type="${obj.type[i]}">${v}</span>
					<span class="layer_name">${layer_kind}</span></label>${branch}</li>`
				});
				return list;
			}
			
			
			/*
			layers.name.forEach((v,i)=>{
				
				list += `<li><label><input type="checkbox" name="one_of_layer"><span class="layer_box" data-type="${layers.type[i]}">${v}</span></label></li>`
			});
			layer_list.innerHTML = list;
			Array.from(document.getElementsByClassName(`layer_box`)).forEach((v,i)=>{
				v.setAttribute(`type`,layers.type[i]);
			});
			console.log(document.getElementsByClassName(`layer_box`));*/
		});
	}
	
	class Layer_list_event{
		constructor(){
			this.trigger = Array.from(layer_list.getElementsByTagName(`li`));
			this.trigger.forEach((v)=>{
				v.addEventListener(`change`,this,false);
			});
			all_on.addEventListener(`click`,this.check_on,false);
			all_off.addEventListener(`click`,this.check_off,false);
		}
		
		handleEvent(){
			this.trigger.forEach((v)=>{
				check_disable(v);
			});
			
			
			function check_disable(elm){
				console.log(elm);
				const lists = Array.from(elm.getElementsByTagName(`li`));
				console.log(elm.children[0].children[0].checked);
				if(!elm.children[0].children[0].checked||elm.children[0].children[0].disabled){
					lists.forEach((v)=>{
						v.children[0].children[0].disabled = true;
					});
				}else if(lists.length>0){
					lists.forEach((v)=>{
						v.children[0].children[0].disabled = false;
						check_disable(v);
					});
				}
			}
			
		}
		
		check_on(){
			Array.from(layer_list.getElementsByTagName(`li`)).forEach((v)=>{
				v.children[0].children[0].checked = true;
			});
		}
		
		check_off(){
			Array.from(layer_list.getElementsByTagName(`li`)).forEach((v)=>{
				v.children[0].children[0].checked = false;
			});
		}
	}
	
	
	
	/*==============================photoshop event=====================================*/
	dispath_event();  
	function dispath_event(){
		id_list.forEach((v)=>{
			get_ID(v);
		});
		
		const event = new CSEvent();
		const PhotoshopCallbackUnique = make_layer_list;
		
		csInterface.addEventListener(`com.adobe.PhotoshopJSONCallback`+extensionId,PhotoshopCallbackUnique);
		function get_ID(type){//crop event id取得 event 開始
        	    
        	csInterface.evalScript(`$.evalFile("${extensionRoot}event_id/${type}")`,(e)=>{
        	    console.log(typeof e );
        	    console.log(e);
        	    event.data = e//selectイベントID必ずstring型
        	    event.type = `com.adobe.PhotoshopRegisterEvent`;
        	    event.scope = `APPLICATION`; 
        	    event.appId = csInterface.getApplicationID();
        	    event.extensionId = csInterface.getExtensionID();
        	    csInterface.dispatchEvent(event);
        	     console.log(event);
        	});
        }
	}/*========end of photoshop event================*/
	
	/*========================load action===================*/
	
	load_action.addEventListener(`click`,(e)=>{
		csInterface.evalScript(`$.evalFile("${extensionRoot+GetAction}")`,(o)=>{
			console.log(o);
			const actions = JSON.parse(o);
			let action_set = ``;
			actions.forEach((v,i)=>{
				action_set += `<option value="${decodeURI(v.name)}">${decodeURI(v.name)}</option>`;
			});
			setlist.innerHTML = action_set;
			ch_set.handleEvent();
		});
	},false);
	
	class Child_set{
		constructor(){
			this.trigger = setlist;
			this.trigger.addEventListener(`change`,this,false);
		}
		
		handleEvent(){
			csInterface.evalScript(`$.evalFile("${extensionRoot+GetAction}")`,(o)=>{
				const actions = JSON.parse(o);
				let acc = ``;
				const num = setlist.selectedIndex;
				console.log(num);
				actions[num].children.forEach((v)=>{
					acc += `<option>${decodeURI(v.name)}</option>`
				});
				child_list.innerHTML = acc;
			});
		}
	}
	
	const ch_set = new Child_set();
	/*=====================================action================================*/
	
	done.addEventListener(`click`,(e)=>{
		class Sent_jsx{
			constructor(){
				this.prop = {};
				this.prop.pros_type = form_pros.select_type.value;
				this.prop.parent_act = form_act.set_list.value;
				this.prop.child_act = form_act.child_list.value;
				this.prop.layers = [];
				this.prop.layers = this.set_layers(Array.from(layer_list.children));
				this.prop.rotate = parseFloat(object_move.rotate.value);
				this.prop.vertical = parseFloat(object_move.vertical.value);
				this.prop.horizontal = parseFloat(object_move.horizontal.value);
			}
			
			connect_jsx(){
				csInterface.evalScript(`process(${JSON.stringify(this.prop)})`,(e)=>{
					
					console.log(`prop is....`);
					console.log(layer_list);
					reedit_tree(this.prop.layers,layer_list.children);
					dispath_event(`com.adobe.PhotoshopRegisterEvent`);//レイヤーイベント再開  
					function reedit_tree(obj,layer_list){
						obj.forEach((v,i)=>{
							console.log(layer_list[i].children[0].children[0].checked);
							layer_list[i].children[0].children[0].checked = v.checked;
							if(v.type==`folder`){
								reedit_tree(v.layers,layer_list[i].getElementsByTagName(`li`));
							}
						});
					}
				});
			}
			
			set_layers(array){
				let layers_list = [];
				layers_list = array.map((v)=>{
					const obj = {
						type: v.children[0].children[1].getAttribute(`data-type`),
						name: v.children[0].children[1].innerHTML,
						checked: v.children[0].children[0].checked,
						layers: ``
					};
					if(obj.type === `folder`){
						obj.layers = this.set_layers(Array.from(v.children[1].children));
					}
					return obj;
				});
				return layers_list;
			}
		}
		
		const event = new CSEvent();
		const PhotoshopCallbackUnique = make_layer_list;
		csInterface.removeEventListener(`com.adobe.PhotoshopJSONCallback`+extensionId,PhotoshopCallbackUnique);
		/*==================一時的にレイヤーイベントの停止(レイヤーのon offがリセットされるため)======================*/
		const to_jsx = new Sent_jsx();
		console.log(to_jsx);
		to_jsx.connect_jsx();
	},false);
}