/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/main.js":
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("function _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */\n\n/*global $, window, location, CSInterface, SystemPath, themeManager*/\nwindow.onload = function () {\n  'use strict';\n\n  var csInterface = new CSInterface();\n  var dir_home = process.env[process.platform == \"win32\" ? \"USERPROFILE\" : \"HOME\"];\n\n  var dir_desktop = __webpack_require__(/*! path */ \"path\").join(dir_home, \"Desktop\"); //デスクトップパス\n\n\n  var extensionId = csInterface.getExtensionID();\n  var filePath = csInterface.getSystemPath(SystemPath.EXTENSION) + \"/js/\";\n  var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + \"/jsx/\";\n  var layer_list = document.getElementById(\"layer_list\");\n  var get_layers = \"get_layers.jsx\";\n  var GetAction = \"GetAction.jsx\";\n  var id_list = [\"get_ID_layer.jsx\", \"get_ID_layer_copy.jsx\", \"get_ID_layer_del.jsx\", \"get_ID_layer_setd.jsx\", \"get_ID_layer_Open.jsx\", \"get_ID_layer_close.jsx\", \"get_ID_layer_Make.jsx\", \"get_ID_layer_move.jsx\", \"get_ID_layer_placed.jsx\"];\n  var load_action = document.getElementById(\"load_action\");\n  var all_off = document.getElementById(\"all_off\");\n  var all_on = document.getElementById(\"all_on\");\n  var done = document.getElementById(\"done\");\n  var setlist = document.getElementById(\"setlist\");\n  var child_list = document.getElementById(\"child_list\");\n  var form_pros = document.forms.process;\n  var form_act = document.forms.action;\n  var object_move = document.forms.object_move;\n  loadJSX(\"json2.js\");\n  prevent_drag_event();\n  themeManager.init();\n  make_layer_list();\n\n  function loadJSX(fileName) {\n    console.log(extensionRoot + fileName);\n    csInterface.evalScript(\"$.evalFile(\\\"\".concat(extensionRoot + fileName, \"\\\")\"));\n  }\n\n  csInterface.addEventListener(\"documentAfterActivate\", make_layer_list);\n\n  function make_layer_list(e) {\n    console.log(e);\n    csInterface.evalScript(\"$.evalFile(\\\"\".concat(extensionRoot + get_layers, \"\\\")\"), function (o) {\n      var layers = function () {\n        //try内ではconst,letの宣言はスコープで包まれるため即時関数で結果を返すようにする\n        try {\n          return JSON.parse(o);\n        } catch (e) {\n          layer_list.innerHTML = \"\";\n          return false;\n        }\n      }();\n\n      if (!layers) {\n        return;\n      }\n\n      layer_list.innerHTML = write_list(layers);\n      var dis_event = new Layer_list_event();\n\n      function write_list(obj) {\n        var list = \"\";\n        obj.name.forEach(function (v, i) {\n          var branch = \"\";\n          var layer_kind = \"adjust\";\n          /*\n          if(obj.type[i] === `folder`){\n          \tbranch +=`<ul>${write_list(obj.folders[i])}</ul>`;\n          }\n          */\n\n          switch (obj.type[i]) {\n            case \"folder\":\n              branch += \"<ul>\".concat(write_list(obj.folders[i]), \"</ul>\");\n              layer_kind = \"folder\";\n              break;\n\n            case \"LayerKind.SMARTOBJECT\":\n              layer_kind = \"smart\";\n              break;\n\n            case \"LayerKind.TEXT\":\n              layer_kind = \"text\";\n              break;\n\n            case \"LayerKind.NORMAL\":\n              layer_kind = \"normal\";\n              break;\n\n            case \"LayerKind.SOLIDFILL\":\n            case \"LayerKind.GRADIENTFILL\":\n            case \"LayerKind.PATTERNFILL\":\n              layer_kind = \"fillout\";\n              break;\n\n            default:\n              break;\n          }\n\n          list += \"<li><label><input type=\\\"checkbox\\\" name=\\\"one_of_layer\\\" class=\\\"\".concat(layer_kind, \"\\\" checked><span class=\\\"layer_box\\\" data-type=\\\"\").concat(obj.type[i], \"\\\">\").concat(v, \"</span>\\n\\t\\t\\t\\t\\t<span class=\\\"layer_name\\\">\").concat(layer_kind, \"</span></label>\").concat(branch, \"</li>\");\n        });\n        return list;\n      }\n      /*\n      layers.name.forEach((v,i)=>{\n      \t\n      \tlist += `<li><label><input type=\"checkbox\" name=\"one_of_layer\"><span class=\"layer_box\" data-type=\"${layers.type[i]}\">${v}</span></label></li>`\n      });\n      layer_list.innerHTML = list;\n      Array.from(document.getElementsByClassName(`layer_box`)).forEach((v,i)=>{\n      \tv.setAttribute(`type`,layers.type[i]);\n      });\n      console.log(document.getElementsByClassName(`layer_box`));*/\n\n    });\n  }\n\n  var Layer_list_event =\n  /*#__PURE__*/\n  function () {\n    function Layer_list_event() {\n      var _this = this;\n\n      _classCallCheck(this, Layer_list_event);\n\n      this.trigger = Array.from(layer_list.getElementsByTagName(\"li\"));\n      this.trigger.forEach(function (v) {\n        v.addEventListener(\"change\", _this, false);\n      });\n      all_on.addEventListener(\"click\", this.check_on, false);\n      all_off.addEventListener(\"click\", this.check_off, false);\n    }\n\n    _createClass(Layer_list_event, [{\n      key: \"handleEvent\",\n      value: function handleEvent() {\n        this.trigger.forEach(function (v) {\n          check_disable(v);\n        });\n\n        function check_disable(elm) {\n          console.log(elm);\n          var lists = Array.from(elm.getElementsByTagName(\"li\"));\n          console.log(elm.children[0].children[0].checked);\n\n          if (!elm.children[0].children[0].checked || elm.children[0].children[0].disabled) {\n            lists.forEach(function (v) {\n              v.children[0].children[0].disabled = true;\n            });\n          } else if (lists.length > 0) {\n            lists.forEach(function (v) {\n              v.children[0].children[0].disabled = false;\n              check_disable(v);\n            });\n          }\n        }\n      }\n    }, {\n      key: \"check_on\",\n      value: function check_on() {\n        Array.from(layer_list.getElementsByTagName(\"li\")).forEach(function (v) {\n          v.children[0].children[0].checked = true;\n        });\n      }\n    }, {\n      key: \"check_off\",\n      value: function check_off() {\n        Array.from(layer_list.getElementsByTagName(\"li\")).forEach(function (v) {\n          v.children[0].children[0].checked = false;\n        });\n      }\n    }]);\n\n    return Layer_list_event;\n  }();\n  /*==============================photoshop event=====================================*/\n\n\n  dispath_event();\n\n  function dispath_event() {\n    id_list.forEach(function (v) {\n      get_ID(v);\n    });\n    var event = new CSEvent();\n    var PhotoshopCallbackUnique = make_layer_list;\n    csInterface.addEventListener(\"com.adobe.PhotoshopJSONCallback\" + extensionId, PhotoshopCallbackUnique);\n\n    function get_ID(type) {\n      //crop event id取得 event 開始\n      csInterface.evalScript(\"$.evalFile(\\\"\".concat(extensionRoot, \"event_id/\").concat(type, \"\\\")\"), function (e) {\n        console.log(_typeof(e));\n        console.log(e);\n        event.data = e; //selectイベントID必ずstring型\n\n        event.type = \"com.adobe.PhotoshopRegisterEvent\";\n        event.scope = \"APPLICATION\";\n        event.appId = csInterface.getApplicationID();\n        event.extensionId = csInterface.getExtensionID();\n        csInterface.dispatchEvent(event);\n        console.log(event);\n      });\n    }\n  }\n  /*========end of photoshop event================*/\n\n  /*========================load action===================*/\n\n\n  load_action.addEventListener(\"click\", function (e) {\n    csInterface.evalScript(\"$.evalFile(\\\"\".concat(extensionRoot + GetAction, \"\\\")\"), function (o) {\n      console.log(o);\n      var actions = JSON.parse(o);\n      var action_set = \"\";\n      actions.forEach(function (v, i) {\n        action_set += \"<option value=\\\"\".concat(decodeURI(v.name), \"\\\">\").concat(decodeURI(v.name), \"</option>\");\n      });\n      setlist.innerHTML = action_set;\n      ch_set.handleEvent();\n    });\n  }, false);\n\n  var Child_set =\n  /*#__PURE__*/\n  function () {\n    function Child_set() {\n      _classCallCheck(this, Child_set);\n\n      this.trigger = setlist;\n      this.trigger.addEventListener(\"change\", this, false);\n    }\n\n    _createClass(Child_set, [{\n      key: \"handleEvent\",\n      value: function handleEvent() {\n        csInterface.evalScript(\"$.evalFile(\\\"\".concat(extensionRoot + GetAction, \"\\\")\"), function (o) {\n          var actions = JSON.parse(o);\n          var acc = \"\";\n          var num = setlist.selectedIndex;\n          console.log(num);\n          actions[num].children.forEach(function (v) {\n            acc += \"<option>\".concat(decodeURI(v.name), \"</option>\");\n          });\n          child_list.innerHTML = acc;\n        });\n      }\n    }]);\n\n    return Child_set;\n  }();\n\n  var ch_set = new Child_set();\n  /*=====================================action================================*/\n\n  done.addEventListener(\"click\", function (e) {\n    var Sent_jsx =\n    /*#__PURE__*/\n    function () {\n      function Sent_jsx() {\n        _classCallCheck(this, Sent_jsx);\n\n        this.prop = {};\n        this.prop.pros_type = form_pros.select_type.value;\n        this.prop.parent_act = form_act.set_list.value;\n        this.prop.child_act = form_act.child_list.value;\n        this.prop.layers = [];\n        this.prop.layers = this.set_layers(Array.from(layer_list.children));\n        this.prop.rotate = parseFloat(object_move.rotate.value);\n        this.prop.vertical = parseFloat(object_move.vertical.value);\n        this.prop.horizontal = parseFloat(object_move.horizontal.value);\n      }\n\n      _createClass(Sent_jsx, [{\n        key: \"connect_jsx\",\n        value: function connect_jsx() {\n          var _this2 = this;\n\n          csInterface.evalScript(\"process(\".concat(JSON.stringify(this.prop), \")\"), function (e) {\n            console.log(\"prop is....\");\n            console.log(layer_list);\n            reedit_tree(_this2.prop.layers, layer_list.children);\n            dispath_event(\"com.adobe.PhotoshopRegisterEvent\"); //レイヤーイベント再開  \n\n            function reedit_tree(obj, layer_list) {\n              obj.forEach(function (v, i) {\n                console.log(layer_list[i].children[0].children[0].checked);\n                layer_list[i].children[0].children[0].checked = v.checked;\n\n                if (v.type == \"folder\") {\n                  reedit_tree(v.layers, layer_list[i].getElementsByTagName(\"li\"));\n                }\n              });\n            }\n          });\n        }\n      }, {\n        key: \"set_layers\",\n        value: function set_layers(array) {\n          var _this3 = this;\n\n          var layers_list = [];\n          layers_list = array.map(function (v) {\n            var obj = {\n              type: v.children[0].children[1].getAttribute(\"data-type\"),\n              name: v.children[0].children[1].innerHTML,\n              checked: v.children[0].children[0].checked,\n              layers: \"\"\n            };\n\n            if (obj.type === \"folder\") {\n              obj.layers = _this3.set_layers(Array.from(v.children[1].children));\n            }\n\n            return obj;\n          });\n          return layers_list;\n        }\n      }]);\n\n      return Sent_jsx;\n    }();\n\n    var event = new CSEvent();\n    var PhotoshopCallbackUnique = make_layer_list;\n    csInterface.removeEventListener(\"com.adobe.PhotoshopJSONCallback\" + extensionId, PhotoshopCallbackUnique);\n    /*==================一時的にレイヤーイベントの停止(レイヤーのon offがリセットされるため)======================*/\n\n    var to_jsx = new Sent_jsx();\n    console.log(to_jsx);\n    to_jsx.connect_jsx();\n  }, false);\n};\n\n//# sourceURL=webpack:///./js/main.js?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ })

/******/ });