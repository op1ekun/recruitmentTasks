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
	
	var uploadView = _interopRequireWildcard(_uploadView);
	
	var _mosaicView = __webpack_require__(4);
	
	var mosaicView = _interopRequireWildcard(_mosaicView);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	uploadView.init().then(mosaicView.init).then(function () {
	    // process uploaded images
	    uploadView.eventHandlers.onImageRendered = function (renderedImageData) {
	
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
	exports.eventHandlers = undefined;
	exports.init = init;
	
	var _constants = __webpack_require__(2);
	
	var _uploadController = __webpack_require__(3);
	
	var uploadController = _interopRequireWildcard(_uploadController);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var canvasElem = void 0;
	
	// TODO pass controller to the constructor
	
	var ctx = void 0;
	
	var eventHandlers = exports.eventHandlers = {
	    onImageRendered: null
	};
	
	function renderImage(fileSrc) {
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
	}
	
	function handleOnChange() {
	    var fileList = this.files;
	
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
	        eventHandlers.onImageRendered(imageData);
	    });
	}
	
	/**
	 * Initialized the file upload view.
	 *
	 * @param   {String} uploadImgSel   a CSS selector for uploaded image container
	 * @param   {String} sourceImgSel   a CSS selector for source image container
	 * @returns {Promise}               a Promise that resolves successfuly when initialization succeeds
	 */
	function init() {
	    var uploadImgSel = arguments.length <= 0 || arguments[0] === undefined ? '#upload-img' : arguments[0];
	    var sourceImgSel = arguments.length <= 1 || arguments[1] === undefined ? '#source-img' : arguments[1];
	
	
	    // I have to defend my choice to use Promises for synchronous code,
	    // this is done for the interface consistency.
	    //
	    // In my career I've already have a number of conversation when we discussed this "issue".
	    // As a developer I would rather have consistency
	    // than strict separate behaviour for both sync and async.
	    return new Promise(function (resolve, reject) {
	        try {
	            var uploadImgInput = document.querySelector(uploadImgSel);
	            canvasElem = document.querySelector(sourceImgSel);
	            ctx = canvasElem.getContext('2d');
	
	            ctx.clearRect(0, 0, _constants.DEFAULT_WIDTH, _constants.DEFAULT_HEIGHT);
	
	            canvasElem.width = _constants.DEFAULT_WIDTH;
	            canvasElem.height = _constants.DEFAULT_HEIGHT;
	
	            uploadImgInput.addEventListener('change', handleOnChange);
	
	            resolve();
	        } catch (err) {
	            reject(err);
	        }
	    });
	}

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.init = init;
	exports.render = render;
	
	var _constants = __webpack_require__(2);
	
	var _tileService = __webpack_require__(5);
	
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjYyNWIxNDJlYjg1ZDlmOGMwYTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXBsb2FkVmlldy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy91cGxvYWRDb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9tb3NhaWNWaWV3LmpzIiwid2VicGFjazovLy8uL3NyYy90aWxlU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDdENBOztLQUFZLFU7O0FBQ1o7O0tBQVksVTs7OztBQUVaLFlBQVcsSUFBWCxHQUNLLElBREwsQ0FDVSxXQUFXLElBRHJCLEVBRUssSUFGTCxDQUVVLFlBQU07O0FBRVIsZ0JBQVcsYUFBWCxDQUF5QixlQUF6QixHQUEyQyxVQUFDLGlCQUFELEVBQXVCOztBQUU5RCxvQkFBVyxNQUFYLENBQWtCLGlCQUFsQixFQUNLLElBREwsQ0FDVSxZQUFNO0FBQ1IscUJBQVEsR0FBUixDQUFZLGNBQVo7QUFDSCxVQUhMO0FBSUgsTUFORDtBQU9ILEVBWEwsRTs7Ozs7Ozs7Ozs7O1NDa0VnQixJLEdBQUEsSTs7QUFyRWhCOztBQUdBOztLQUFZLGdCOzs7O0FBRVosS0FBSSxtQkFBSjs7OztBQUNBLEtBQUksWUFBSjs7QUFFTyxLQUFNLHdDQUFnQjtBQUN6QixzQkFBaUI7QUFEUSxFQUF0Qjs7QUFJUCxVQUFTLFdBQVQsQ0FBcUIsT0FBckIsRUFBOEI7QUFDMUIsU0FBTSxjQUFjLElBQUks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O0FBRTlCLFlBQU8sUUFBUSxPQUFSLEdBQ0YsSUFERSxDQUNHLFlBQU07O0FBRVIsYUFBSSxDQUFDLFFBQUQsSUFBYSxDQUFDLFNBQVMsS0FBVCxDQUFlLGtCQUFmLENBQWxCLEVBQXNEO0FBQ2xELG1CQUFNLElBQUksU0FBSixDQUFjLHlDQUFkLENBQU47QUFDSDs7QUFFRCxnQkFBTyxrQkFBZ0IsUUFBaEIsRUFDRixJQURFLENBQ0csV0FESCxFQUVGLElBRkUsQ0FFRztBQUFBLG9CQUFZLFNBQVMsSUFBVCxFQUFaO0FBQUEsVUFGSCxDQUFQO0FBR0gsTUFWRSxDQUFQO0FBV0gsRSIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGY2MjViMTQyZWI4NWQ5ZjhjMGExXG4gKiovIiwiaW1wb3J0ICogYXMgdXBsb2FkVmlldyBmcm9tICcuL3VwbG9hZFZpZXcuanMnO1xuaW1wb3J0ICogYXMgbW9zYWljVmlldyBmcm9tICcuL21vc2FpY1ZpZXcuanMnO1xuXG51cGxvYWRWaWV3LmluaXQoKVxuICAgIC50aGVuKG1vc2FpY1ZpZXcuaW5pdClcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIHByb2Nlc3MgdXBsb2FkZWQgaW1hZ2VzXG4gICAgICAgIHVwbG9hZFZpZXcuZXZlbnRIYW5kbGVycy5vbkltYWdlUmVuZGVyZWQgPSAocmVuZGVyZWRJbWFnZURhdGEpID0+IHtcblxuICAgICAgICAgICAgbW9zYWljVmlldy5yZW5kZXIocmVuZGVyZWRJbWFnZURhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbW9zYWljIHJlYWR5Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hcHAuanNcbiAqKi8iLCJpbXBvcnQgeyBERUZBVUxUX1dJRFRILCBERUZBVUxUX0hFSUdIVCB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcblxuLy8gVE9ETyBwYXNzIGNvbnRyb2xsZXIgdG8gdGhlIGNvbnN0cnVjdG9yXG5pbXBvcnQgKiBhcyB1cGxvYWRDb250cm9sbGVyIGZyb20gJy4vdXBsb2FkQ29udHJvbGxlci5qcyc7XG5cbmxldCBjYW52YXNFbGVtO1xubGV0IGN0eDtcblxuZXhwb3J0IGNvbnN0IGV2ZW50SGFuZGxlcnMgPSB7XG4gICAgb25JbWFnZVJlbmRlcmVkOiBudWxsLFxufTtcblxuZnVuY3Rpb24gcmVuZGVySW1hZ2UoZmlsZVNyYykge1xuICAgIGNvbnN0IHVwbG9hZGVkSW1nID0gbmV3IEltYWdlKCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIHVwbG9hZGVkSW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyB3ZSBuZWVkIGNhY2x1bGF0ZWQgdmFsdWVzIGhlcmUgdG8gYXZvaWQgc2NhbGluZyBpbWFnZXMgdXBcbiAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRXaWR0aCA9ICh1cGxvYWRlZEltZy53aWR0aCA8IERFRkFVTFRfV0lEVEggP1xuICAgICAgICAgICAgICAgIHVwbG9hZGVkSW1nLndpZHRoIDogREVGQVVMVF9XSURUSCk7XG4gICAgICAgICAgICBjb25zdCBjYWxjdWxhdGVkSGVpZ2h0ID0gKHVwbG9hZGVkSW1nLmhlaWdodCAvICh1cGxvYWRlZEltZy53aWR0aCA+IERFRkFVTFRfV0lEVEggP1xuICAgICAgICAgICAgICAgIHVwbG9hZGVkSW1nLndpZHRoIC8gREVGQVVMVF9XSURUSCA6IDEpKTtcblxuICAgICAgICAgICAgY2FudmFzRWxlbS53aWR0aCA9IGNhbGN1bGF0ZWRXaWR0aDtcbiAgICAgICAgICAgIGNhbnZhc0VsZW0uaGVpZ2h0ID0gY2FsY3VsYXRlZEhlaWdodDtcblxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSh1cGxvYWRlZEltZywgMCwgMCwgY2FsY3VsYXRlZFdpZHRoLCBjYWxjdWxhdGVkSGVpZ2h0KTtcblxuICAgICAgICAgICAgY29uc3QgY2FudmFzSW1nRGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgY2FsY3VsYXRlZFdpZHRoLCBjYWxjdWxhdGVkSGVpZ2h0KTtcblxuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgY2FudmFzSW1nRGF0YSxcbiAgICAgICAgICAgICAgICBjYWxjdWxhdGVkV2lkdGgsXG4gICAgICAgICAgICAgICAgY2FsY3VsYXRlZEhlaWdodCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB1cGxvYWRlZEltZy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgIHVwbG9hZGVkSW1nLnNyYyA9IGZpbGVTcmM7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU9uQ2hhbmdlKCkge1xuICAgIGNvbnN0IGZpbGVMaXN0ID0gdGhpcy5maWxlcztcblxuICAgIGlmICghZmlsZUxpc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVUb1VwbG9hZCA9IGZpbGVMaXN0WzBdO1xuXG4gICAgLy8gY29udHJvbGxlciBoYW5kbGVzIHRoZSB1cGxvYWRcbiAgICB1cGxvYWRDb250cm9sbGVyLmhhbmRsZUZpbGVVcGxvYWQoZmlsZVRvVXBsb2FkKVxuICAgICAgICAvLyB2aWV3IGhhbmRsZXMgcmVuZGVyaW5nIHRoZSBpbWFnZVxuICAgICAgICAudGhlbigoZmlsZVNyYykgPT4gcmVuZGVySW1hZ2UoZmlsZVNyYykpXG4gICAgICAgIC8vIGFuZCBub3RpZnlpbmcgd2hvZXZlciBpcyBsaXN0ZW50aW5nIHdoZW4gcmVhZHlcbiAgICAgICAgLnRoZW4oKGltYWdlRGF0YSkgPT4ge1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVycy5vbkltYWdlUmVuZGVyZWQoaW1hZ2VEYXRhKTtcbiAgICAgICAgfSk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZWQgdGhlIGZpbGUgdXBsb2FkIHZpZXcuXG4gKlxuICogQHBhcmFtICAge1N0cmluZ30gdXBsb2FkSW1nU2VsICAgYSBDU1Mgc2VsZWN0b3IgZm9yIHVwbG9hZGVkIGltYWdlIGNvbnRhaW5lclxuICogQHBhcmFtICAge1N0cmluZ30gc291cmNlSW1nU2VsICAgYSBDU1Mgc2VsZWN0b3IgZm9yIHNvdXJjZSBpbWFnZSBjb250YWluZXJcbiAqIEByZXR1cm5zIHtQcm9taXNlfSAgICAgICAgICAgICAgIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHN1Y2Nlc3NmdWx5IHdoZW4gaW5pdGlhbGl6YXRpb24gc3VjY2VlZHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQodXBsb2FkSW1nU2VsID0gJyN1cGxvYWQtaW1nJywgc291cmNlSW1nU2VsID0gJyNzb3VyY2UtaW1nJykge1xuXG4gICAgLy8gSSBoYXZlIHRvIGRlZmVuZCBteSBjaG9pY2UgdG8gdXNlIFByb21pc2VzIGZvciBzeW5jaHJvbm91cyBjb2RlLFxuICAgIC8vIHRoaXMgaXMgZG9uZSBmb3IgdGhlIGludGVyZmFjZSBjb25zaXN0ZW5jeS5cbiAgICAvL1xuICAgIC8vIEluIG15IGNhcmVlciBJJ3ZlIGFscmVhZHkgaGF2ZSBhIG51bWJlciBvZiBjb252ZXJzYXRpb24gd2hlbiB3ZSBkaXNjdXNzZWQgdGhpcyBcImlzc3VlXCIuXG4gICAgLy8gQXMgYSBkZXZlbG9wZXIgSSB3b3VsZCByYXRoZXIgaGF2ZSBjb25zaXN0ZW5jeVxuICAgIC8vIHRoYW4gc3RyaWN0IHNlcGFyYXRlIGJlaGF2aW91ciBmb3IgYm90aCBzeW5jIGFuZCBhc3luYy5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdXBsb2FkSW1nSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHVwbG9hZEltZ1NlbCk7XG4gICAgICAgICAgICBjYW52YXNFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihzb3VyY2VJbWdTZWwpO1xuICAgICAgICAgICAgY3R4ID0gY2FudmFzRWxlbS5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIERFRkFVTFRfV0lEVEgsIERFRkFVTFRfSEVJR0hUKTtcblxuICAgICAgICAgICAgY2FudmFzRWxlbS53aWR0aCA9IERFRkFVTFRfV0lEVEg7XG4gICAgICAgICAgICBjYW52YXNFbGVtLmhlaWdodCA9IERFRkFVTFRfSEVJR0hUO1xuXG4gICAgICAgICAgICB1cGxvYWRJbWdJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBoYW5kbGVPbkNoYW5nZSk7XG5cbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdXBsb2FkVmlldy5qc1xuICoqLyIsImV4cG9ydCBjb25zdCBERUZBVUxUX1dJRFRIID0gKHdpbmRvdy5pbm5lcldpZHRoIC0gMjApIC8gMjtcclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSEVJR0hUID0gKHdpbmRvdy5pbm5lckhlaWdodCAtIDIwKSAvIDI7XHJcbi8vIHRvIGF2b2lkIHVzaW5nIG1hZ2ljIHN0cmluZ3NcclxuZXhwb3J0IGNvbnN0IHN1cHBvcnRlZEV2ZW50cyA9IHtcclxuICAgIElNQUdFX1JFTkRFUkVEOiAnaW1hZ2UtcmVuZGVyZWQnXHJcbn1cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29uc3RhbnRzLmpzXG4gKiovIiwiZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUZpbGVVcGxvYWQoZmlsZSkge1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdmaWxlIGlzIHVuZGVmaW5lZCcpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCEoZmlsZSBpbnN0YW5jZW9mIEZpbGUpKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdmaWxlIGlzIG5vdCBhbiBpbnN0YW5jZSBvZiBGaWxlJykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcbiAgICAgICAgZmlsZVJlYWRlci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gcmVzb2x2ZShmaWxlUmVhZGVyLnJlc3VsdCkpO1xyXG4gICAgICAgIGZpbGVSZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiByZWplY3QoZmlsZVJlYWRlci5lcnJvcikpO1xyXG5cclxuICAgICAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICB9KTtcclxufVxyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy91cGxvYWRDb250cm9sbGVyLmpzXG4gKiovIiwiLyogZ2xvYmFsIFRJTEVfV0lEVEggKi9cclxuLyogZ2xvYmFsIFRJTEVfSEVJR0hUICovXHJcbmltcG9ydCB7IERFRkFVTFRfV0lEVEgsIERFRkFVTFRfSEVJR0hUIH0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xyXG5pbXBvcnQgKiBhcyB0aWxlU2VydmljZSBmcm9tICcuL3RpbGVTZXJ2aWNlJztcclxuXHJcbmxldCBtb3NhaWNFbGVtO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXQobW9zYWlTZWxlY3RvciA9ICcjbW9zYWljLWltZycpIHtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIG1vc2FpY0VsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG1vc2FpU2VsZWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgbW9zYWljRWxlbS5zdHlsZS53aWR0aCA9IGAke0RFRkFVTFRfV0lEVEh9cHhgO1xyXG4gICAgICAgICAgICBtb3NhaWNFbGVtLnN0eWxlLmhlaWdodCA9IGAke0RFRkFVTFRfSEVJR0hUfXB4YDtcclxuXHJcbiAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJnYlRvSGV4KHIsIGcsIGIpIHtcclxuICAgIHJldHVybiAoKDEgPDwgMjQpICsgKHIgPDwgMTYpICsgKGcgPDwgOCkgKyBiKS50b1N0cmluZygxNikuc2xpY2UoMSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGF2Z0NvbG9yKGNvbG9yQXJyYXkpIHtcclxuICAgIGNvbnN0IGNvbG9yU3VtID0gY29sb3JBcnJheS5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHByZXYgKyBjdXJyKTtcclxuICAgIHJldHVybiBwYXJzZUludChjb2xvclN1bSAvIGNvbG9yQXJyYXkubGVuZ3RoLCAxMCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXRzIGEgaHRtbCBzdHJpbmcgb2YgYSBzaW5nbGUgdGlsZS5cclxuICpcclxuICogQHBhcmFtICB7T2JqZWN0fSB0aWxlRGF0YSBwaXhlbCBkYXRhIGZvciB0aGUgdGlsZVxyXG4gKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggaHRtbCBzdHJpbmcgb2YgYSB0aWxlXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRUaWxlKHRpbGVEYXRhKSB7XHJcbiAgICBjb25zdCByZWRDb2xvciA9IFtdO1xyXG4gICAgY29uc3QgZ3JlZW5Db2xvciA9IFtdO1xyXG4gICAgY29uc3QgYmx1ZUNvbG9yID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aWxlRGF0YS5sZW5ndGg7IGkgPCBsOyBpICs9IDQpIHtcclxuICAgICAgICByZWRDb2xvci5wdXNoKHRpbGVEYXRhW2ldKTtcclxuICAgICAgICBncmVlbkNvbG9yLnB1c2godGlsZURhdGFbaSArIDFdKTtcclxuICAgICAgICBibHVlQ29sb3IucHVzaCh0aWxlRGF0YVtpICsgMl0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGF2Z0hleENvbG9yID0gcmdiVG9IZXgoYXZnQ29sb3IocmVkQ29sb3IpLCBhdmdDb2xvcihncmVlbkNvbG9yKSwgYXZnQ29sb3IoYmx1ZUNvbG9yKSk7XHJcblxyXG4gICAgcmV0dXJuIHRpbGVTZXJ2aWNlLmdldFRpbGUoYXZnSGV4Q29sb3IpXHJcbiAgICAgICAgLnRoZW4oKHRtcGwpID0+IHRtcGwpXHJcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldCBhIHRpbGUgZmFpbGVkJyk7XHJcbiAgICAgICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXRzIGEgaHRtbCBzdHJpbmcgZm9yIGFsbCB0aWxlcyB0aGF0IGEgcm93IGlzIGNvbXBvc2VkIG9mLlxyXG4gKlxyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IHhUaWxlc0NvdW50IGhvdyBtYW55IHRpbGUgdGhlIHJvdyBoYXNcclxuICogQHBhcmFtICB7TnVtYmVyfSByb3dJbmRleCAgICByb3dJbmRleFxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IHJvd0RhdGEgICAgIHBpeGVsIGRhdGEgZm9yIHRoZSB3aG9sZSByb3dcclxuICogQHBhcmFtICB7TnVtYmVyfSBjYW52YXNXaWR0aCB0aGUgbGVuZ3RoIG9mIHRoZSBzb3VyY2UgY2FudmFzIGltYWdlXHJcbiAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgYSBQcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2l0aCBodG1sIHN0cmluZyBvZiByb3dcclxuICovXHJcbmZ1bmN0aW9uIGdldFJvdyh4VGlsZXNDb3VudCwgcm93SW5kZXgsIHJvd0RhdGEsIGNhbnZhc1dpZHRoKSB7XHJcbiAgICBjb25zdCB0aWxlRGF0YSA9IFtdO1xyXG4gICAgY29uc3QgdGlsZURhdGFQcm9taXNlcyA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgeFRpbGVzQ291bnQ7IHgrKykge1xyXG4gICAgICAgIHRpbGVEYXRhW3hdID0gW107XHJcblxyXG4gICAgICAgIC8vIGdldCBhIGJsb2NrIGRhdGEgZm9yIGEgdGlsZSAoZXhhbXBsZSA0eDQgdGlsZSlcclxuICAgICAgICAvLyBbcixnLGIsYV0gW3IsZyxiLGFdIFtyLGcsYixhXSBbcixnLGIsYV0gKDQgdmFsdWVzIGZvciBlYWNoIHBpeGVsKVxyXG4gICAgICAgIGxldCBkYXRhU3RhcnQgPSB4ICogVElMRV9XSURUSCAqIDQ7XHJcbiAgICAgICAgbGV0IGRhdGFFbmQgPSBkYXRhU3RhcnQgKyAoVElMRV9XSURUSCAqIDQpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCB0aWxlUm93SW5kZXggPSAwOyB0aWxlUm93SW5kZXggPD0gVElMRV9XSURUSDsgdGlsZVJvd0luZGV4KyspIHtcclxuICAgICAgICAgICAgdGlsZURhdGFbeF0gPSB0aWxlRGF0YVt4XS5jb25jYXQocm93RGF0YS5zbGljZShkYXRhU3RhcnQsIGRhdGFFbmQpKTtcclxuICAgICAgICAgICAgZGF0YVN0YXJ0ID0gKCh0aWxlUm93SW5kZXggKyAxKSAqIGNhbnZhc1dpZHRoICogNCkgKyAoeCAqIFRJTEVfV0lEVEggKiA0KTtcclxuICAgICAgICAgICAgZGF0YUVuZCA9IGRhdGFTdGFydCArIChUSUxFX1dJRFRIICogNCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aWxlRGF0YVByb21pc2VzLnB1c2goZ2V0VGlsZSh0aWxlRGF0YVt4XSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBQcm9taXNlLmFsbCh0aWxlRGF0YVByb21pc2VzKVxyXG4gICAgICAgIC50aGVuKChzdmdUaWxlcykgPT4gc3ZnVGlsZXMuam9pbignJykpXHJcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldHRpbmcgYSByb3cgZmFpbGVkJyk7XHJcbiAgICAgICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW5kZXJzIHRoZSBtb3NhaWMgcm93IGJ5IHJvdy5cclxuICpcclxuICogQHBhcmFtICB7T2JqZWN0fSBtb3NhaWNEYXRhIGEgYmVzcG9rZSBvYmplY3QgY29udGFpbmcgZGF0YVxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmVjZXNzYXJ5IHRvIHJlbmRlciB0aGUgbW9zYWljXHJcbiAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICByZXNvbHZlcyB3aXRoIGEgbWVzc2FnZSB3aGVuIHRoZSBtb3NhaWMgaXMgZmluaXNoZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIobW9zYWljRGF0YSkge1xyXG4gICAgbW9zYWljRWxlbS5pbm5lckhUTUwgPSAnJztcclxuICAgIG1vc2FpY0VsZW0uc3R5bGUud2lkdGggPSBgJHttb3NhaWNEYXRhLmNhbGN1bGF0ZWRXaWR0aH1weGA7XHJcbiAgICBtb3NhaWNFbGVtLnN0eWxlLmhlaWdodCA9IGAke21vc2FpY0RhdGEuY2FsY3VsYXRlZEhlaWdodH1weGA7XHJcblxyXG4gICAgY29uc3QgY2FudmFzSW1nRGF0YSA9IG1vc2FpY0RhdGEuY2FudmFzSW1nRGF0YTtcclxuICAgIC8vIGNvbnZlcnQgdGhlIGNsYW1wbGVkIGFycmF5IHRvIGEgcmVndWxhciBvbmVcclxuICAgIGNvbnN0IHBpeGVsRGF0YSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGNhbnZhc0ltZ0RhdGEuZGF0YSk7XHJcblxyXG4gICAgLy8gaG9yaXpvbnRhbCB0aWxlc1xyXG4gICAgY29uc3QgeFRpbGVzQ291bnQgPSBNYXRoLmZsb29yKGNhbnZhc0ltZ0RhdGEud2lkdGggLyBUSUxFX1dJRFRIKTtcclxuICAgIC8vIHZlcnRpY2FsIHRpbGVzXHJcbiAgICBjb25zdCB5VGlsZXNDb3VudCA9IE1hdGguZmxvb3IoY2FudmFzSW1nRGF0YS5oZWlnaHQgLyBUSUxFX0hFSUdIVCk7XHJcbiAgICBjb25zdCByb3dzRGF0YSA9IFtdO1xyXG5cclxuICAgIGxldCBkYXRhU3RhcnQgPSAwO1xyXG4gICAgbGV0IGRhdGFFbmQgPSBjYW52YXNJbWdEYXRhLndpZHRoICogNCAqIFRJTEVfV0lEVEg7XHJcblxyXG4gICAgLy8gbG9vcCB0aHJ1IGV2ZXJ5IHJvd1xyXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCB5VGlsZXNDb3VudDsgeSsrKSB7XHJcbiAgICAgICAgcm93c0RhdGEucHVzaCh7XHJcbiAgICAgICAgICAgIGRhdGFTdGFydCxcclxuICAgICAgICAgICAgZGF0YUVuZCxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gXCJtb3ZlXCIgcmFuZ2UgdG8gdGhlIG5leHQgcm93XHJcbiAgICAgICAgZGF0YVN0YXJ0ID0gZGF0YUVuZDtcclxuICAgICAgICBkYXRhRW5kID0gZGF0YVN0YXJ0ICsgY2FudmFzSW1nRGF0YS53aWR0aCAqIDQgKiBUSUxFX1dJRFRIO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoZSBwcmV2aW91cyB2ZXJzaW9uIHdhcyAocGFyZG9uIG15IGZyZW5jaCkgYSBicmFpbmZhcnQsXHJcbiAgICAvLyBsZWZ0IGFmdGVyIEkgd2FzIHRlc3Rpbmcgb3V0IGRpZmZlcmVudCBvcHRpb25zIHRvIHJlbmRlciByb3dzXHJcbiAgICByZXR1cm4gcm93c0RhdGEucmVkdWNlKChwcm9taXNlLCByb3dEYXRhLCBpbmRleCkgPT5cclxuICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4gZ2V0Um93KFxyXG4gICAgICAgICAgICAgICAgeFRpbGVzQ291bnQsXHJcbiAgICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICAgIHBpeGVsRGF0YS5zbGljZShyb3dEYXRhLmRhdGFTdGFydCwgcm93RGF0YS5kYXRhRW5kKSxcclxuICAgICAgICAgICAgICAgIGNhbnZhc0ltZ0RhdGEud2lkdGgpXHJcbiAgICAgICAgICAgIC50aGVuKChyb3dUbXBsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtb3NhaWNFbGVtLmlubmVySFRNTCArPSByb3dUbXBsO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgKSwgUHJvbWlzZS5yZXNvbHZlKCkpO1xyXG59XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL21vc2FpY1ZpZXcuanNcbiAqKi8iLCJmdW5jdGlvbiBoYW5kbGVFcnJvcihyZXNwb25zZSkge1xyXG5cclxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGlsZShoZXhDb2xvcikge1xyXG5cclxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgLy8gd2Ugd2FudCB0byBiZSBhYmxlIHRvIFByb21pc2UuY2F0Y2ggdGhpcyBlcnJvclxyXG4gICAgICAgICAgICBpZiAoIWhleENvbG9yIHx8ICFoZXhDb2xvci5tYXRjaCgvXlswLTlhLWZBLUZdezZ9JC8pKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwYXNzZWQgdmFsdWUgaXMgbm90IGEgaGV4YWRlY2ltYWwgY29sb3InKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZldGNoKGAvY29sb3IvJHtoZXhDb2xvcn1gKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlRXJyb3IpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpO1xyXG4gICAgICAgIH0pO1xyXG59XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3RpbGVTZXJ2aWNlLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==