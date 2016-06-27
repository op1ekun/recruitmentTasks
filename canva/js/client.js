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

	var _constants = __webpack_require__(1);

	var _uploadView = __webpack_require__(2);

	var uploadView = _interopRequireWildcard(_uploadView);

	var _mosaicView = __webpack_require__(4);

	var mosaicView = _interopRequireWildcard(_mosaicView);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	uploadView.init().then(mosaicView.init).then(function () {
	    // process uploaded images
	    uploadView.on(_constants.supportedEvents.IMAGE_RENDERED, function (renderedImageData) {

	        mosaicView.render(renderedImageData).then(function () {
	            console.log('mosaic ready');
	        });
	    });
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var DEFAULT_WIDTH = exports.DEFAULT_WIDTH = (window.innerWidth - 20) / 2;
	var DEFAULT_HEIGHT = exports.DEFAULT_HEIGHT = (window.innerHeight - 20) / 2;
	// to avoid using magic strings
	var supportedEvents = exports.supportedEvents = {
	    IMAGE_RENDERED: 'image-rendered'
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.init = init;
	exports.on = on;

	var _constants = __webpack_require__(1);

	var _pubsub = __webpack_require__(3);

	var _pubsub2 = _interopRequireDefault(_pubsub);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var emitter = new _pubsub2.default();

	var uploadImgInput = void 0;
	var canvasElem = void 0;
	var ctx = void 0;

	function handleFileUpload() {
	    var fileList = this.files;

	    if (!fileList) {
	        return;
	    }

	    var fileToUpload = fileList[0];
	    var fileReader = new FileReader();
	    var uploadedImg = new Image();

	    function handleReaderOnload() {
	        uploadedImg.src = fileReader.result;
	        fileReader.removeEventListener('load', handleReaderOnload);
	    }

	    function handleImgOnload() {
	        // we need caclulated values here to avoid scaling images up
	        var calculatedWidth = uploadedImg.width < _constants.DEFAULT_WIDTH ? uploadedImg.width : _constants.DEFAULT_WIDTH;
	        var calculatedHeight = uploadedImg.height / (uploadedImg.width > _constants.DEFAULT_WIDTH ? uploadedImg.width / _constants.DEFAULT_WIDTH : 1);

	        canvasElem.width = calculatedWidth;
	        canvasElem.height = calculatedHeight;

	        ctx.drawImage(uploadedImg, 0, 0, calculatedWidth, calculatedHeight);

	        var canvasImgData = ctx.getImageData(0, 0, calculatedWidth, calculatedHeight);

	        emitter.publish(_constants.supportedEvents.IMAGE_RENDERED, {
	            canvasImgData: canvasImgData,
	            calculatedWidth: calculatedWidth,
	            calculatedHeight: calculatedHeight
	        });

	        uploadedImg.removeEventListener('load', handleFileUpload);
	    }

	    fileReader.addEventListener('load', handleReaderOnload);
	    uploadedImg.addEventListener('load', handleImgOnload);

	    fileReader.readAsDataURL(fileToUpload);
	}

	function init() {

	    return new Promise(function (resolve, reject) {
	        try {
	            uploadImgInput = document.querySelector('#upload-img');
	            canvasElem = document.querySelector('#source-img');
	            ctx = canvasElem.getContext('2d');

	            ctx.clearRect(0, 0, _constants.DEFAULT_WIDTH, _constants.DEFAULT_HEIGHT);

	            canvasElem.width = _constants.DEFAULT_WIDTH;
	            canvasElem.height = _constants.DEFAULT_HEIGHT;

	            uploadImgInput.addEventListener('change', handleFileUpload);
	            resolve();
	        } catch (err) {
	            reject(err);
	        }
	    });
	}

	function on() {
	    emitter.subscribe.apply(emitter, arguments);
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PubSub = function () {
	    function PubSub() {
	        _classCallCheck(this, PubSub);

	        // store subsribers
	        this.subscribers = {};
	        // start unique ids from 1
	        this.uniqueId = 1;
	    }

	    /**
	     * Subscribe a single subscribe to the notification event
	     * @param  {String}   notification  a notification message
	     * @param  {Function} callback      subscriber's callback
	     * @return {String}   id            an alplahumeric identificator the subscriber
	     *                                  used to unsubscribe
	     */


	    _createClass(PubSub, [{
	        key: "subscribe",
	        value: function subscribe(notification, callback) {
	            if (!this.subscribers[notification]) {
	                this.subscribers[notification] = [];
	            }

	            var id = this.uniqueId.toString();
	            this.uniqueId++;

	            this.subscribers[notification].push({
	                id: id,
	                callback: callback
	            });

	            return id;
	        }

	        /**
	         * Publish notification, notify all the subscribers
	         * @param  {String} notification    a notification message
	         * @return undefined
	         */

	    }, {
	        key: "publish",
	        value: function publish(notification) {
	            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                args[_key - 1] = arguments[_key];
	            }

	            var list = this.subscribers[notification];

	            if (!list) {
	                return;
	            }

	            // run callback asynchronously
	            setTimeout(function () {
	                // loop through the list of subcsribers
	                for (var i = 0, l = list.length; i < l; i++) {
	                    var _list$i;

	                    // run the callback with sin
	                    (_list$i = list[i]).callback.apply(_list$i, args);
	                }
	            }, 0);
	        }

	        /**
	         * Unsubscribe a single subscriber
	         * @param  {String}  id     alphanumeric id of a subscriber
	         * @return {Boolean}        true if successfully removed
	         *                          false if subscriber wasn't removed
	         */

	    }, {
	        key: "unsubscribe",
	        value: function unsubscribe(id) {
	            for (var notification in this.subscribers) {

	                for (var i = 0, l = this.subscribers[notification].length; i < l; i++) {
	                    if (this.subscribers[notification][i].id === id) {
	                        this.subscribers[notification].splice(i, 1);
	                        return true;
	                    }
	                }
	            }

	            return false;
	        }
	    }]);

	    return PubSub;
	}();

	exports.default = PubSub;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.init = init;
	exports.render = render;

	var _constants = __webpack_require__(1);

	var _tileService = __webpack_require__(5);

	var tileService = _interopRequireWildcard(_tileService);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/* global TILE_WIDTH */
	/* global TILE_HEIGHT */


	var mosaicElem = void 0;

	function init() {

	    return new Promise(function (resolve, reject) {
	        try {
	            mosaicElem = document.querySelector('#mosaic-img');

	            mosaicElem.style.width = _constants.DEFAULT_WIDTH + 'px';
	            mosaicElem.style.height = _constants.DEFAULT_HEIGHT + 'px';

	            resolve();
	        } catch (err) {
	            reject(err);
	        }
	    });
	}

	function rgbToHex(r, g, b) {
	    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}

	function avgColor(colorArray) {
	    var colorSum = colorArray.reduce(function (prev, curr) {
	        return prev + curr;
	    });
	    return parseInt(colorSum / colorArray.length, 10);
	}

	function getTile(x, y, tileData) {
	    var redColor = [];
	    var greenColor = [];
	    var blueColor = [];

	    // each pixel color is composed of 4 values
	    for (var i = 0, l = tileData.length; i < l; i += 4) {
	        redColor.push(tileData[i]);
	        greenColor.push(tileData[i + 1]);
	        blueColor.push(tileData[i + 2]);
	    }

	    var avgHexColor = rgbToHex(avgColor(redColor), avgColor(greenColor), avgColor(blueColor));

	    return tileService.getTile(avgHexColor).then(function (tmpl) {
	        return tmpl;
	    }).catch(function (err) {
	        console.error('getTile', err);
	    });
	}

	function getRow(xTilesCount, y, rowData, canvasWidth) {
	    var tileData = [];
	    var tilePromises = [];

	    for (var x = 0; x < xTilesCount; x++) {
	        tileData[x] = [];

	        // get a block data for a tile (example 4x4 tile)
	        // [r,g,b,a] [r,g,b,a] [r,g,b,a] [r,g,b,a] (4 values for each pixel)
	        var dataStart = x * TILE_WIDTH * 4;
	        var dataEnd = dataStart + TILE_WIDTH * 4;

	        for (var tileRowIndex = 0; tileRowIndex <= TILE_WIDTH; tileRowIndex++) {
	            tileData[x] = tileData[x].concat(rowData.slice(dataStart, dataEnd));
	            dataStart = (tileRowIndex + 1) * canvasWidth * 4 + x * TILE_WIDTH * 4;
	            dataEnd = dataStart + TILE_WIDTH * 4;
	        }

	        tilePromises.push(getTile(x, y, tileData[x]));
	    }

	    return Promise.all(tilePromises).then(function (svgTiles) {
	        return svgTiles.join('');
	    }).catch(function (err) {
	        console.error('getRow', err);
	    });
	}

	function render(mosaicData) {
	    // reset before rendering
	    mosaicElem.innerHTML = '';
	    mosaicElem.style.width = mosaicData.calculatedWidth + 'px';
	    mosaicElem.style.height = mosaicData.calculatedHeight + 'px';

	    var canvasImgData = mosaicData.canvasImgData;
	    // convert the clampled array to a regular one
	    var pixelData = Array.prototype.slice.call(canvasImgData.data);

	    // horizontal tiles
	    var xTilesCount = Math.floor(canvasImgData.width / TILE_WIDTH);
	    // vertical tiles
	    var yTilesCount = Math.floor(canvasImgData.height / TILE_HEIGHT);
	    var rowPromises = [];

	    var dataStart = 0;
	    var dataEnd = canvasImgData.width * 4 * TILE_WIDTH;

	    // loop thru every row
	    for (var y = 0; y < yTilesCount; y++) {
	        rowPromises.push(getRow(xTilesCount, y, pixelData.slice(dataStart, dataEnd), canvasImgData.width));
	        // "move" range to the next row
	        dataStart = dataEnd;
	        dataEnd = dataStart + canvasImgData.width * 4 * TILE_WIDTH;
	    }

	    return rowPromises
	    // keep rows rendering async, but retain the order
	    .reduce(function (prevPromise, currPromise) {
	        return prevPromise.then(function (svgTiles) {
	            // eslint-disable-line arrow-body-style

	            // optimization to smoothen the rendering of the rows
	            return new Promise(function (resolve) {
	                setTimeout(function () {
	                    mosaicElem.innerHTML += svgTiles;
	                    resolve();
	                }, 50);
	            }).then(function () {
	                return currPromise;
	            });
	        });
	    })
	    // still need to process the "reduced" one
	    .then(function (svgTiles) {
	        mosaicElem.innerHTML += svgTiles;
	    });
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getTile = getTile;
	function handleError(response) {

	    if (!response.ok) {
	        throw new Error(response.statusText);
	    }

	    return response;
	}

	function getTile(hexColor) {

	    return Promise.resolve().then(function () {
	        // we want to be able to Promise.catch this error
	        if (!hexColor || !hexColor.match(/^[0-9a-fA-F]{6}$/)) {
	            throw new TypeError('passed value is not a hexadecimal color');
	        }

	        return fetch('/color/' + hexColor).then(handleError).then(function (response) {
	            return response.text();
	        });
	    });
	}

/***/ }
/******/ ]);