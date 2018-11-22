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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/hyperapp.js":
/*!*************************!*\
  !*** ./src/hyperapp.js ***!
  \*************************/
/*! exports provided: h, app */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "app", function() { return app; });
// 通过h函数转化成node对象树
function h(name, attributes) {
  var rest = [];
  var children = [];
  var length = arguments.length;

  while (length-- > 2) {
    rest.push(arguments[length]);
  }

  while (rest.length) {
    var node = rest.pop(); // 考虑 {}中运行函数的情况，如map

    if (node && node.pop) {
      for (length = node.length; length--;) {
        rest.push(node[length]);
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node);
    }
  }

  return typeof name === "function" ? name(attributes || {}, children) : {
    nodeName: name,
    attributes: attributes || {},
    children: children,
    key: attributes && attributes.key
  };
}
function app(state, actions, view, container) {
  var map = [].map;
  var rootElement = container && container.children[0] || null; // 如果原先有dom节点则转化成oldNode

  var oldNode = rootElement && recycleElement(rootElement);
  var lifecycle = [];
  var skipRender;
  var isRecycling = true; // 浅拷贝，后面改进为深拷贝更佳

  var globalState = clone(state);
  var wiredActions = wireStateToActions([], globalState, clone(actions));
  scheduleRender();
  return wiredActions;

  function recycleElement(element) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function (element) {
        return element.nodeType === 3 // Node.TEXT_NODE
        ? element.nodeValue : recycleElement(element);
      })
    };
  }

  function resolveNode(node) {
    return typeof node === "function" ? resolveNode(node(globalState, wiredActions)) : node != null ? node : "";
  }

  function render() {
    skipRender = !skipRender;
    var node = resolveNode(view);

    if (container && !skipRender) {
      rootElement = patch(container, rootElement, oldNode, oldNode = node);
    }

    isRecycling = false;

    while (lifecycle.length) {
      lifecycle.pop()();
    }
  }

  function scheduleRender() {
    if (!skipRender) {
      skipRender = true;
      setTimeout(render);
    }
  }

  function clone(target, source) {
    var out = {};

    for (var i in target) {
      out[i] = target[i];
    }

    for (var i in source) {
      out[i] = source[i];
    }

    return out;
  }

  function setPartialState(path, value, source) {
    var target = {};

    if (path.length) {
      target[path[0]] = path.length > 1 ? setPartialState(path.slice(1), value, source[path[0]]) : value;
      return clone(source, target);
    }

    return value;
  }

  function getPartialState(path, source) {
    var i = 0;

    while (i < path.length) {
      source = source[path[i++]];
    }

    return source;
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      if (typeof actions[key] === "function") {
        (function (key, action) {
          actions[key] = function (data) {
            var result = action(data);

            if (typeof result === "function") {
              // 如果是函数，运行获取值
              result = result(getPartialState(path, globalState), actions);
            }

            if (result && result !== (state = getPartialState(path, globalState)) && !result.then // !isPromise
            ) {
                console.log('=========================');
                console.log(path, state, result, globalState);
                console.log(globalState = setPartialState(path, clone(state, result), globalState));
                console.log('=========================');
                scheduleRender();
              }

            return result;
          };
        })(key, actions[key]);
      } else {
        wireStateToActions(path.concat(key), state[key] = clone(state[key]), actions[key] = clone(actions[key]));
      }
    }

    return actions;
  }

  function getKey(node) {
    return node ? node.key : null;
  }

  function eventListener(event) {
    return event.currentTarget.events[event.type](event);
  }

  function updateAttribute(element, name, value, oldValue, isSvg) {
    if (name === "key") {} else if (name === "style") {
      if (typeof value === "string") {
        element.style.cssText = value;
      } else {
        if (typeof oldValue === "string") oldValue = element.style.cssText = "";

        for (var i in clone(oldValue, value)) {
          var style = value == null || value[i] == null ? "" : value[i];

          if (i[0] === "-") {
            element.style.setProperty(i, style);
          } else {
            element.style[i] = style;
          }
        }
      }
    } else {
      if (name[0] === "o" && name[1] === "n") {
        name = name.slice(2);

        if (element.events) {
          if (!oldValue) oldValue = element.events[name];
        } else {
          element.events = {};
        }

        element.events[name] = value;

        if (value) {
          if (!oldValue) {
            element.addEventListener(name, eventListener);
          }
        } else {
          element.removeEventListener(name, eventListener);
        }
      } else if (name in element && name !== "list" && name !== "type" && name !== "draggable" && name !== "spellcheck" && name !== "translate" && !isSvg) {
        element[name] = value == null ? "" : value;
      } else if (value != null && value !== false) {
        element.setAttribute(name, value);
      }

      if (value == null || value === false) {
        element.removeAttribute(name);
      }
    }
  }

  function createElement(node, isSvg) {
    var element = typeof node === "string" || typeof node === "number" ? document.createTextNode(node) : (isSvg = isSvg || node.nodeName === "svg") ? document.createElementNS("http://www.w3.org/2000/svg", node.nodeName) : document.createElement(node.nodeName);
    var attributes = node.attributes;

    if (attributes) {
      if (attributes.oncreate) {
        lifecycle.push(function () {
          attributes.oncreate(element);
        });
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i] = resolveNode(node.children[i]), isSvg));
      }

      for (var name in attributes) {
        updateAttribute(element, name, attributes[name], null, isSvg);
      }
    }

    return element;
  }

  function updateElement(element, oldAttributes, attributes, isSvg) {
    for (var name in clone(oldAttributes, attributes)) {
      if (attributes[name] !== (name === "value" || name === "checked" ? element[name] : oldAttributes[name])) {
        updateAttribute(element, name, attributes[name], oldAttributes[name], isSvg);
      }
    }

    var cb = isRecycling ? attributes.oncreate : attributes.onupdate;

    if (cb) {
      lifecycle.push(function () {
        cb(element, oldAttributes);
      });
    }
  }

  function removeChildren(element, node) {
    var attributes = node.attributes;

    if (attributes) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i]);
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element);
      }
    }

    return element;
  }

  function removeElement(parent, element, node) {
    function done() {
      parent.removeChild(removeChildren(element, node));
    }

    var cb = node.attributes && node.attributes.onremove;

    if (cb) {
      cb(element, done);
    } else {
      done();
    }
  }

  function patch(parent, element, oldNode, node, isSvg) {
    // 同一个node树，什么也不处理
    if (node === oldNode) {} // 第一次patch，直接创建DOM树
    else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
        var newElement = createElement(node, isSvg);
        parent.insertBefore(newElement, element);

        if (oldNode != null) {
          removeElement(parent, element, oldNode);
        }

        element = newElement;
      } // 只有文字
      else if (oldNode.nodeName == null) {
          element.nodeValue = node;
        } // 新旧DOM树有所不同，进行diff修改更新DOM
        else {
            updateElement(element, oldNode.attributes, node.attributes, isSvg = isSvg || node.nodeName === "svg");
            var oldKeyed = {};
            var newKeyed = {};
            var oldElements = [];
            var oldChildren = oldNode.children;
            var children = node.children;

            for (var i = 0; i < oldChildren.length; i++) {
              oldElements[i] = element.childNodes[i];
              var oldKey = getKey(oldChildren[i]);

              if (oldKey != null) {
                oldKeyed[oldKey] = [oldElements[i], oldChildren[i]];
              }
            }

            var i = 0;
            var k = 0;

            while (k < children.length) {
              var oldKey = getKey(oldChildren[i]);
              var newKey = getKey(children[k] = resolveNode(children[k])); // 新node树中还存在的旧节点保留

              if (newKeyed[oldKey]) {
                i++;
                continue;
              }

              if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
                if (oldKey == null) {
                  removeElement(element, oldElements[i], oldChildren[i]);
                }

                i++;
                continue;
              }

              if (newKey == null || isRecycling) {
                if (oldKey == null) {
                  patch(element, oldElements[i], oldChildren[i], children[k], isSvg);
                  k++;
                }

                i++;
              } else {
                var keyedNode = oldKeyed[newKey] || [];

                if (oldKey === newKey) {
                  patch(element, keyedNode[0], keyedNode[1], children[k], isSvg);
                  i++;
                } else if (keyedNode[0]) {
                  patch(element, element.insertBefore(keyedNode[0], oldElements[i]), keyedNode[1], children[k], isSvg);
                } else {
                  patch(element, oldElements[i], null, children[k], isSvg);
                }

                newKeyed[newKey] = children[k];
                k++;
              }
            }

            while (i < oldChildren.length) {
              if (getKey(oldChildren[i]) == null) {
                removeElement(element, oldElements[i], oldChildren[i]);
              }

              i++;
            }

            for (var i in oldKeyed) {
              if (!newKeyed[i]) {
                removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
              }
            }
          }

    return element;
  }
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hyperapp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hyperapp */ "./src/hyperapp.js");

var state = {
  count: 5,
  times: 1,
  names: ['美柚', '柚宝宝', '返还购'] // 没做data-binding
  // setInterval(() => {
  //     state.times++;
  // },1000)

};
var actions = {
  down: function down(value) {
    return function (state) {
      return {
        count: state.count - value
      };
    };
  },
  up: function up(value) {
    return function (state) {
      return {
        count: state.count + value
      };
    };
  },
  add: function add(value) {
    return function (state) {
      return state.names.push(value);
    };
  }
};

var view = function view(state, actions) {
  return Object(_hyperapp__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, Object(_hyperapp__WEBPACK_IMPORTED_MODULE_0__["h"])("h1", null, state.count), Object(_hyperapp__WEBPACK_IMPORTED_MODULE_0__["h"])("h2", null, state.times), Object(_hyperapp__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
    onclick: function onclick() {
      return actions.down(1);
    }
  }, " - "), Object(_hyperapp__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
    onclick: function onclick() {
      return actions.up(1);
    }
  }, " + "), Object(_hyperapp__WEBPACK_IMPORTED_MODULE_0__["h"])("button", {
    onclick: function onclick() {
      return actions.add('新增');
    }
  }, " add "), state.names.map(function (item) {
    return Object(_hyperapp__WEBPACK_IMPORTED_MODULE_0__["h"])("div", null, item);
  }));
};

Object(_hyperapp__WEBPACK_IMPORTED_MODULE_0__["app"])(state, actions, view, document.querySelector('#app'));

/***/ })

/******/ });
//# sourceMappingURL=main.js.map