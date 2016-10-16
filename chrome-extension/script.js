/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _SearchEngine = __webpack_require__(1);

	var _SearchEngine2 = _interopRequireDefault(_SearchEngine);

	var _SearchEngineView = __webpack_require__(3);

	var _SearchEngineView2 = _interopRequireDefault(_SearchEngineView);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var style = __webpack_require__(8);

	var searchEngine = new _SearchEngine2.default();
	var searchEngineView = new _SearchEngineView2.default(searchEngine);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SearchEngine = function () {
	  function SearchEngine() {
	    _classCallCheck(this, SearchEngine);

	    this.spyOnHttp();
	  }

	  _createClass(SearchEngine, [{
	    key: 'searchInWords',
	    value: function searchInWords(list, query) {
	      var occurrences = list.filter(function (item) {
	        return item.innerHTML.indexOf(query) !== -1;
	      });
	      return occurrences;
	    }
	  }, {
	    key: 'getTime',
	    value: function getTime(word) {
	      return word.parentNode.getAttribute('t') / 1000;
	    }
	  }, {
	    key: 'handleSubtitlesLoad',
	    value: function handleSubtitlesLoad(response) {
	      var parser = new DOMParser();
	      var subtitles = parser.parseFromString(response, 'text/xml');
	      var words = subtitles.getElementsByTagName('s');
	      this.words = [].slice.call(words, 0);
	    }
	  }, {
	    key: 'search',
	    value: function search(query) {
	      var _this = this;

	      var result = this.searchInWords(this.words, query);
	      return result.map(function (word) {
	        return _this.getTime(word);
	      });
	    }
	  }, {
	    key: 'spyOnHttp',
	    value: function spyOnHttp() {
	      var send = XMLHttpRequest.prototype.send;
	      var self = this;

	      XMLHttpRequest.prototype.send = function () {
	        this.onload = function () {
	          if (this.responseURL.indexOf('timedtext') === -1) {
	            return;
	          }

	          self.handleSubtitlesLoad(this.response);
	        };
	        send.apply(this, arguments);
	      };
	    }
	  }]);

	  return SearchEngine;
	}();

	exports.default = SearchEngine;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.$ = $;
	exports.formatTime = formatTime;
	exports.triggerEvent = triggerEvent;
	exports.padWithZero = padWithZero;
	exports.debounce = debounce;


	/**
	 * @param {string} className
	 * @return {HTMLElement}
	 */
	function $(className) {
	  var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

	  return element.getElementsByClassName(className)[0];
	}

	$.createElement = document.createElement.bind(document);

	$.on = function (element, eventName, callback) {
	  element.addEventListener(eventName, callback, false);
	};

	/**
	 * templating
	 * @param  {string} string
	 * @param  {Object} data   data for template
	 * @return {HTMLElement}
	 */
	$.renderFromString = function (string) {
	  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  var wrapper = $.createElement('div');

	  for (var key in data) {
	    string = string.replace('{{' + key + '}}', data[key]);
	  }
	  wrapper.innerHTML = string;
	  return wrapper.children[0];
	};

	/**
	 * @param  {number} time time in seconds
	 * @return {string}      string in [hh:]MM:ss format
	 */
	function formatTime(time) {
	  var hours = Math.floor(time / 3600);
	  var rest = time % 3600;
	  var minutes = Math.floor(rest / 60);
	  var seconds = Math.round(rest % 60);
	  var result = '';
	  if (hours) {
	    result = hours + ':';
	  }
	  result += padWithZero(minutes) + ':' + padWithZero(seconds);
	  return result;
	};

	/**
	 * @param  {HTMLElement} $element 
	 * @param  {string} eventName
	 */
	function triggerEvent($element, eventName) {
	  var event;
	  event = document.createEvent('HTMLEvents');
	  event.initEvent(eventName, true, true);
	  event.eventName = eventName;
	  $element.dispatchEvent(event);
	};

	/**
	 * @param  {number} number
	 * @return {string}
	 */
	function padWithZero(number) {
	  return number > 9 ? number : '0' + number;
	};

	/**
	 * debounce
	 * @param  {number}   delay
	 * @param  {Function} callback
	 * @return {Funciton}
	 */
	function debounce(delay, callback) {
	  var timeout = null;

	  return function () {
	    var _arguments = arguments;

	    clearTimeout(timeout);
	    timeout = setTimeout(function () {
	      callback.apply(null, _arguments);
	    });
	  };
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(4);

	var _util = __webpack_require__(2);

	var _MarksView = __webpack_require__(5);

	var _MarksView2 = _interopRequireDefault(_MarksView);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SearchEngineView = function () {
	  function SearchEngineView(searchEngine) {
	    var _this = this;

	    _classCallCheck(this, SearchEngineView);

	    this.opened = false;
	    this.open = this.open.bind(this);
	    this.close = this.close.bind(this);
	    this.handleChange = (0, _util.debounce)(1000, this.handleChange.bind(this));
	    this.searchEngine = searchEngine;
	    _util.$.on(document, 'DOMContentLoaded', function () {
	      _this.init();
	      _this.render();
	    });
	  }

	  _createClass(SearchEngineView, [{
	    key: 'init',
	    value: function init() {
	      this.$container = (0, _util.$)(_constants.CONTAINER_CLASS);
	      this.remplate = __webpack_require__(7);
	      this.marksView = new _MarksView2.default();
	      this.marksView.loadSubtitles();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (this.$node) {
	        this.$container.removeChild(this.$node);
	      }
	      var tabIndexInput = this.open ? '' : 'tabindex="-1"';
	      var tabIndexClose = this.open ? 'tabindex="-1"' : '';
	      this.$node = _util.$.renderFromString(this.remplate, {
	        className: this.opened ? _constants.OPENED_FORM_CLASS : '',
	        tabIndexInput: tabIndexInput,
	        tabIndexClose: tabIndexClose
	      });

	      this.initEvents();

	      var $firstControl = this.$container.children[0];
	      this.$container.insertBefore(this.$node, $firstControl);
	    }
	  }, {
	    key: 'initEvents',
	    value: function initEvents() {
	      var _this2 = this;

	      var $buttonOpen = (0, _util.$)(_constants.BUTTON_OPEN_CLASS, this.$node);
	      var $buttonClose = (0, _util.$)(_constants.BUTTON_CLOSE_CLASS, this.$node);
	      var $input = (0, _util.$)(_constants.INPUT_CLASS, this.$node);
	      this.$input = $input;
	      _util.$.on($buttonOpen, 'click', this.open);
	      _util.$.on($buttonClose, 'click', this.close);
	      _util.$.on($input, 'keydown', function (event) {
	        // prevent default actions (i.e. fullscreen)
	        event.stopPropagation();
	        // close on escape
	        if (event.keyCode === 27) {
	          _this2.close();
	          return;
	        } else {
	          _this2.handleChange(event);
	        }
	      });
	    }
	  }, {
	    key: 'handleChange',
	    value: function handleChange(event) {
	      this.clear();
	      var query = this.$input.value;
	      if (query.length < 3) {
	        return;
	      }
	      var occurrences = this.searchEngine.search(query);
	      this.marksView.renderMarks(occurrences);
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.marksView.removeMarks();
	    }
	  }, {
	    key: 'open',
	    value: function open() {
	      this.opened = true;
	      this.render();
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      this.opened = false;
	      this.$input.value = '';
	      this.render();
	      this.marksView.removeMarks();
	    }
	  }]);

	  return SearchEngineView;
	}();

	exports.default = SearchEngineView;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var CONTAINER_CLASS = exports.CONTAINER_CLASS = 'ytp-right-controls';
	var TIMELINE_CLASS = exports.TIMELINE_CLASS = 'ytp-progress-bar-padding';
	var SUBTITLES_BUTTON_CLASS = exports.SUBTITLES_BUTTON_CLASS = 'ytp-subtitles-button';
	var DURATION_CLASS = exports.DURATION_CLASS = 'ytp-time-duration';
	var OPENED_FORM_CLASS = exports.OPENED_FORM_CLASS = 'ms-search-form-opened';
	var BUTTON_OPEN_CLASS = exports.BUTTON_OPEN_CLASS = 'ms-search-button';
	var BUTTON_CLOSE_CLASS = exports.BUTTON_CLOSE_CLASS = 'ms-close-button';
	var INPUT_CLASS = exports.INPUT_CLASS = 'ms-search-input';

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(2);

	var _constants = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MarksView = function () {
	  function MarksView() {
	    _classCallCheck(this, MarksView);

	    this.$timeline = (0, _util.$)(_constants.TIMELINE_CLASS);
	    this.$duration = (0, _util.$)(_constants.DURATION_CLASS);
	    this.$subtitlesButton = (0, _util.$)(_constants.SUBTITLES_BUTTON_CLASS);
	    this.markTemplate = __webpack_require__(6);
	  }

	  _createClass(MarksView, [{
	    key: 'getDuration',
	    value: function getDuration() {
	      var html = this.$duration.innerHTML;
	      var parts = html.split(':');
	      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
	    }
	  }, {
	    key: 'getSecondWidth',
	    value: function getSecondWidth() {
	      return this.$timeline.offsetWidth / this.getDuration();
	    }
	  }, {
	    key: 'appendMark',
	    value: function appendMark(time) {
	      var timeString = (0, _util.formatTime)(time);
	      var markWidth = 50;
	      var left = time * this.getSecondWidth() - markWidth / 2;

	      var $node = _util.$.renderFromString(this.markTemplate, {
	        time: timeString,
	        left: left + 'px'
	      });

	      this.$timeline.appendChild($node);
	    }
	  }, {
	    key: 'renderMarks',
	    value: function renderMarks(list) {
	      var _this = this;

	      list.forEach(function (time) {
	        _this.appendMark(time);
	      });
	    }
	  }, {
	    key: 'removeMarks',
	    value: function removeMarks() {
	      this.$timeline.innerHTML = '';
	    }
	  }, {
	    key: 'loadSubtitles',
	    value: function loadSubtitles() {
	      var _this2 = this;

	      // load subtitles. wut, wut, wut...
	      this.$subtitlesButton.click();
	      setInterval(function () {
	        _this2.$subtitlesButton.click();
	      });
	    }
	  }]);

	  return MarksView;
	}();

	exports.default = MarksView;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "<span class=\"ms-timeline-mark\" style=\"left: {{left}}\">\n  <span>{{time}}</span>\n</span>\n"

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ms-search-form {{className}}\">\n  <input\n    type=\"text\"\n    class=\"ms-search-input\"\n    {{tabIndexInput}}\n    placeholder=\"Search...\"\n  >\n  <button class=\"ms-search-button\" {{tabIndexOpen}}>\n    <span>⚲</span>\n  </button>\n  <button class=\"ms-close-button\" {{tabIndexInput}}>\n    <span>⚲</span>\n  </button>\n</div>\n"

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(9);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(11)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./style.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(10)();
	// imports


	// module
	exports.push([module.id, "\n.ms-timeline-mark {\n  position: absolute;\n  top: -50px;\n  width: 20px;\n  height: 20px;\n  background: #333;\n  border-radius: 3px 3px 0 0;\n  text-align: center;\n  line-height: 20px;\n  display: inline-block;\n  z-index: 1;\n  font-size: 0;\n  margin-left: 15px;\n  border: 1px solid #f2f2f2;\n}\n\n.ms-timeline-mark span {\n  z-index: 1;\n  position: relative;\n}\n\n.ms-timeline-mark:hover {\n  width: 50px;\n  font-size: 11px;\n  border-radius: 3px;\n  margin-left: 0;\n  z-index: 1;\n}\n\n.ytp-chrome-bottom {\n  z-index: 1002 !important;\n}\n\n.ytp-popup {\n  z-index: 1003 !important;\n}\n\n.ytp-chrome-controls {\n  position: relative;\n  z-index: 1 !important;\n}\n\n.ms-timeline-mark:after {\n  content: ' ';\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-style: solid;\n  background-color: #333;\n  width: 14px;\n  height: 14px;\n  left: 50%;\n  bottom: -8px;\n  margin-left: -7px;\n  border: 1px solid #f2f2f2;\n  border-left: none;\n  border-top: none;\n  transform: rotate(45deg);\n  -webkit-transform: rotate(45deg);\n}\n\n.ms-search-form {\n  display: inline-block;\n  vertical-align: top;\n}\n\n.ms-search-form button {\n  color: #f2f2f2;\n  font-weight: bold;\n  display: inline-block;\n  width: 35px;\n  height: 35px;\n  font-size: 16px;\n  cursor: pointer;\n}\n\n.ms-search-form button span {\n  position: relative;\n  display: inline-block;\n  transform: rotate(45deg);\n  -webkit-transform: rotate(45deg);\n}\n\n\n.ms-search-form input {\n  background-color: rgba(0, 0, 0, .5);\n  border: 1px solid #777;\n  height: 26px;\n  border-radius: 5px;\n  color: #f2f2f2;\n  font-size: 16px;\n  text-indent: 10px;\n}\n\n.ms-search-form input:focus,\n.ms-search-form button:focus {\n  box-shadow: inset 0 0 0 2px rgba(27, 127, 204, .8);\n}\n.ms-search-form input::-webkit-input-placeholder {\n  color: #777;\n  font-weight: normal;\n  font-style: italic;\n}\n\n.ms-search-form input,\n.ms-search-form .ms-close-button {\n  display: none;\n}\n\n.ms-search-form.ms-search-form-opened input,\n.ms-search-form.ms-search-form-opened .ms-close-button {\n  display: inline-block;\n}\n\n.ms-search-form.ms-search-form-opened .ms-search-button {\n  display: none;\n}\n\n", ""]);

	// exports


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);