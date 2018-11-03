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
	const id_list = [`get_ID_layer.jsx`,`get_ID_layer_copy.jsx`,`get_ID_layer_del.jsx`,`get_ID_layer_setd.jsx`,`get_ID_layer_Open.jsx`,`get_ID_layer_close.jsx`];
	
	const load_action = document.getElementById(`load_action`);
	const all_off = document.getElementById(`all_off`);
	const all_on = document.getElementById(`all_on`);
	
	const done = document.getElementById(`done`);
	const setlist = document.getElementById(`setlist`);
	const child_list = document.getElementById(`child_list`);
	
	const form_pros = document.forms.process;
	const form_act = document.forms.action;
	
	loadJSX(`json2.js`); 
	
    prevent_drag_event();
 	themeManager.init();
 	
	function loadJSX (fileName) {
        console.log(extensionRoot + fileName);
        csInterface.evalScript(`$.evalFile("${extensionRoot + fileName}")`);
    }
	
	csInterface.addEventListener(`documentAfterActivate`,make_layer_list);
	
	function make_layer_list(){
		csInterface.evalScript(`$.evalFile("${extensionRoot + get_layers}")`,(o)=>{
			const layers = JSON.parse(o);
			console.log(layers);
			layer_list.innerHTML = write_list(layers);
			const dis_event = new Layer_list_event();
			
			function write_list(obj){
				let list = ``;
				obj.name.forEach((v,i)=>{
					let branch = ``;
					if(obj.type[i] === `folder`){
						branch +=`<ul>${write_list(obj.folders[i])}</ul>`;
					}
					list += `<li><label><input type="checkbox" name="one_of_layer" checked><span class="layer_box" data-type="${obj.type[i]}">${v}</span></label>${branch}</li>`
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
				if(!elm.children[0].children[0].checked){
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
        	    event.type =  `com.adobe.PhotoshopRegisterEvent`;
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
				this.pros_type = form_pros.select_type.value;
				this.parent_act = form_act.set_list.value;
				this.child_act = form_act.child_list.value;
				this.layers = [];
				console.log(layer_list.children);
				this.layers = this.set_layers(Array.from(layer_list.children));
			}
			
			connect_jsx(){
				csInterface.evalScript(`process(${JSON.stringify(this)})`);
			}
			
			set_layers(array){
				let layers_list = [];
				layers_list = array.map((v)=>{
					console.log(v.children[0].children[1]);
					const obj = {
						type: v.children[0].children[1].getAttribute(`data-type`),
						name: v.children[0].children[1].innerHTML,
						checked: v.children[0].children[0].checked,
						list: ``
					};
					if(obj.type === `folder`){
						console.log(v.children[1]);
						obj.list = this.set_layers(Array.from(v.children[1].children));
					}
					console.log(obj);
					return obj;
				});
				return layers_list;
			}
		}
		
		const to_jsx = new Sent_jsx();
		console.log(to_jsx);
		to_jsx.connect_jsx();
	},false);
}