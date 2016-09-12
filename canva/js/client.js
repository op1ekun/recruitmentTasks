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
	
	var _mosaicView2 = _interopRequireDefault(_mosaicView);
	
	var _uploadController = __webpack_require__(4);
	
	var uploadController = _interopRequireWildcard(_uploadController);
	
	var _tileService = __webpack_require__(5);
	
	var tileService = _interopRequireWildcard(_tileService);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var uploadView = new _uploadView2.default(uploadController);
	// the view receives data only from the tile service
	// there seem to be no point for adding additional abstraction
	// when one already exists
	var mosaicView = new _mosaicView2.default(tileService);
	
	uploadView.onImageRendered = function (renderedImageData) {
	    mosaicView.render(renderedImageData).then(function () {
	        console.log('mosaic ready');
	    });
	};

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
	     * Renders an uploaded image using provided image source.
	     * Based on the image dimensions it adjusts the canvas size.
	     * Finally it resolves with bespoke image data object.
	     *
	     * @param   {string} fileSrc    the source of an imgae file
	     * @returns {Promise}           resolves with bespoke image data object
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
	     * Handles the event after users selects a file to upload using the file input element.
	     * Retrieves a file from the file input element,
	     * and passes it to the controller to get the source for to the image.
	     *
	     * @returns {undefined}
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
	            if (_this.onImageRendered instanceof Function) {
	                // pass the data to the provided handler
	                _this.onImageRendered(imageData);
	            }
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
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global TILE_WIDTH */
	/* global TILE_HEIGHT */
	
	
	var _constants = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MosaicView = function () {
	
	    // similary to UploadView/uploadController setup this view
	    // receives tile service as external dependency (IoC)
	    // instead of importing it
	
	    function MosaicView(tileService) {
	        var mosaicSelector = arguments.length <= 1 || arguments[1] === undefined ? '#mosaic-img' : arguments[1];
	
	        _classCallCheck(this, MosaicView);
	
	        if (!tileService) {
	            throw new ReferenceError('tileService is undefined');
	        } else if ((typeof tileService === 'undefined' ? 'undefined' : _typeof(tileService)) !== 'object') {
	            throw new TypeError('tileService is not an object');
	        }
	
	        var mosaicElem = document.querySelector(mosaicSelector);
	
	        // private, readonly properties
	        Object.defineProperty(this, '_tileService', {
	            get: function get() {
	                return tileService;
	            },
	            configurable: false,
	            enumerable: false
	        });
	
	        Object.defineProperty(this, '_mosaicElem', {
	            get: function get() {
	                return mosaicElem;
	            },
	            configurable: false,
	            enumerable: false
	        });
	
	        this._mosaicElem.style.width = _constants.DEFAULT_WIDTH + 'px';
	        this._mosaicElem.style.height = _constants.DEFAULT_HEIGHT + 'px';
	    }
	
	    // util methods
	
	
	    _createClass(MosaicView, [{
	        key: 'render',
	
	
	        /**
	         * Renders the mosaic row by row.
	         *
	         * @public
	         * @param  {Object} mosaicData a bespoke object containg data
	         *                             necessary to render the mosaic
	         * @return {Promise}           resolves with a message when the mosaic is finished
	         */
	        value: function render(mosaicData) {
	            var _this = this;
	
	            this._mosaicElem.innerHTML = '';
	            this._mosaicElem.style.width = mosaicData.calculatedWidth + 'px';
	            this._mosaicElem.style.height = mosaicData.calculatedHeight + 'px';
	
	            var canvasImgData = mosaicData.canvasImgData;
	            // convert the clampled array to a regular one
	            var pixelData = Array.prototype.slice.call(canvasImgData.data);
	
	            // horizontal tiles
	            var xTilesCount = Math.floor(canvasImgData.width / TILE_WIDTH);
	            // vertical tiles
	            var yTilesCount = Math.floor(canvasImgData.height / TILE_HEIGHT);
	            var rowsData = [];
	            var rowsTmpl = '';
	
	            var dataStart = 0;
	            var dataEnd = canvasImgData.width * 4 * TILE_WIDTH;
	
	            /**
	             * Gets a html string of a single tile.
	             * @private
	             *
	             * @param  {Object} tileData pixel data for the tile
	             * @return {Promise}         a Promise that resolves with html string of a tile
	             */
	            var getTile = function getTile(tileData) {
	                var redColor = [];
	                var greenColor = [];
	                var blueColor = [];
	
	                for (var i = 0, l = tileData.length; i < l; i += 4) {
	                    redColor.push(tileData[i]);
	                    greenColor.push(tileData[i + 1]);
	                    blueColor.push(tileData[i + 2]);
	                }
	
	                var avgHexColor = MosaicView.rgbToHex(MosaicView.avgColor(redColor), MosaicView.avgColor(greenColor), MosaicView.avgColor(blueColor));
	
	                return _this._tileService.getTile(avgHexColor).then(function (tmpl) {
	                    return tmpl;
	                }).catch(function (err) {
	                    console.error(err);
	                    throw new Error('get a tile failed');
	                });
	            };
	
	            /**
	             * Gets a html string for all tiles that a row is composed of.
	             * @private
	             *
	             * @param  {Number} rowIndex    rowIndex
	             * @param  {Object} rowData     pixel data for the whole row
	             * @param  {Number} canvasWidth the length of the source canvas image
	             * @return {Promise}            a Promise that is resolved with html string of row
	             */
	            var getRow = function getRow(rowIndex, rowData, canvasWidth) {
	                var tileData = [];
	                var tileDataPromises = [];
	
	                for (var x = 0; x < xTilesCount; x++) {
	                    tileData[x] = [];
	
	                    // get a block data for a tile (example 4x4 tile)
	                    // [r,g,b,a] [r,g,b,a] [r,g,b,a] [r,g,b,a] (4 values for each pixel)
	                    dataStart = x * TILE_WIDTH * 4;
	                    dataEnd = dataStart + TILE_WIDTH * 4;
	
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
	            };
	
	            // loop thru every row
	            for (var y = 0; y < yTilesCount; y++) {
	                rowsTmpl += '<p class="clearfix"></p>';
	
	                rowsData.push({
	                    dataStart: dataStart,
	                    dataEnd: dataEnd
	                });
	
	                // "move" range to the next row
	                dataStart = dataEnd;
	                dataEnd = dataStart + canvasImgData.width * 4 * TILE_WIDTH;
	            }
	
	            // initialize an empty mozaik
	            this._mosaicElem.innerHTML = rowsTmpl;
	            var emptyRowElems = this._mosaicElem.querySelectorAll('p');
	
	            // the previous version was (pardon my french) a brainfart,
	            // left after I was testing out different options to render rows
	            return rowsData.reduce(function (promise, rowData, index) {
	                return promise.then(function () {
	                    return getRow(index, pixelData.slice(rowData.dataStart, rowData.dataEnd), canvasImgData.width).then(function (rowTmpl) {
	                        // add tiles
	                        emptyRowElems[index].innerHTML = rowTmpl;
	                        // make row visible
	                        emptyRowElems[index].style.display = 'block';
	                    });
	                });
	            }, Promise.resolve());
	        }
	    }], [{
	        key: 'rgbToHex',
	        value: function rgbToHex(r, g, b) {
	            return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	        }
	    }, {
	        key: 'avgColor',
	        value: function avgColor(colorArray) {
	            var colorSum = colorArray.reduce(function (prev, curr) {
	                return prev + curr;
	            });
	            return parseInt(colorSum / colorArray.length, 10);
	        }
	    }]);
	
	    return MosaicView;
	}();
	
	exports.default = MosaicView;

/***/ },
/* 4 */
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
	        } else if (!(file instanceof File)) {
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
	        if (!hexColor) {
	            throw new ReferenceError('hexColor is undefined');
	        } else if (!hexColor.match(/^[0-9a-fA-F]{6}$/)) {
	            throw new TypeError('hexColor is not a hexadecimal color');
	        }
	
	        return fetch('/color/' + hexColor).then(handleError).then(function (response) {
	            return response.text();
	        });
	    });
	}

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZWQwZDhlMDE1ZTE5ODYwM2JkYWEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXBsb2FkVmlldy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9tb3NhaWNWaWV3LmpzIiwid2VicGFjazovLy8uL3NyYy91cGxvYWRDb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy90aWxlU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDdENBOzs7O0FBQ0E7Ozs7QUFFQTs7S0FBWSxnQjs7QUFDWjs7S0FBWSxXOzs7Ozs7QUFFWixLQUFNLGFBQWEseUJBQWUsZ0JBQWYsQ0FBbkI7Ozs7QUFJQSxLQUFNLGFBQWEseUJBQWUsV0FBZixDQUFuQjs7QUFFQSxZQUFXLGVBQVgsR0FBNkIsVUFBQyxpQkFBRCxFQUF1QjtBQUNoRCxnQkFBVyxNQUFYLENBQWtCLGlCQUFsQixFQUNLLElBREwsQ0FDVSxZQUFNO0FBQ1IsaUJBQVEsR0FBUixDQUFZLGNBQVo7QUFDSCxNQUhMO0FBSUgsRUFMRCxDOzs7Ozs7Ozs7Ozs7OztBQ1pBOzs7O0tBRXFCLFUsR0FFakIsb0JBQVksZ0JBQVosRUFBMEY7QUFBQTs7QUFBQSxTQUE1RCxZQUE0RCx5REFBN0MsYUFBNkM7QUFBQSxTQUE5QixZQUE4Qix5REFBZixhQUFlOztBQUFBOztBQUN0RixTQUFJLENBQUMsZ0JBQUwsRUFBdUI7QUFDbkIsZUFBTSxJQUFJLGNBQUosQ0FBbUIseUJB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QUVGLElBRkUsQ0FFRztBQUFBLG9CQUFZLFNBQVMsSUFBVCxFQUFaO0FBQUEsVUFGSCxDQUFQO0FBR0gsTUFaRSxDQUFQO0FBYUgsRSIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGVkMGQ4ZTAxNWUxOTg2MDNiZGFhXG4gKiovIiwiaW1wb3J0IFVwbG9hZFZpZXcgZnJvbSAnLi91cGxvYWRWaWV3LmpzJztcclxuaW1wb3J0IE1vc2FpY1ZpZXcgZnJvbSAnLi9tb3NhaWNWaWV3LmpzJztcclxuXHJcbmltcG9ydCAqIGFzIHVwbG9hZENvbnRyb2xsZXIgZnJvbSAnLi91cGxvYWRDb250cm9sbGVyLmpzJztcclxuaW1wb3J0ICogYXMgdGlsZVNlcnZpY2UgZnJvbSAnLi90aWxlU2VydmljZSc7XHJcblxyXG5jb25zdCB1cGxvYWRWaWV3ID0gbmV3IFVwbG9hZFZpZXcodXBsb2FkQ29udHJvbGxlcik7XHJcbi8vIHRoZSB2aWV3IHJlY2VpdmVzIGRhdGEgb25seSBmcm9tIHRoZSB0aWxlIHNlcnZpY2VcclxuLy8gdGhlcmUgc2VlbSB0byBiZSBubyBwb2ludCBmb3IgYWRkaW5nIGFkZGl0aW9uYWwgYWJzdHJhY3Rpb25cclxuLy8gd2hlbiBvbmUgYWxyZWFkeSBleGlzdHNcclxuY29uc3QgbW9zYWljVmlldyA9IG5ldyBNb3NhaWNWaWV3KHRpbGVTZXJ2aWNlKTtcclxuXHJcbnVwbG9hZFZpZXcub25JbWFnZVJlbmRlcmVkID0gKHJlbmRlcmVkSW1hZ2VEYXRhKSA9PiB7XHJcbiAgICBtb3NhaWNWaWV3LnJlbmRlcihyZW5kZXJlZEltYWdlRGF0YSlcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3NhaWMgcmVhZHknKTtcclxuICAgICAgICB9KTtcclxufTtcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYXBwLmpzXG4gKiovIiwiaW1wb3J0IHsgREVGQVVMVF9XSURUSCwgREVGQVVMVF9IRUlHSFQgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcGxvYWRWaWV3IHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1cGxvYWRDb250cm9sbGVyLCB1cGxvYWRJbWdTZWwgPSAnI3VwbG9hZC1pbWcnLCBzb3VyY2VJbWdTZWwgPSAnI3NvdXJjZS1pbWcnKSB7XHJcbiAgICAgICAgaWYgKCF1cGxvYWRDb250cm9sbGVyKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignY29udHJvbGxlciBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICB9IGlmICh0eXBlb2YgdXBsb2FkQ29udHJvbGxlciAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29udHJvbGxlciBpcyBub3QgYW4gb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB1cGxvYWRJbWdJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodXBsb2FkSW1nU2VsKTtcclxuICAgICAgICBjb25zdCBjYW52YXNFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihzb3VyY2VJbWdTZWwpO1xyXG4gICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhc0VsZW0uZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBERUZBVUxUX1dJRFRILCBERUZBVUxUX0hFSUdIVCk7XHJcblxyXG4gICAgICAgIGNhbnZhc0VsZW0ud2lkdGggPSBERUZBVUxUX1dJRFRIO1xyXG4gICAgICAgIGNhbnZhc0VsZW0uaGVpZ2h0ID0gREVGQVVMVF9IRUlHSFQ7XHJcblxyXG4gICAgICAgIHRoaXMub25JbWFnZVJlbmRlcmVkID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVuZGVycyBhbiB1cGxvYWRlZCBpbWFnZSB1c2luZyBwcm92aWRlZCBpbWFnZSBzb3VyY2UuXHJcbiAgICAgICAgICogQmFzZWQgb24gdGhlIGltYWdlIGRpbWVuc2lvbnMgaXQgYWRqdXN0cyB0aGUgY2FudmFzIHNpemUuXHJcbiAgICAgICAgICogRmluYWxseSBpdCByZXNvbHZlcyB3aXRoIGJlc3Bva2UgaW1hZ2UgZGF0YSBvYmplY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gICB7c3RyaW5nfSBmaWxlU3JjICAgIHRoZSBzb3VyY2Ugb2YgYW4gaW1nYWUgZmlsZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtQcm9taXNlfSAgICAgICAgICAgcmVzb2x2ZXMgd2l0aCBiZXNwb2tlIGltYWdlIGRhdGEgb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3QgcmVuZGVySW1hZ2UgPSAoZmlsZVNyYykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1cGxvYWRlZEltZyA9IG5ldyBJbWFnZSgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICB1cGxvYWRlZEltZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIG5lZWQgY2FjbHVsYXRlZCB2YWx1ZXMgaGVyZSB0byBhdm9pZCBzY2FsaW5nIGltYWdlcyB1cFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRXaWR0aCA9ICh1cGxvYWRlZEltZy53aWR0aCA8IERFRkFVTFRfV0lEVEggP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRlZEltZy53aWR0aCA6IERFRkFVTFRfV0lEVEgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRIZWlnaHQgPSAodXBsb2FkZWRJbWcuaGVpZ2h0IC8gKHVwbG9hZGVkSW1nLndpZHRoID4gREVGQVVMVF9XSURUSCA/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZGVkSW1nLndpZHRoIC8gREVGQVVMVF9XSURUSCA6IDEpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzRWxlbS53aWR0aCA9IGNhbGN1bGF0ZWRXaWR0aDtcclxuICAgICAgICAgICAgICAgICAgICBjYW52YXNFbGVtLmhlaWdodCA9IGNhbGN1bGF0ZWRIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UodXBsb2FkZWRJbWcsIDAsIDAsIGNhbGN1bGF0ZWRXaWR0aCwgY2FsY3VsYXRlZEhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbnZhc0ltZ0RhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIGNhbGN1bGF0ZWRXaWR0aCwgY2FsY3VsYXRlZEhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXNJbWdEYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB1cGxvYWRlZEltZy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICB1cGxvYWRlZEltZy5zcmMgPSBmaWxlU3JjO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBldmVudCBhZnRlciB1c2VycyBzZWxlY3RzIGEgZmlsZSB0byB1cGxvYWQgdXNpbmcgdGhlIGZpbGUgaW5wdXQgZWxlbWVudC5cclxuICAgICAgICAgKiBSZXRyaWV2ZXMgYSBmaWxlIGZyb20gdGhlIGZpbGUgaW5wdXQgZWxlbWVudCxcclxuICAgICAgICAgKiBhbmQgcGFzc2VzIGl0IHRvIHRoZSBjb250cm9sbGVyIHRvIGdldCB0aGUgc291cmNlIGZvciB0byB0aGUgaW1hZ2UuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZU9uQ2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlTGlzdCA9IHVwbG9hZEltZ0lucHV0LmZpbGVzO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFmaWxlTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmaWxlVG9VcGxvYWQgPSBmaWxlTGlzdFswXTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnRyb2xsZXIgaGFuZGxlcyB0aGUgdXBsb2FkXHJcbiAgICAgICAgICAgIHVwbG9hZENvbnRyb2xsZXIuaGFuZGxlRmlsZVVwbG9hZChmaWxlVG9VcGxvYWQpXHJcbiAgICAgICAgICAgICAgICAvLyB2aWV3IGhhbmRsZXMgcmVuZGVyaW5nIHRoZSBpbWFnZVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGZpbGVTcmMpID0+IHJlbmRlckltYWdlKGZpbGVTcmMpKVxyXG4gICAgICAgICAgICAgICAgLy8gYW5kIG5vdGlmeWluZyB3aG9ldmVyIGlzIGxpc3RlbnRpbmcgd2hlbiByZWFkeVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGltYWdlRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uSW1hZ2VSZW5kZXJlZCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBhc3MgdGhlIGRhdGEgdG8gdGhlIHByb3ZpZGVkIGhhbmRsZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkltYWdlUmVuZGVyZWQoaW1hZ2VEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB1cGxvYWRJbWdJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBoYW5kbGVPbkNoYW5nZSk7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdXBsb2FkVmlldy5qc1xuICoqLyIsImV4cG9ydCBjb25zdCBERUZBVUxUX1dJRFRIID0gKHdpbmRvdy5pbm5lcldpZHRoIC0gMjApIC8gMjtcclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSEVJR0hUID0gKHdpbmRvdy5pbm5lckhlaWdodCAtIDIwKSAvIDI7XHJcbi8vIHRvIGF2b2lkIHVzaW5nIG1hZ2ljIHN0cmluZ3NcclxuZXhwb3J0IGNvbnN0IHN1cHBvcnRlZEV2ZW50cyA9IHtcclxuICAgIElNQUdFX1JFTkRFUkVEOiAnaW1hZ2UtcmVuZGVyZWQnXHJcbn1cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29uc3RhbnRzLmpzXG4gKiovIiwiLyogZ2xvYmFsIFRJTEVfV0lEVEggKi9cbi8qIGdsb2JhbCBUSUxFX0hFSUdIVCAqL1xuaW1wb3J0IHsgREVGQVVMVF9XSURUSCwgREVGQVVMVF9IRUlHSFQgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vc2FpY1ZpZXcge1xuXG4gICAgLy8gc2ltaWxhcnkgdG8gVXBsb2FkVmlldy91cGxvYWRDb250cm9sbGVyIHNldHVwIHRoaXMgdmlld1xuICAgIC8vIHJlY2VpdmVzIHRpbGUgc2VydmljZSBhcyBleHRlcm5hbCBkZXBlbmRlbmN5IChJb0MpXG4gICAgLy8gaW5zdGVhZCBvZiBpbXBvcnRpbmcgaXRcbiAgICBjb25zdHJ1Y3Rvcih0aWxlU2VydmljZSwgbW9zYWljU2VsZWN0b3IgPSAnI21vc2FpYy1pbWcnKSB7XG5cbiAgICAgICAgaWYgKCF0aWxlU2VydmljZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCd0aWxlU2VydmljZSBpcyB1bmRlZmluZWQnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGlsZVNlcnZpY2UgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0aWxlU2VydmljZSBpcyBub3QgYW4gb2JqZWN0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtb3NhaWNFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihtb3NhaWNTZWxlY3Rvcik7XG5cbiAgICAgICAgLy8gcHJpdmF0ZSwgcmVhZG9ubHkgcHJvcGVydGllc1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ190aWxlU2VydmljZScsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gdGlsZVNlcnZpY2UsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX21vc2FpY0VsZW0nLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IG1vc2FpY0VsZW0sXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX21vc2FpY0VsZW0uc3R5bGUud2lkdGggPSBgJHtERUZBVUxUX1dJRFRIfXB4YDtcbiAgICAgICAgdGhpcy5fbW9zYWljRWxlbS5zdHlsZS5oZWlnaHQgPSBgJHtERUZBVUxUX0hFSUdIVH1weGA7XG4gICAgfVxuXG4gICAgLy8gdXRpbCBtZXRob2RzXG4gICAgc3RhdGljIHJnYlRvSGV4KHIsIGcsIGIpIHtcbiAgICAgICAgcmV0dXJuICgoMSA8PCAyNCkgKyAociA8PCAxNikgKyAoZyA8PCA4KSArIGIpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXZnQ29sb3IoY29sb3JBcnJheSkge1xuICAgICAgICBjb25zdCBjb2xvclN1bSA9IGNvbG9yQXJyYXkucmVkdWNlKChwcmV2LCBjdXJyKSA9PiBwcmV2ICsgY3Vycik7XG4gICAgICAgIHJldHVybiBwYXJzZUludChjb2xvclN1bSAvIGNvbG9yQXJyYXkubGVuZ3RoLCAxMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVuZGVycyB0aGUgbW9zYWljIHJvdyBieSByb3cuXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBtb3NhaWNEYXRhIGEgYmVzcG9rZSBvYmplY3QgY29udGFpbmcgZGF0YVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZWNlc3NhcnkgdG8gcmVuZGVyIHRoZSBtb3NhaWNcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgcmVzb2x2ZXMgd2l0aCBhIG1lc3NhZ2Ugd2hlbiB0aGUgbW9zYWljIGlzIGZpbmlzaGVkXG4gICAgICovXG4gICAgcmVuZGVyKG1vc2FpY0RhdGEpIHtcbiAgICAgICAgdGhpcy5fbW9zYWljRWxlbS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgdGhpcy5fbW9zYWljRWxlbS5zdHlsZS53aWR0aCA9IGAke21vc2FpY0RhdGEuY2FsY3VsYXRlZFdpZHRofXB4YDtcbiAgICAgICAgdGhpcy5fbW9zYWljRWxlbS5zdHlsZS5oZWlnaHQgPSBgJHttb3NhaWNEYXRhLmNhbGN1bGF0ZWRIZWlnaHR9cHhgO1xuXG4gICAgICAgIGNvbnN0IGNhbnZhc0ltZ0RhdGEgPSBtb3NhaWNEYXRhLmNhbnZhc0ltZ0RhdGE7XG4gICAgICAgIC8vIGNvbnZlcnQgdGhlIGNsYW1wbGVkIGFycmF5IHRvIGEgcmVndWxhciBvbmVcbiAgICAgICAgY29uc3QgcGl4ZWxEYXRhID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoY2FudmFzSW1nRGF0YS5kYXRhKTtcblxuICAgICAgICAvLyBob3Jpem9udGFsIHRpbGVzXG4gICAgICAgIGNvbnN0IHhUaWxlc0NvdW50ID0gTWF0aC5mbG9vcihjYW52YXNJbWdEYXRhLndpZHRoIC8gVElMRV9XSURUSCk7XG4gICAgICAgIC8vIHZlcnRpY2FsIHRpbGVzXG4gICAgICAgIGNvbnN0IHlUaWxlc0NvdW50ID0gTWF0aC5mbG9vcihjYW52YXNJbWdEYXRhLmhlaWdodCAvIFRJTEVfSEVJR0hUKTtcbiAgICAgICAgY29uc3Qgcm93c0RhdGEgPSBbXTtcbiAgICAgICAgbGV0IHJvd3NUbXBsID0gJyc7XG5cbiAgICAgICAgbGV0IGRhdGFTdGFydCA9IDA7XG4gICAgICAgIGxldCBkYXRhRW5kID0gY2FudmFzSW1nRGF0YS53aWR0aCAqIDQgKiBUSUxFX1dJRFRIO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIGEgaHRtbCBzdHJpbmcgb2YgYSBzaW5nbGUgdGlsZS5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSB0aWxlRGF0YSBwaXhlbCBkYXRhIGZvciB0aGUgdGlsZVxuICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggaHRtbCBzdHJpbmcgb2YgYSB0aWxlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBnZXRUaWxlID0gKHRpbGVEYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWRDb2xvciA9IFtdO1xuICAgICAgICAgICAgY29uc3QgZ3JlZW5Db2xvciA9IFtdO1xuICAgICAgICAgICAgY29uc3QgYmx1ZUNvbG9yID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGlsZURhdGEubGVuZ3RoOyBpIDwgbDsgaSArPSA0KSB7XG4gICAgICAgICAgICAgICAgcmVkQ29sb3IucHVzaCh0aWxlRGF0YVtpXSk7XG4gICAgICAgICAgICAgICAgZ3JlZW5Db2xvci5wdXNoKHRpbGVEYXRhW2kgKyAxXSk7XG4gICAgICAgICAgICAgICAgYmx1ZUNvbG9yLnB1c2godGlsZURhdGFbaSArIDJdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYXZnSGV4Q29sb3IgPSBNb3NhaWNWaWV3LnJnYlRvSGV4KFxuICAgICAgICAgICAgICAgIE1vc2FpY1ZpZXcuYXZnQ29sb3IocmVkQ29sb3IpLFxuICAgICAgICAgICAgICAgIE1vc2FpY1ZpZXcuYXZnQ29sb3IoZ3JlZW5Db2xvciksXG4gICAgICAgICAgICAgICAgTW9zYWljVmlldy5hdmdDb2xvcihibHVlQ29sb3IpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGlsZVNlcnZpY2UuZ2V0VGlsZShhdmdIZXhDb2xvcilcbiAgICAgICAgICAgICAgICAudGhlbigodG1wbCkgPT4gdG1wbClcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0IGEgdGlsZSBmYWlsZWQnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyBhIGh0bWwgc3RyaW5nIGZvciBhbGwgdGlsZXMgdGhhdCBhIHJvdyBpcyBjb21wb3NlZCBvZi5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7TnVtYmVyfSByb3dJbmRleCAgICByb3dJbmRleFxuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHJvd0RhdGEgICAgIHBpeGVsIGRhdGEgZm9yIHRoZSB3aG9sZSByb3dcbiAgICAgICAgICogQHBhcmFtICB7TnVtYmVyfSBjYW52YXNXaWR0aCB0aGUgbGVuZ3RoIG9mIHRoZSBzb3VyY2UgY2FudmFzIGltYWdlXG4gICAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgYSBQcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2l0aCBodG1sIHN0cmluZyBvZiByb3dcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGdldFJvdyA9IChyb3dJbmRleCwgcm93RGF0YSwgY2FudmFzV2lkdGgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRpbGVEYXRhID0gW107XG4gICAgICAgICAgICBjb25zdCB0aWxlRGF0YVByb21pc2VzID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgeFRpbGVzQ291bnQ7IHgrKykge1xuICAgICAgICAgICAgICAgIHRpbGVEYXRhW3hdID0gW107XG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgYSBibG9jayBkYXRhIGZvciBhIHRpbGUgKGV4YW1wbGUgNHg0IHRpbGUpXG4gICAgICAgICAgICAgICAgLy8gW3IsZyxiLGFdIFtyLGcsYixhXSBbcixnLGIsYV0gW3IsZyxiLGFdICg0IHZhbHVlcyBmb3IgZWFjaCBwaXhlbClcbiAgICAgICAgICAgICAgICBkYXRhU3RhcnQgPSB4ICogVElMRV9XSURUSCAqIDQ7XG4gICAgICAgICAgICAgICAgZGF0YUVuZCA9IGRhdGFTdGFydCArIChUSUxFX1dJRFRIICogNCk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCB0aWxlUm93SW5kZXggPSAwOyB0aWxlUm93SW5kZXggPD0gVElMRV9XSURUSDsgdGlsZVJvd0luZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGlsZURhdGFbeF0gPSB0aWxlRGF0YVt4XS5jb25jYXQocm93RGF0YS5zbGljZShkYXRhU3RhcnQsIGRhdGFFbmQpKTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVN0YXJ0ID0gKCh0aWxlUm93SW5kZXggKyAxKSAqIGNhbnZhc1dpZHRoICogNCkgKyAoeCAqIFRJTEVfV0lEVEggKiA0KTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YUVuZCA9IGRhdGFTdGFydCArIChUSUxFX1dJRFRIICogNCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGlsZURhdGFQcm9taXNlcy5wdXNoKGdldFRpbGUodGlsZURhdGFbeF0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHRpbGVEYXRhUHJvbWlzZXMpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHN2Z1RpbGVzKSA9PiBzdmdUaWxlcy5qb2luKCcnKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0dGluZyBhIHJvdyBmYWlsZWQnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBsb29wIHRocnUgZXZlcnkgcm93XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgeVRpbGVzQ291bnQ7IHkrKykge1xuICAgICAgICAgICAgcm93c1RtcGwgKz0gJzxwIGNsYXNzPVwiY2xlYXJmaXhcIj48L3A+JztcblxuICAgICAgICAgICAgcm93c0RhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgZGF0YVN0YXJ0LFxuICAgICAgICAgICAgICAgIGRhdGFFbmQsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gXCJtb3ZlXCIgcmFuZ2UgdG8gdGhlIG5leHQgcm93XG4gICAgICAgICAgICBkYXRhU3RhcnQgPSBkYXRhRW5kO1xuICAgICAgICAgICAgZGF0YUVuZCA9IGRhdGFTdGFydCArIGNhbnZhc0ltZ0RhdGEud2lkdGggKiA0ICogVElMRV9XSURUSDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGluaXRpYWxpemUgYW4gZW1wdHkgbW96YWlrXG4gICAgICAgIHRoaXMuX21vc2FpY0VsZW0uaW5uZXJIVE1MID0gcm93c1RtcGw7XG4gICAgICAgIGNvbnN0IGVtcHR5Um93RWxlbXMgPSB0aGlzLl9tb3NhaWNFbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJ3AnKTtcblxuICAgICAgICAvLyB0aGUgcHJldmlvdXMgdmVyc2lvbiB3YXMgKHBhcmRvbiBteSBmcmVuY2gpIGEgYnJhaW5mYXJ0LFxuICAgICAgICAvLyBsZWZ0IGFmdGVyIEkgd2FzIHRlc3Rpbmcgb3V0IGRpZmZlcmVudCBvcHRpb25zIHRvIHJlbmRlciByb3dzXG4gICAgICAgIHJldHVybiByb3dzRGF0YS5yZWR1Y2UoKHByb21pc2UsIHJvd0RhdGEsIGluZGV4KSA9PlxuICAgICAgICAgICAgcHJvbWlzZS50aGVuKCgpID0+IGdldFJvdyhcbiAgICAgICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIHBpeGVsRGF0YS5zbGljZShyb3dEYXRhLmRhdGFTdGFydCwgcm93RGF0YS5kYXRhRW5kKSxcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzSW1nRGF0YS53aWR0aClcbiAgICAgICAgICAgICAgICAudGhlbigocm93VG1wbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgdGlsZXNcbiAgICAgICAgICAgICAgICAgICAgZW1wdHlSb3dFbGVtc1tpbmRleF0uaW5uZXJIVE1MID0gcm93VG1wbDtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSByb3cgdmlzaWJsZVxuICAgICAgICAgICAgICAgICAgICBlbXB0eVJvd0VsZW1zW2luZGV4XS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICApLCBQcm9taXNlLnJlc29sdmUoKSk7XG4gICAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbW9zYWljVmlldy5qc1xuICoqLyIsImV4cG9ydCBmdW5jdGlvbiBoYW5kbGVGaWxlVXBsb2FkKGZpbGUpIHtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGlmICghZmlsZSkge1xyXG4gICAgICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignZmlsZSBpcyB1bmRlZmluZWQnKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKCEoZmlsZSBpbnN0YW5jZW9mIEZpbGUpKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdmaWxlIGlzIG5vdCBhbiBpbnN0YW5jZSBvZiBGaWxlJykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcbiAgICAgICAgZmlsZVJlYWRlci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gcmVzb2x2ZShmaWxlUmVhZGVyLnJlc3VsdCkpO1xyXG4gICAgICAgIGZpbGVSZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiByZWplY3QoZmlsZVJlYWRlci5lcnJvcikpO1xyXG5cclxuICAgICAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICB9KTtcclxufVxyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy91cGxvYWRDb250cm9sbGVyLmpzXG4gKiovIiwiZnVuY3Rpb24gaGFuZGxlRXJyb3IocmVzcG9uc2UpIHtcclxuXHJcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXNwb25zZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbGUoaGV4Q29sb3IpIHtcclxuXHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHdlIHdhbnQgdG8gYmUgYWJsZSB0byBQcm9taXNlLmNhdGNoIHRoaXMgZXJyb3JcclxuICAgICAgICAgICAgaWYgKCFoZXhDb2xvcikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdoZXhDb2xvciBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghaGV4Q29sb3IubWF0Y2goL15bMC05YS1mQS1GXXs2fSQvKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaGV4Q29sb3IgaXMgbm90IGEgaGV4YWRlY2ltYWwgY29sb3InKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZldGNoKGAvY29sb3IvJHtoZXhDb2xvcn1gKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlRXJyb3IpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpO1xyXG4gICAgICAgIH0pO1xyXG59XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3RpbGVTZXJ2aWNlLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==