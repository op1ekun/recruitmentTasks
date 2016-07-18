/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _uploadView = __webpack_require__(1);
	
	var _uploadView2 = _interopRequireDefault(_uploadView);
	
	var _mosaicView = __webpack_require__(3);
	
	var mosaicView = _interopRequireWildcard(_mosaicView);
	
	var _uploadController = __webpack_require__(5);
	
	var uploadController = _interopRequireWildcard(_uploadController);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var uploadView = new _uploadView2.default(uploadController);
	// const mosaicView = new MosicaView(mosaicController);
	
	mosaicView.init().then(function () {
	    uploadView.onImageRendered = function (renderedImageData) {
	
	        mosaicView.render(renderedImageData).then(function () {
	            console.log('mosaic ready');
	        });
	    };
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _constants = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UploadView = function UploadView(uploadController) {
	    var _this = this;
	
	    var uploadImgSel = arguments.length <= 1 || arguments[1] === undefined ? '#upload-img' : arguments[1];
	    var sourceImgSel = arguments.length <= 2 || arguments[2] === undefined ? '#source-img' : arguments[2];
	
	    _classCallCheck(this, UploadView);
	
	    if (!uploadController) {
	        throw new ReferenceError('controller is undefined');
	    }if ((typeof uploadController === 'undefined' ? 'undefined' : _typeof(uploadController)) !== 'object') {
	        throw new TypeError('controller is not an object');
	    }
	
	    var uploadImgInput = document.querySelector(uploadImgSel);
	    var canvasElem = document.querySelector(sourceImgSel);
	    var ctx = canvasElem.getContext('2d');
	
	    ctx.clearRect(0, 0, _constants.DEFAULT_WIDTH, _constants.DEFAULT_HEIGHT);
	
	    canvasElem.width = _constants.DEFAULT_WIDTH;
	    canvasElem.height = _constants.DEFAULT_HEIGHT;
	
	    this.onImageRendered = null;
	
	    /**
	     * [description]
	     *
	     * @param   {[type]} fileSrc [description]
	     * @returns {[type]}         [description]
	     */
	    var renderImage = function renderImage(fileSrc) {
	        var uploadedImg = new Image();
	
	        return new Promise(function (resolve, reject) {
	
	            uploadedImg.addEventListener('load', function () {
	                // we need caclulated values here to avoid scaling images up
	                var calculatedWidth = uploadedImg.width < _constants.DEFAULT_WIDTH ? uploadedImg.width : _constants.DEFAULT_WIDTH;
	                var calculatedHeight = uploadedImg.height / (uploadedImg.width > _constants.DEFAULT_WIDTH ? uploadedImg.width / _constants.DEFAULT_WIDTH : 1);
	
	                canvasElem.width = calculatedWidth;
	                canvasElem.height = calculatedHeight;
	
	                ctx.drawImage(uploadedImg, 0, 0, calculatedWidth, calculatedHeight);
	
	                var canvasImgData = ctx.getImageData(0, 0, calculatedWidth, calculatedHeight);
	
	                resolve({
	                    canvasImgData: canvasImgData,
	                    calculatedWidth: calculatedWidth,
	                    calculatedHeight: calculatedHeight
	                });
	            });
	
	            uploadedImg.addEventListener('error', reject);
	            uploadedImg.src = fileSrc;
	        });
	    };
	
	    /**
	     * [description]
	     *
	     * @returns {[type]} [description]
	     */
	    var handleOnChange = function handleOnChange() {
	        var fileList = uploadImgInput.files;
	
	        if (!fileList) {
	            return;
	        }
	
	        var fileToUpload = fileList[0];
	
	        // controller handles the upload
	        uploadController.handleFileUpload(fileToUpload)
	        // view handles rendering the image
	        .then(function (fileSrc) {
	            return renderImage(fileSrc);
	        })
	        // and notifying whoever is listenting when ready
	        .then(function (imageData) {
	            _this.onImageRendered(imageData);
	        });
	    };
	
	    uploadImgInput.addEventListener('change', handleOnChange);
	};
	
	exports.default = UploadView;

/***/ },
/* 2 */
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.init = init;
	exports.render = render;
	
	var _constants = __webpack_require__(2);
	
	var _tileService = __webpack_require__(4);
	
	var tileService = _interopRequireWildcard(_tileService);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/* global TILE_WIDTH */
	/* global TILE_HEIGHT */
	
	
	var mosaicElem = void 0;
	
	function init() {
	    var mosaiSelector = arguments.length <= 0 || arguments[0] === undefined ? '#mosaic-img' : arguments[0];
	
	
	    return new Promise(function (resolve, reject) {
	        try {
	            mosaicElem = document.querySelector(mosaiSelector);
	
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
	
	/**
	 * Gets a html string of a single tile.
	 *
	 * @param  {Object} tileData pixel data for the tile
	 * @return {Promise}         a Promise that resolves with html string of a tile
	 */
	function getTile(tileData) {
	    var redColor = [];
	    var greenColor = [];
	    var blueColor = [];
	
	    for (var i = 0, l = tileData.length; i < l; i += 4) {
	        redColor.push(tileData[i]);
	        greenColor.push(tileData[i + 1]);
	        blueColor.push(tileData[i + 2]);
	    }
	
	    var avgHexColor = rgbToHex(avgColor(redColor), avgColor(greenColor), avgColor(blueColor));
	
	    return tileService.getTile(avgHexColor).then(function (tmpl) {
	        return tmpl;
	    }).catch(function (err) {
	        console.error(err);
	        throw new Error('get a tile failed');
	    });
	}
	
	/**
	 * Gets a html string for all tiles that a row is composed of.
	 *
	 * @param  {Number} xTilesCount how many tile the row has
	 * @param  {Number} rowIndex    rowIndex
	 * @param  {Object} rowData     pixel data for the whole row
	 * @param  {Number} canvasWidth the length of the source canvas image
	 * @return {Promise}            a Promise that is resolved with html string of row
	 */
	function getRow(xTilesCount, rowIndex, rowData, canvasWidth) {
	    var tileData = [];
	    var tileDataPromises = [];
	
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
	
	        tileDataPromises.push(getTile(tileData[x]));
	    }
	
	    return Promise.all(tileDataPromises).then(function (svgTiles) {
	        return svgTiles.join('');
	    }).catch(function (err) {
	        console.error(err);
	        throw new Error('getting a row failed');
	    });
	}
	
	/**
	 * Renders the mosaic row by row.
	 *
	 * @param  {Object} mosaicData a bespoke object containg data
	 *                             necessary to render the mosaic
	 * @return {Promise}           resolves with a message when the mosaic is finished
	 */
	function render(mosaicData) {
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
	    var rowsData = [];
	
	    var dataStart = 0;
	    var dataEnd = canvasImgData.width * 4 * TILE_WIDTH;
	
	    // loop thru every row
	    for (var y = 0; y < yTilesCount; y++) {
	        rowsData.push({
	            dataStart: dataStart,
	            dataEnd: dataEnd
	        });
	
	        // "move" range to the next row
	        dataStart = dataEnd;
	        dataEnd = dataStart + canvasImgData.width * 4 * TILE_WIDTH;
	    }
	
	    // the previous version was (pardon my french) a brainfart,
	    // left after I was testing out different options to render rows
	    return rowsData.reduce(function (promise, rowData, index) {
	        return promise.then(function () {
	            return getRow(xTilesCount, index, pixelData.slice(rowData.dataStart, rowData.dataEnd), canvasImgData.width).then(function (rowTmpl) {
	                mosaicElem.innerHTML += rowTmpl;
	            });
	        });
	    }, Promise.resolve());
	}

/***/ },
/* 4 */
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

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.handleFileUpload = handleFileUpload;
	function handleFileUpload(file) {
	
	    return new Promise(function (resolve, reject) {
	        if (!file) {
	            reject(new TypeError('file is undefined'));
	            return;
	        }
	
	        if (!(file instanceof File)) {
	            reject(new TypeError('file is not an instance of File'));
	            return;
	        }
	
	        var fileReader = new FileReader();
	
	        fileReader.addEventListener('load', function () {
	            return resolve(fileReader.result);
	        });
	        fileReader.addEventListener('error', function () {
	            return reject(fileReader.error);
	        });
	
	        fileReader.readAsDataURL(file);
	    });
	}

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzNmYTRjYTA2YTg1YzU3ZDI1N2UiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXBsb2FkVmlldy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9tb3NhaWNWaWV3LmpzIiwid2VicGFjazovLy8uL3NyYy90aWxlU2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXBsb2FkQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDdENBOzs7O0FBQ0E7O0tBQVksVTs7QUFFWjs7S0FBWSxnQjs7Ozs7O0FBRVosS0FBTSxhQUFhLHlCQUFlLGdCQUFmLENBQW5COzs7QUFHQSxZQUFXLElBQVgsR0FDSyxJQURMLENBQ1UsWUFBTTtBQUNSLGdCQUFXLGVBQVgsR0FBNkIsVUFBQyxpQkFBRCxFQUF1Qjs7QUFFaEQsb0JBQVcsTUFBWCxDQUFrQixpQkFBbEIsRUFDSyxJQURMLENBQ1UsWUFBTTtBQUNSLHFCQUFRLEdBQVIsQ0FBWSxjQUFaO0FBQ0gsVUFITDtBQUlILE1BTkQ7QUFPSCxFQVRMLEU7Ozs7Ozs7Ozs7Ozs7O0FDUkE7Ozs7S0FFcUIsVSxHQUVqQixvQkFBWSxnQkFBWixFQUEwRjtBQUFBOztBQUFBLFNBQTVELFlBQTRELHlEQUE3QyxhQUE2QztBQUFBLFNBQTlCLFlBQThCLHlEQUFmLGFBQWU7O0FBQUE7O0FBQ3RGLFNBQUksQ0FBQyxnQkFBTCxFQUF1QjtBQUNuQixlQUFNLElBQUksY0FBSixDQUFt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Q0FBSixFQUE2QjtBQUN6QixvQkFBTyxJQUFJLFNBQUosQ0FBYyxpQ0FBZCxDQUFQO0FBQ0E7QUFDSDs7QUFFRCxhQUFNLGFBQWEsSUFBSSxVQUFKLEVBQW5COztBQUVBLG9CQUFXLGdCQUFYLENBQTRCLE1BQTVCLEVBQW9DO0FBQUEsb0JBQU0sUUFBUSxXQUFXLE1BQW5CLENBQU47QUFBQSxVQUFwQztBQUNBLG9CQUFXLGdCQUFYLENBQTRCLE9BQTVCLEVBQXFDO0FBQUEsb0JBQU0sT0FBTyxXQUFXLEtBQWxCLENBQU47QUFBQSxVQUFyQzs7QUFFQSxvQkFBVyxhQUFYLENBQXlCLElBQXpCO0FBQ0gsTUFqQk0sQ0FBUDtBQWtCSCxFIiwiZmlsZSI6ImNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNzNmYTRjYTA2YTg1YzU3ZDI1N2VcbiAqKi8iLCJpbXBvcnQgVXBsb2FkVmlldyBmcm9tICcuL3VwbG9hZFZpZXcuanMnO1xuaW1wb3J0ICogYXMgbW9zYWljVmlldyBmcm9tICcuL21vc2FpY1ZpZXcuanMnO1xuXG5pbXBvcnQgKiBhcyB1cGxvYWRDb250cm9sbGVyIGZyb20gJy4vdXBsb2FkQ29udHJvbGxlci5qcyc7XG5cbmNvbnN0IHVwbG9hZFZpZXcgPSBuZXcgVXBsb2FkVmlldyh1cGxvYWRDb250cm9sbGVyKTtcbi8vIGNvbnN0IG1vc2FpY1ZpZXcgPSBuZXcgTW9zaWNhVmlldyhtb3NhaWNDb250cm9sbGVyKTtcblxubW9zYWljVmlldy5pbml0KClcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHVwbG9hZFZpZXcub25JbWFnZVJlbmRlcmVkID0gKHJlbmRlcmVkSW1hZ2VEYXRhKSA9PiB7XG5cbiAgICAgICAgICAgIG1vc2FpY1ZpZXcucmVuZGVyKHJlbmRlcmVkSW1hZ2VEYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21vc2FpYyByZWFkeScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYXBwLmpzXG4gKiovIiwiaW1wb3J0IHsgREVGQVVMVF9XSURUSCwgREVGQVVMVF9IRUlHSFQgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVwbG9hZFZpZXcge1xuXG4gICAgY29uc3RydWN0b3IodXBsb2FkQ29udHJvbGxlciwgdXBsb2FkSW1nU2VsID0gJyN1cGxvYWQtaW1nJywgc291cmNlSW1nU2VsID0gJyNzb3VyY2UtaW1nJykge1xuICAgICAgICBpZiAoIXVwbG9hZENvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignY29udHJvbGxlciBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgfSBpZiAodHlwZW9mIHVwbG9hZENvbnRyb2xsZXIgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb250cm9sbGVyIGlzIG5vdCBhbiBvYmplY3QnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVwbG9hZEltZ0lucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih1cGxvYWRJbWdTZWwpO1xuICAgICAgICBjb25zdCBjYW52YXNFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihzb3VyY2VJbWdTZWwpO1xuICAgICAgICBjb25zdCBjdHggPSBjYW52YXNFbGVtLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBERUZBVUxUX1dJRFRILCBERUZBVUxUX0hFSUdIVCk7XG5cbiAgICAgICAgY2FudmFzRWxlbS53aWR0aCA9IERFRkFVTFRfV0lEVEg7XG4gICAgICAgIGNhbnZhc0VsZW0uaGVpZ2h0ID0gREVGQVVMVF9IRUlHSFQ7XG5cbiAgICAgICAgdGhpcy5vbkltYWdlUmVuZGVyZWQgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAgIHtbdHlwZV19IGZpbGVTcmMgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJucyB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHJlbmRlckltYWdlID0gKGZpbGVTcmMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZGVkSW1nID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICB1cGxvYWRlZEltZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBuZWVkIGNhY2x1bGF0ZWQgdmFsdWVzIGhlcmUgdG8gYXZvaWQgc2NhbGluZyBpbWFnZXMgdXBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FsY3VsYXRlZFdpZHRoID0gKHVwbG9hZGVkSW1nLndpZHRoIDwgREVGQVVMVF9XSURUSCA/XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRlZEltZy53aWR0aCA6IERFRkFVTFRfV0lEVEgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWxjdWxhdGVkSGVpZ2h0ID0gKHVwbG9hZGVkSW1nLmhlaWdodCAvICh1cGxvYWRlZEltZy53aWR0aCA+IERFRkFVTFRfV0lEVEggP1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWRJbWcud2lkdGggLyBERUZBVUxUX1dJRFRIIDogMSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhc0VsZW0ud2lkdGggPSBjYWxjdWxhdGVkV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGNhbnZhc0VsZW0uaGVpZ2h0ID0gY2FsY3VsYXRlZEhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKHVwbG9hZGVkSW1nLCAwLCAwLCBjYWxjdWxhdGVkV2lkdGgsIGNhbGN1bGF0ZWRIZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbnZhc0ltZ0RhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIGNhbGN1bGF0ZWRXaWR0aCwgY2FsY3VsYXRlZEhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXNJbWdEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXRlZFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXRlZEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB1cGxvYWRlZEltZy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgdXBsb2FkZWRJbWcuc3JjID0gZmlsZVNyYztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGhhbmRsZU9uQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmlsZUxpc3QgPSB1cGxvYWRJbWdJbnB1dC5maWxlcztcblxuICAgICAgICAgICAgaWYgKCFmaWxlTGlzdCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmlsZVRvVXBsb2FkID0gZmlsZUxpc3RbMF07XG5cbiAgICAgICAgICAgIC8vIGNvbnRyb2xsZXIgaGFuZGxlcyB0aGUgdXBsb2FkXG4gICAgICAgICAgICB1cGxvYWRDb250cm9sbGVyLmhhbmRsZUZpbGVVcGxvYWQoZmlsZVRvVXBsb2FkKVxuICAgICAgICAgICAgICAgIC8vIHZpZXcgaGFuZGxlcyByZW5kZXJpbmcgdGhlIGltYWdlXG4gICAgICAgICAgICAgICAgLnRoZW4oKGZpbGVTcmMpID0+IHJlbmRlckltYWdlKGZpbGVTcmMpKVxuICAgICAgICAgICAgICAgIC8vIGFuZCBub3RpZnlpbmcgd2hvZXZlciBpcyBsaXN0ZW50aW5nIHdoZW4gcmVhZHlcbiAgICAgICAgICAgICAgICAudGhlbigoaW1hZ2VEYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25JbWFnZVJlbmRlcmVkKGltYWdlRGF0YSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdXBsb2FkSW1nSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgaGFuZGxlT25DaGFuZ2UpO1xuICAgIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3VwbG9hZFZpZXcuanNcbiAqKi8iLCJleHBvcnQgY29uc3QgREVGQVVMVF9XSURUSCA9ICh3aW5kb3cuaW5uZXJXaWR0aCAtIDIwKSAvIDI7XHJcbmV4cG9ydCBjb25zdCBERUZBVUxUX0hFSUdIVCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLSAyMCkgLyAyO1xyXG4vLyB0byBhdm9pZCB1c2luZyBtYWdpYyBzdHJpbmdzXHJcbmV4cG9ydCBjb25zdCBzdXBwb3J0ZWRFdmVudHMgPSB7XHJcbiAgICBJTUFHRV9SRU5ERVJFRDogJ2ltYWdlLXJlbmRlcmVkJ1xyXG59XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnN0YW50cy5qc1xuICoqLyIsIi8qIGdsb2JhbCBUSUxFX1dJRFRIICovXHJcbi8qIGdsb2JhbCBUSUxFX0hFSUdIVCAqL1xyXG5pbXBvcnQgeyBERUZBVUxUX1dJRFRILCBERUZBVUxUX0hFSUdIVCB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcclxuaW1wb3J0ICogYXMgdGlsZVNlcnZpY2UgZnJvbSAnLi90aWxlU2VydmljZSc7XHJcblxyXG5sZXQgbW9zYWljRWxlbTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0KG1vc2FpU2VsZWN0b3IgPSAnI21vc2FpYy1pbWcnKSB7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBtb3NhaWNFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihtb3NhaVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgICAgIG1vc2FpY0VsZW0uc3R5bGUud2lkdGggPSBgJHtERUZBVUxUX1dJRFRIfXB4YDtcclxuICAgICAgICAgICAgbW9zYWljRWxlbS5zdHlsZS5oZWlnaHQgPSBgJHtERUZBVUxUX0hFSUdIVH1weGA7XHJcblxyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZ2JUb0hleChyLCBnLCBiKSB7XHJcbiAgICByZXR1cm4gKCgxIDw8IDI0KSArIChyIDw8IDE2KSArIChnIDw8IDgpICsgYikudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhdmdDb2xvcihjb2xvckFycmF5KSB7XHJcbiAgICBjb25zdCBjb2xvclN1bSA9IGNvbG9yQXJyYXkucmVkdWNlKChwcmV2LCBjdXJyKSA9PiBwcmV2ICsgY3Vycik7XHJcbiAgICByZXR1cm4gcGFyc2VJbnQoY29sb3JTdW0gLyBjb2xvckFycmF5Lmxlbmd0aCwgMTApO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0cyBhIGh0bWwgc3RyaW5nIG9mIGEgc2luZ2xlIHRpbGUuXHJcbiAqXHJcbiAqIEBwYXJhbSAge09iamVjdH0gdGlsZURhdGEgcGl4ZWwgZGF0YSBmb3IgdGhlIHRpbGVcclxuICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICBhIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIGh0bWwgc3RyaW5nIG9mIGEgdGlsZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0VGlsZSh0aWxlRGF0YSkge1xyXG4gICAgY29uc3QgcmVkQ29sb3IgPSBbXTtcclxuICAgIGNvbnN0IGdyZWVuQ29sb3IgPSBbXTtcclxuICAgIGNvbnN0IGJsdWVDb2xvciA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGlsZURhdGEubGVuZ3RoOyBpIDwgbDsgaSArPSA0KSB7XHJcbiAgICAgICAgcmVkQ29sb3IucHVzaCh0aWxlRGF0YVtpXSk7XHJcbiAgICAgICAgZ3JlZW5Db2xvci5wdXNoKHRpbGVEYXRhW2kgKyAxXSk7XHJcbiAgICAgICAgYmx1ZUNvbG9yLnB1c2godGlsZURhdGFbaSArIDJdKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhdmdIZXhDb2xvciA9IHJnYlRvSGV4KGF2Z0NvbG9yKHJlZENvbG9yKSwgYXZnQ29sb3IoZ3JlZW5Db2xvciksIGF2Z0NvbG9yKGJsdWVDb2xvcikpO1xyXG5cclxuICAgIHJldHVybiB0aWxlU2VydmljZS5nZXRUaWxlKGF2Z0hleENvbG9yKVxyXG4gICAgICAgIC50aGVuKCh0bXBsKSA9PiB0bXBsKVxyXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdnZXQgYSB0aWxlIGZhaWxlZCcpO1xyXG4gICAgICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0cyBhIGh0bWwgc3RyaW5nIGZvciBhbGwgdGlsZXMgdGhhdCBhIHJvdyBpcyBjb21wb3NlZCBvZi5cclxuICpcclxuICogQHBhcmFtICB7TnVtYmVyfSB4VGlsZXNDb3VudCBob3cgbWFueSB0aWxlIHRoZSByb3cgaGFzXHJcbiAqIEBwYXJhbSAge051bWJlcn0gcm93SW5kZXggICAgcm93SW5kZXhcclxuICogQHBhcmFtICB7T2JqZWN0fSByb3dEYXRhICAgICBwaXhlbCBkYXRhIGZvciB0aGUgd2hvbGUgcm93XHJcbiAqIEBwYXJhbSAge051bWJlcn0gY2FudmFzV2lkdGggdGhlIGxlbmd0aCBvZiB0aGUgc291cmNlIGNhbnZhcyBpbWFnZVxyXG4gKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgIGEgUHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdpdGggaHRtbCBzdHJpbmcgb2Ygcm93XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSb3coeFRpbGVzQ291bnQsIHJvd0luZGV4LCByb3dEYXRhLCBjYW52YXNXaWR0aCkge1xyXG4gICAgY29uc3QgdGlsZURhdGEgPSBbXTtcclxuICAgIGNvbnN0IHRpbGVEYXRhUHJvbWlzZXMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHhUaWxlc0NvdW50OyB4KyspIHtcclxuICAgICAgICB0aWxlRGF0YVt4XSA9IFtdO1xyXG5cclxuICAgICAgICAvLyBnZXQgYSBibG9jayBkYXRhIGZvciBhIHRpbGUgKGV4YW1wbGUgNHg0IHRpbGUpXHJcbiAgICAgICAgLy8gW3IsZyxiLGFdIFtyLGcsYixhXSBbcixnLGIsYV0gW3IsZyxiLGFdICg0IHZhbHVlcyBmb3IgZWFjaCBwaXhlbClcclxuICAgICAgICBsZXQgZGF0YVN0YXJ0ID0geCAqIFRJTEVfV0lEVEggKiA0O1xyXG4gICAgICAgIGxldCBkYXRhRW5kID0gZGF0YVN0YXJ0ICsgKFRJTEVfV0lEVEggKiA0KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgdGlsZVJvd0luZGV4ID0gMDsgdGlsZVJvd0luZGV4IDw9IFRJTEVfV0lEVEg7IHRpbGVSb3dJbmRleCsrKSB7XHJcbiAgICAgICAgICAgIHRpbGVEYXRhW3hdID0gdGlsZURhdGFbeF0uY29uY2F0KHJvd0RhdGEuc2xpY2UoZGF0YVN0YXJ0LCBkYXRhRW5kKSk7XHJcbiAgICAgICAgICAgIGRhdGFTdGFydCA9ICgodGlsZVJvd0luZGV4ICsgMSkgKiBjYW52YXNXaWR0aCAqIDQpICsgKHggKiBUSUxFX1dJRFRIICogNCk7XHJcbiAgICAgICAgICAgIGRhdGFFbmQgPSBkYXRhU3RhcnQgKyAoVElMRV9XSURUSCAqIDQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGlsZURhdGFQcm9taXNlcy5wdXNoKGdldFRpbGUodGlsZURhdGFbeF0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwodGlsZURhdGFQcm9taXNlcylcclxuICAgICAgICAudGhlbigoc3ZnVGlsZXMpID0+IHN2Z1RpbGVzLmpvaW4oJycpKVxyXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdnZXR0aW5nIGEgcm93IGZhaWxlZCcpO1xyXG4gICAgICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogUmVuZGVycyB0aGUgbW9zYWljIHJvdyBieSByb3cuXHJcbiAqXHJcbiAqIEBwYXJhbSAge09iamVjdH0gbW9zYWljRGF0YSBhIGJlc3Bva2Ugb2JqZWN0IGNvbnRhaW5nIGRhdGFcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5lY2Vzc2FyeSB0byByZW5kZXIgdGhlIG1vc2FpY1xyXG4gKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgcmVzb2x2ZXMgd2l0aCBhIG1lc3NhZ2Ugd2hlbiB0aGUgbW9zYWljIGlzIGZpbmlzaGVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKG1vc2FpY0RhdGEpIHtcclxuICAgIG1vc2FpY0VsZW0uaW5uZXJIVE1MID0gJyc7XHJcbiAgICBtb3NhaWNFbGVtLnN0eWxlLndpZHRoID0gYCR7bW9zYWljRGF0YS5jYWxjdWxhdGVkV2lkdGh9cHhgO1xyXG4gICAgbW9zYWljRWxlbS5zdHlsZS5oZWlnaHQgPSBgJHttb3NhaWNEYXRhLmNhbGN1bGF0ZWRIZWlnaHR9cHhgO1xyXG5cclxuICAgIGNvbnN0IGNhbnZhc0ltZ0RhdGEgPSBtb3NhaWNEYXRhLmNhbnZhc0ltZ0RhdGE7XHJcbiAgICAvLyBjb252ZXJ0IHRoZSBjbGFtcGxlZCBhcnJheSB0byBhIHJlZ3VsYXIgb25lXHJcbiAgICBjb25zdCBwaXhlbERhdGEgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChjYW52YXNJbWdEYXRhLmRhdGEpO1xyXG5cclxuICAgIC8vIGhvcml6b250YWwgdGlsZXNcclxuICAgIGNvbnN0IHhUaWxlc0NvdW50ID0gTWF0aC5mbG9vcihjYW52YXNJbWdEYXRhLndpZHRoIC8gVElMRV9XSURUSCk7XHJcbiAgICAvLyB2ZXJ0aWNhbCB0aWxlc1xyXG4gICAgY29uc3QgeVRpbGVzQ291bnQgPSBNYXRoLmZsb29yKGNhbnZhc0ltZ0RhdGEuaGVpZ2h0IC8gVElMRV9IRUlHSFQpO1xyXG4gICAgY29uc3Qgcm93c0RhdGEgPSBbXTtcclxuXHJcbiAgICBsZXQgZGF0YVN0YXJ0ID0gMDtcclxuICAgIGxldCBkYXRhRW5kID0gY2FudmFzSW1nRGF0YS53aWR0aCAqIDQgKiBUSUxFX1dJRFRIO1xyXG5cclxuICAgIC8vIGxvb3AgdGhydSBldmVyeSByb3dcclxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgeVRpbGVzQ291bnQ7IHkrKykge1xyXG4gICAgICAgIHJvd3NEYXRhLnB1c2goe1xyXG4gICAgICAgICAgICBkYXRhU3RhcnQsXHJcbiAgICAgICAgICAgIGRhdGFFbmQsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFwibW92ZVwiIHJhbmdlIHRvIHRoZSBuZXh0IHJvd1xyXG4gICAgICAgIGRhdGFTdGFydCA9IGRhdGFFbmQ7XHJcbiAgICAgICAgZGF0YUVuZCA9IGRhdGFTdGFydCArIGNhbnZhc0ltZ0RhdGEud2lkdGggKiA0ICogVElMRV9XSURUSDtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGUgcHJldmlvdXMgdmVyc2lvbiB3YXMgKHBhcmRvbiBteSBmcmVuY2gpIGEgYnJhaW5mYXJ0LFxyXG4gICAgLy8gbGVmdCBhZnRlciBJIHdhcyB0ZXN0aW5nIG91dCBkaWZmZXJlbnQgb3B0aW9ucyB0byByZW5kZXIgcm93c1xyXG4gICAgcmV0dXJuIHJvd3NEYXRhLnJlZHVjZSgocHJvbWlzZSwgcm93RGF0YSwgaW5kZXgpID0+XHJcbiAgICAgICAgcHJvbWlzZS50aGVuKCgpID0+IGdldFJvdyhcclxuICAgICAgICAgICAgICAgIHhUaWxlc0NvdW50LFxyXG4gICAgICAgICAgICAgICAgaW5kZXgsXHJcbiAgICAgICAgICAgICAgICBwaXhlbERhdGEuc2xpY2Uocm93RGF0YS5kYXRhU3RhcnQsIHJvd0RhdGEuZGF0YUVuZCksXHJcbiAgICAgICAgICAgICAgICBjYW52YXNJbWdEYXRhLndpZHRoKVxyXG4gICAgICAgICAgICAudGhlbigocm93VG1wbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbW9zYWljRWxlbS5pbm5lckhUTUwgKz0gcm93VG1wbDtcclxuICAgICAgICAgICAgfSlcclxuICAgICksIFByb21pc2UucmVzb2x2ZSgpKTtcclxufVxyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9tb3NhaWNWaWV3LmpzXG4gKiovIiwiZnVuY3Rpb24gaGFuZGxlRXJyb3IocmVzcG9uc2UpIHtcclxuXHJcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXNwb25zZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbGUoaGV4Q29sb3IpIHtcclxuXHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHdlIHdhbnQgdG8gYmUgYWJsZSB0byBQcm9taXNlLmNhdGNoIHRoaXMgZXJyb3JcclxuICAgICAgICAgICAgaWYgKCFoZXhDb2xvciB8fCAhaGV4Q29sb3IubWF0Y2goL15bMC05YS1mQS1GXXs2fSQvKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncGFzc2VkIHZhbHVlIGlzIG5vdCBhIGhleGFkZWNpbWFsIGNvbG9yJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmZXRjaChgL2NvbG9yLyR7aGV4Q29sb3J9YClcclxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZUVycm9yKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UudGV4dCgpKTtcclxuICAgICAgICB9KTtcclxufVxyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy90aWxlU2VydmljZS5qc1xuICoqLyIsImV4cG9ydCBmdW5jdGlvbiBoYW5kbGVGaWxlVXBsb2FkKGZpbGUpIHtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGlmICghZmlsZSkge1xyXG4gICAgICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignZmlsZSBpcyB1bmRlZmluZWQnKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghKGZpbGUgaW5zdGFuY2VvZiBGaWxlKSkge1xyXG4gICAgICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignZmlsZSBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgRmlsZScpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG4gICAgICAgIGZpbGVSZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHJlc29sdmUoZmlsZVJlYWRlci5yZXN1bHQpKTtcclxuICAgICAgICBmaWxlUmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4gcmVqZWN0KGZpbGVSZWFkZXIuZXJyb3IpKTtcclxuXHJcbiAgICAgICAgZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICAgfSk7XHJcbn1cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdXBsb2FkQ29udHJvbGxlci5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=