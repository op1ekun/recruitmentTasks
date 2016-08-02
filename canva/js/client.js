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
	        var _this = this;
	
	        var mosaicSelector = arguments.length <= 1 || arguments[1] === undefined ? '#mosaic-img' : arguments[1];
	
	        _classCallCheck(this, MosaicView);
	
	        if (!tileService) {
	            throw new ReferenceError('tileService is undefined');
	        } else if ((typeof tileService === 'undefined' ? 'undefined' : _typeof(tileService)) !== 'object') {
	            throw new TypeError('tileService is not an object');
	        }
	
	        try {
	            (function () {
	                var mosaicElem = document.querySelector(mosaicSelector);
	
	                // private, readonly properties
	                Object.defineProperty(_this, '_tileService', {
	                    get: function get() {
	                        return tileService;
	                    },
	                    configurable: false,
	                    enumerable: false
	                });
	
	                Object.defineProperty(_this, '_mosaicElem', {
	                    get: function get() {
	                        return mosaicElem;
	                    },
	                    configurable: false,
	                    enumerable: false
	                });
	
	                _this._mosaicElem.style.width = _constants.DEFAULT_WIDTH + 'px';
	                _this._mosaicElem.style.height = _constants.DEFAULT_HEIGHT + 'px';
	            })();
	        } catch (err) {
	            throw err;
	        }
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
	            var _this2 = this;
	
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
	
	                return _this2._tileService.getTile(avgHexColor).then(function (tmpl) {
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
	                    return getRow(index, pixelData.slice(rowData.dataStart, rowData.dataEnd), canvasImgData.width).then(function (rowTmpl) {
	                        _this2._mosaicElem.innerHTML += rowTmpl;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZWQyMDA4ZmQ3YjI0NTFlZWFiYTgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXBsb2FkVmlldy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9tb3NhaWNWaWV3LmpzIiwid2VicGFjazovLy8uL3NyYy91cGxvYWRDb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy90aWxlU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDdENBOzs7O0FBQ0E7Ozs7QUFFQTs7S0FBWSxnQjs7QUFDWjs7S0FBWSxXOzs7Ozs7QUFFWixLQUFNLGFBQWEseUJBQWUsZ0JBQWYsQ0FBbkI7Ozs7QUFJQSxLQUFNLGFBQWEseUJBQWUsV0FBZixDQUFuQjs7QUFFQSxZQUFXLGVBQVgsR0FBNkIsVUFBQyxpQkFBRCxFQUF1QjtBQUNoRCxnQkFBVyxNQUFYLENBQWtCLGlCQUFsQixFQUNLLElBREwsQ0FDVSxZQUFNO0FBQ1IsaUJBQVEsR0FBUixDQUFZLGNBQVo7QUFDSCxNQUhMO0FBSUgsRUFMRCxDOzs7Ozs7Ozs7Ozs7OztBQ1pBOzs7O0tBRXFCLFUsR0FFakIsb0JBQVksZ0JBQVosRUFBMEY7QUFBQTs7QUFBQSxTQUE1RCxZQUE0RCx5REFBN0MsYUFBNkM7QUFBQSxTQUE5QixZQUE4Qix5REFBZixhQUFlOztBQUFBOztBQUN0RixTQUFJLENBQUMsZ0JBQUwsRUFBdUI7QUFDbkIsZUFBTSxJQUFJLGNBQUosQ0FBbUIseUJBQW5CLENBQU47QUFDSCxNQUFDLElBQUksUUFBTyxnQkFBUCx5Q0FBTyxnQkFBUCxPQUE0QixRQUFoQyxFQUEwQztBQUN4QyxlQUFNLElBQUksU0FBSixDQUFjLDZCQUFkLENBQU47QUFDSDs7QUFFRCxTQUFNLGlCQUFpQixTQUFTLGFBQVQsQ0FBdUIsWUFBdkIsQ0FBdkI7QUFDQSxTQUFNLGFBQWEsU0FBUyxhQUFULENBQXVCLFlBQXZCLENBQW5CO0FBQ0EsU0FBTSxNQUFNLFdBQVcsVUFBWCxDQUFzQixJQUF0QixDQUFaOztBQUVBLFNBQUksU0FBSixDQUFjLENBQWQsRUFBaUIsQ0FBakI7O0FBRUEsZ0JBQVcsS0FBWDtBQUNBLGdCQUFXLE1BQVg7O0FBRUEsVUFBSyxlQUFMLEdBQXVCLElBQXZCOzs7Ozs7Ozs7O0FBVUEsU0FBTSxjQUFjLFNBQWQsV0FBYyxDQUFDLE9BQUQsRUFBYTtBQUM3QixhQUFNLGNBQWMsSUFBSSxLQUFKLEVBQXBCOztBQUVBLGdCQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7O0FBRXBDLHlCQUFZLGdCQUFaLENBQTZCLE1BQTdCLEVBQXFDLFlBQU07O0FBRXZDLHFCQUFNLGtCQUFtQixZQUFZLEtBQVosOEJBQ3JCLFlBQVksS0FEUywyQkFBekI7QUFFQSxxQkFBTSxtQkFBb0IsWUFBWSxNQUFaLElBQXNCLFlBQVksS0FBWiw4QkFDNUMsWUFBWSxLQUFaLDJCQUQ0QyxHQUNSLENBRGQsQ0FBMUI7O0FBR0EsNEJBQVcsS0FBWCxHQUFtQixlQUFuQjtBQUNBLDRCQUFXLE1BQVgsR0FBb0IsZ0JBQXBCOztBQUVBLHFCQUFJLFNBQUosQ0FBYyxXQUFkLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDLGVBQWpDLEVBQWtELGdCQUFsRDs7QUFFQSxxQkFBTSxnQkFBZ0IsSUFBSSxZQUFKLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLEVBQXVCLGVBQXZCLEVBQXdDLGdCQUF4QyxDQUF0Qjs7QUFFQSx5QkFBUTtBQUNKLGlEQURJO0FBRUoscURBRkk7QUFHSjtBQUhJLGtCQUFSO0FBS0gsY0FuQkQ7O0FBcUJBLHlCQUFZLGdCQUFaLENBQTZCLE9BQTdCLEVBQXNDLE1BQXRDO0FBQ0EseUJBQVksR0FBWixHQUFrQixPQUFsQjtBQUNILFVBekJNLENBQVA7QUEwQkgsTUE3QkQ7Ozs7Ozs7OztBQXNDQSxTQUFNLGlCQUFpQixTQUFqQixjQUFpQixHQUFNO0FBQ3pCLGFBQU0sV0FBVyxlQUFlLEtBQWhDOztBQUVBLGFBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWDtBQUNIOztBQUVELGFBQU0sZUFBZSxTQUFTLENBQVQsQ0FBckI7OztBQUdBLDBCQUFpQixnQkFBakIsQ0FBa0MsWUFBbEM7O0FBQUEsVUFFSyxJQUZMLENBRVUsVUFBQyxPQUFEO0FBQUEsb0JBQWEsWUFBWSxPQUFaLENBQWI7QUFBQSxVQUZWOztBQUFBLFVBSUssSUFKTCxDQUlVLFVBQUMsU0FBRCxFQUFlO0FBQ2pCLGlCQUFJLE1BQUssZUFBTCxZQUFnQyxRQUFwQyxFQUE4Qzs7QUFFMUMsdUJBQUssZUFBTCxDQUFxQixTQUFyQjtBQUNIO0FBQ0osVUFUTDtBQVVILE1BcEJEOztBQXNCQSxvQkFBZSxnQkFBZixDQUFnQyxRQUFoQyxFQUEwQyxjQUExQztBQUNILEU7O21CQXpGZ0IsVTs7Ozs7Ozs7Ozs7QUNGZCxLQUFNLHdDQUFnQixDQUFDLE9BQU8sVUFBUCxHQUFvQixFQUFyQixJQUEyQixDQUFqRDtBQUNBLEtBQU0sMENBQWlCLENBQUMsT0FBTyxXQUFQLEdBQXFCLEVBQXRCLElBQTRCLENBQW5EOztBQUVBLEtBQU0sNENBQWtCO0FBQzNCLHFCQUFnQjtBQURXLEVBQXhCLEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0RQOzs7O0tBRXFCLFU7Ozs7OztBQUtqQix5QkFBWSxXQUFaLEVBQXlEO0FBQUE7O0FBQUEsYUFBaEMsY0FBZ0MseURBQWYsYUFBZTs7QUFBQTs7QUFFckQsYUFBSSxDQUFDLFdBQUwsRUFBa0I7QUFDZCxtQkFBTSxJQUFJLGNBQUosQ0FBbUIsMEJBQW5CLENBQU47QUFDSCxVQUZELE1BRU8sSUFBSSxRQUFPLFdBQVAseUNBQU8sV0FBUCxPQUF1QixRQUEzQixFQUFxQztBQUN4QyxtQkFBTSxJQUFJLFNBQUosQ0FBYyw4QkFBZCxDQUFOO0FBQ0g7O0FBRUQsYUFBSTtBQUFBO0FBQ0EscUJBQU0sYUFBYSxTQUFTLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBbkI7OztBQUdBLHdCQUFPLGNBQVAsUUFBNEIsY0FBNUIsRUFBNEM7QUFDeEMsMEJBQUs7QUFBQSxnQ0FBTSxXQUFOO0FBQUEsc0JBRG1DO0FBRXhDLG1DQUFjLEtBRjBCO0FBR3hDLGlDQUFZO0FBSDRCLGtCQUE1Qzs7QUFNQSx3QkFBTyxjQUFQLFFBQTRCLGFBQTVCLEVBQTJDO0FBQ3ZDLDBCQUFLO0FBQUEsZ0NBQU0sVUFBTjtBQUFBLHNCQURrQztBQUV2QyxtQ0FBYyxLQUZ5QjtBQUd2QyxpQ0FBWTtBQUgyQixrQkFBM0M7O0FBTUEsdUJBQUssV0FBTCxDQUFpQixLQUFqQixDQUF1QixLQUF2QjtBQUNBLHVCQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FBdUIsTUFBdkI7QUFqQkE7QUFrQkgsVUFsQkQsQ0FrQkUsT0FBTyxHQUFQLEVBQVk7QUFDVixtQkFBTSxHQUFOO0FBQ0g7QUFDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0NBb0JNLFUsRUFBWTtBQUFBOztBQUNmLGtCQUFLLFdBQUwsQ0FBaUIsU0FBakIsR0FBNkIsRUFBN0I7QUFDQSxrQkFBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLEtBQXZCLEdBQWtDLFdBQVcsZUFBN0M7QUFDQSxrQkFBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLE1BQXZCLEdBQW1DLFdBQVcsZ0JBQTlDOztBQUVBLGlCQUFNLGdCQUFnQixXQUFXLGFBQWpDOztBQUVBLGlCQUFNLFlBQVksTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQTJCLGNBQWMsSUFBekMsQ0FBbEI7OztBQUdBLGlCQUFNLGNBQWMsS0FBSyxLQUFMLENBQVcsY0FBYyxLQUFkLEdBQXNCLFVBQWpDLENBQXBCOztBQUVBLGlCQUFNLGNBQWMsS0FBSyxLQUFMLENBQVcsY0FBYyxNQUFkLEdBQXVCLFdBQWxDLENBQXBCO0FBQ0EsaUJBQU0sV0FBVyxFQUFqQjs7QUFFQSxpQkFBSSxZQUFZLENBQWhCO0FBQ0EsaUJBQUksVUFBVSxjQUFjLEtBQWQsR0FBc0IsQ0FBdEIsR0FBMEIsVUFBeEM7Ozs7Ozs7OztBQVNBLGlCQUFNLFVBQVUsU0FBVixPQUFVLENBQUMsUUFBRCxFQUFjO0FBQzFCLHFCQUFNLFdBQVcsRUFBakI7QUFDQSxxQkFBTSxhQUFhLEVBQW5CO0FBQ0EscUJBQU0sWUFBWSxFQUFsQjs7QUFFQSxzQkFBSyxJQUFJLElBQUksQ0FBUixFQUFXLElBQUksU0FBUyxNQUE3QixFQUFxQyxJQUFJLENBQXpDLEVBQTRDLEtBQUssQ0FBakQsRUFBb0Q7QUFDaEQsOEJBQVMsSUFBVCxDQUFjLFNBQVMsQ0FBVCxDQUFkO0FBQ0EsZ0NBQVcsSUFBWCxDQUFnQixTQUFTLElBQUksQ0FBYixDQUFoQjtBQUNBLCtCQUFVLElBQVYsQ0FBZSxTQUFTLElBQUksQ0FBYixDQUFmO0FBQ0g7O0FBRUQscUJBQU0sY0FBYyxXQUFXLFFBQVgsQ0FDaEIsV0FBVyxRQUFYLENBQW9CLFFBQXBCLENBRGdCLEVBRWhCLFdBQVcsUUFBWCxDQUFvQixVQUFwQixDQUZnQixFQUdoQixXQUFXLFFBQVgsQ0FBb0IsU0FBcEIsQ0FIZ0IsQ0FBcEI7O0FBTUEsd0JBQU8sT0FBSyxZQUFMLENBQWtCLE9BQWxCLENBQTBCLFdBQTFCLEVBQ0YsSUFERSxDQUNHLFVBQUMsSUFBRDtBQUFBLDRCQUFVLElBQVY7QUFBQSxrQkFESCxFQUVGLEtBRkUsQ0FFSSxVQUFDLEdBQUQsRUFBUztBQUNaLDZCQUFRLEtBQVIsQ0FBYyxHQUFkO0FBQ0EsMkJBQU0sSUFBSSxLQUFKLENBQVUsbUJBQVYsQ0FBTjtBQUNILGtCQUxFLENBQVA7QUFNSCxjQXZCRDs7Ozs7Ozs7Ozs7QUFrQ0EsaUJBQU0sU0FBUyxTQUFULE1BQVMsQ0FBQyxRQUFELEVBQVcsT0FBWCxFQUFvQixXQUFwQixFQUFvQztBQUMvQyxxQkFBTSxXQUFXLEVBQWpCO0FBQ0EscUJBQU0sbUJBQW1CLEVBQXpCOztBQUVBLHNCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksV0FBcEIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMsOEJBQVMsQ0FBVCxJQUFjLEVBQWQ7Ozs7QUFJQSxpQ0FBWSxJQUFJLFVBQUosR0FBaUIsQ0FBN0I7QUFDQSwrQkFBVSxZQUFhLGFBQWEsQ0FBcEM7O0FBRUEsMEJBQUssSUFBSSxlQUFlLENBQXhCLEVBQTJCLGdCQUFnQixVQUEzQyxFQUF1RCxjQUF2RCxFQUF1RTtBQUNuRSxrQ0FBUyxDQUFULElBQWMsU0FBUyxDQUFULEVBQVksTUFBWixDQUFtQixRQUFRLEtBQVIsQ0FBYyxTQUFkLEVBQXlCLE9BQXpCLENBQW5CLENBQWQ7QUFDQSxxQ0FBYSxDQUFDLGVBQWUsQ0FBaEIsSUFBcUIsV0FBckIsR0FBbUMsQ0FBcEMsR0FBMEMsSUFBSSxVQUFKLEdBQWlCLENBQXZFO0FBQ0EsbUNBQVUsWUFBYSxhQUFhLENBQXBDO0FBQ0g7O0FBRUQsc0NBQWlCLElBQWpCLENBQXNCLFFBQVEsU0FBUyxDQUFULENBQVIsQ0FBdEI7QUFDSDs7QUFFRCx3QkFBTyxRQUFRLEdBQVIsQ0FBWSxnQkFBWixFQUNGLElBREUsQ0FDRyxVQUFDLFFBQUQ7QUFBQSw0QkFBYyxTQUFTLElBQVQsQ0FBYyxFQUFkLENBQWQ7QUFBQSxrQkFESCxFQUVGLEtBRkUsQ0FFSSxVQUFDLEdBQUQsRUFBUztBQUNaLDZCQUFRLEtBQVIsQ0FBYyxHQUFkO0FBQ0EsMkJBQU0sSUFBSSxLQUFKLENBQVUsc0JBQVYsQ0FBTjtBQUNILGtCQUxFLENBQVA7QUFNSCxjQTNCRDs7O0FBOEJBLGtCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksV0FBcEIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMsMEJBQVMsSUFBVCxDQUFjO0FBQ1YseUNBRFU7QUFFVjtBQUZVLGtCQUFkOzs7QUFNQSw2QkFBWSxPQUFaO0FBQ0EsMkJBQVUsWUFBWSxjQUFjLEtBQWQsR0FBc0IsQ0FBdEIsR0FBMEIsVUFBaEQ7QUFDSDs7OztBQUlELG9CQUFPLFNBQVMsTUFBVCxDQUFnQixVQUFDLE9BQUQsRUFBVSxPQUFWLEVBQW1CLEtBQW5CO0FBQUEsd0JBQ25CLFFBQVEsSUFBUixDQUFhO0FBQUEsNEJBQU0sT0FDWCxLQURXLEVBRVgsVUFBVSxLQUFWLENBQWdCLFFBQVEsU0FBeEIsRUFBbUMsUUFBUSxPQUEzQyxDQUZXLEVBR1gsY0FBYyxLQUhILEVBSWQsSUFKYyxDQUlULFVBQUMsT0FBRCxFQUFhO0FBQ2YsZ0NBQUssV0FBTCxDQUFpQixTQUFqQixJQUE4QixPQUE5QjtBQUNILHNCQU5jLENBQU47QUFBQSxrQkFBYixDQURtQjtBQUFBLGNBQWhCLEVBUUosUUFBUSxPQUFSLEVBUkksQ0FBUDtBQVNIOzs7a0NBaEllLEMsRUFBRyxDLEVBQUcsQyxFQUFHO0FBQ3JCLG9CQUFPLENBQUMsQ0FBQyxLQUFLLEVBQU4sS0FBYSxLQUFLLEVBQWxCLEtBQXlCLEtBQUssQ0FBOUIsSUFBbUMsQ0FBcEMsRUFBdUMsUUFBdkMsQ0FBZ0QsRUFBaEQsRUFBb0QsS0FBcEQsQ0FBMEQsQ0FBMUQsQ0FBUDtBQUNIOzs7a0NBRWUsVSxFQUFZO0FBQ3hCLGlCQUFNLFdBQVcsV0FBVyxNQUFYLENBQWtCLFVBQUMsSUFBRCxFQUFPLElBQVA7QUFBQSx3QkFBZ0IsT0FBTyxJQUF2QjtBQUFBLGNBQWxCLENBQWpCO0FBQ0Esb0JBQU8sU0FBUyxXQUFXLFdBQVcsTUFBL0IsRUFBdUMsRUFBdkMsQ0FBUDtBQUNIOzs7Ozs7bUJBNUNnQixVOzs7Ozs7Ozs7OztTQ0pMLGdCLEdBQUEsZ0I7QUFBVCxVQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDOztBQUVuQyxZQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDcEMsYUFBSSxDQUFDLElBQUwsRUFBVztBQUNQLG9CQUFPLElBQUksU0FBSixDQUFjLG1CQUFkLENBQVA7QUFDQTtBQUNILFVBSEQsTUFHTyxJQUFJLEVBQUUsZ0JBQWdCLElBQWxCLENBQUosRUFBNkI7QUFDaEMsb0JBQU8sSUFBSSxTQUFKLENBQWMsaUNBQWQsQ0FBUDtBQUNBO0FBQ0g7O0FBRUQsYUFBTSxhQUFhLElBQUksVUFBSixFQUFuQjs7QUFFQSxvQkFBVyxnQkFBWCxDQUE0QixNQUE1QixFQUFvQztBQUFBLG9CQUFNLFFBQVEsV0FBVyxNQUFuQixDQUFOO0FBQUEsVUFBcEM7QUFDQSxvQkFBVyxnQkFBWCxDQUE0QixPQUE1QixFQUFxQztBQUFBLG9CQUFNLE9BQU8sV0FBVyxLQUFsQixDQUFOO0FBQUEsVUFBckM7O0FBRUEsb0JBQVcsYUFBWCxDQUF5QixJQUF6QjtBQUNILE1BZk0sQ0FBUDtBQWdCSCxFOzs7Ozs7Ozs7OztTQ1RlLE8sR0FBQSxPO0FBVGhCLFVBQVMsV0FBVCxDQUFxQixRQUFyQixFQUErQjs7QUFFM0IsU0FBSSxDQUFDLFNBQVMsRUFBZCxFQUFrQjtBQUNkLGVBQU0sSUFBSSxLQUFKLENBQVUsU0FBUyxVQUFuQixDQUFOO0FBQ0g7O0FBRUQsWUFBTyxRQUFQO0FBQ0g7O0FBRU0sVUFBUyxPQUFULENBQWlCLFFBQWpCLEVBQTJCOztBQUU5QixZQUFPLFFBQVEsT0FBUixHQUNGLElBREUsQ0FDRyxZQUFNOztBQUVSLGFBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWCxtQkFBTSxJQUFJLGNBQUosQ0FBbUIsdUJBQW5CLENBQU47QUFDSCxVQUZELE1BRU8sSUFBSSxDQUFDLFNBQVMsS0FBVCxDQUFlLGtCQUFmLENBQUwsRUFBeUM7QUFDNUMsbUJBQU0sSUFBSSxTQUFKLENBQWMscUNBQWQsQ0FBTjtBQUNIOztBQUVELGdCQUFPLGtCQUFnQixRQUFoQixFQUNGLElBREUsQ0FDRyxXQURILEVBRUYsSUFGRSxDQUVHO0FBQUEsb0JBQVksU0FBUyxJQUFULEVBQVo7QUFBQSxVQUZILENBQVA7QUFHSCxNQVpFLENBQVA7QUFhSCxFIiwiZmlsZSI6ImNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgZWQyMDA4ZmQ3YjI0NTFlZWFiYThcbiAqKi8iLCJpbXBvcnQgVXBsb2FkVmlldyBmcm9tICcuL3VwbG9hZFZpZXcuanMnO1xuaW1wb3J0IE1vc2FpY1ZpZXcgZnJvbSAnLi9tb3NhaWNWaWV3LmpzJztcblxuaW1wb3J0ICogYXMgdXBsb2FkQ29udHJvbGxlciBmcm9tICcuL3VwbG9hZENvbnRyb2xsZXIuanMnO1xuaW1wb3J0ICogYXMgdGlsZVNlcnZpY2UgZnJvbSAnLi90aWxlU2VydmljZSc7XG5cbmNvbnN0IHVwbG9hZFZpZXcgPSBuZXcgVXBsb2FkVmlldyh1cGxvYWRDb250cm9sbGVyKTtcbi8vIHRoZSB2aWV3IHJlY2VpdmVzIGRhdGEgb25seSBmcm9tIHRoZSB0aWxlIHNlcnZpY2Vcbi8vIHRoZXJlIHNlZW0gdG8gYmUgbm8gcG9pbnQgZm9yIGFkZGluZyBhZGRpdGlvbmFsIGFic3RyYWN0aW9uXG4vLyB3aGVuIG9uZSBhbHJlYWR5IGV4aXN0c1xuY29uc3QgbW9zYWljVmlldyA9IG5ldyBNb3NhaWNWaWV3KHRpbGVTZXJ2aWNlKTtcblxudXBsb2FkVmlldy5vbkltYWdlUmVuZGVyZWQgPSAocmVuZGVyZWRJbWFnZURhdGEpID0+IHtcbiAgICBtb3NhaWNWaWV3LnJlbmRlcihyZW5kZXJlZEltYWdlRGF0YSlcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ21vc2FpYyByZWFkeScpO1xuICAgICAgICB9KTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hcHAuanNcbiAqKi8iLCJpbXBvcnQgeyBERUZBVUxUX1dJRFRILCBERUZBVUxUX0hFSUdIVCB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXBsb2FkVmlldyB7XG5cbiAgICBjb25zdHJ1Y3Rvcih1cGxvYWRDb250cm9sbGVyLCB1cGxvYWRJbWdTZWwgPSAnI3VwbG9hZC1pbWcnLCBzb3VyY2VJbWdTZWwgPSAnI3NvdXJjZS1pbWcnKSB7XG4gICAgICAgIGlmICghdXBsb2FkQ29udHJvbGxlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdjb250cm9sbGVyIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICB9IGlmICh0eXBlb2YgdXBsb2FkQ29udHJvbGxlciAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbnRyb2xsZXIgaXMgbm90IGFuIG9iamVjdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXBsb2FkSW1nSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHVwbG9hZEltZ1NlbCk7XG4gICAgICAgIGNvbnN0IGNhbnZhc0VsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNvdXJjZUltZ1NlbCk7XG4gICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhc0VsZW0uZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIERFRkFVTFRfV0lEVEgsIERFRkFVTFRfSEVJR0hUKTtcblxuICAgICAgICBjYW52YXNFbGVtLndpZHRoID0gREVGQVVMVF9XSURUSDtcbiAgICAgICAgY2FudmFzRWxlbS5oZWlnaHQgPSBERUZBVUxUX0hFSUdIVDtcblxuICAgICAgICB0aGlzLm9uSW1hZ2VSZW5kZXJlZCA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbmRlcnMgYW4gdXBsb2FkZWQgaW1hZ2UgdXNpbmcgcHJvdmlkZWQgaW1hZ2Ugc291cmNlLlxuICAgICAgICAgKiBCYXNlZCBvbiB0aGUgaW1hZ2UgZGltZW5zaW9ucyBpdCBhZGp1c3RzIHRoZSBjYW52YXMgc2l6ZS5cbiAgICAgICAgICogRmluYWxseSBpdCByZXNvbHZlcyB3aXRoIGJlc3Bva2UgaW1hZ2UgZGF0YSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAgIHtzdHJpbmd9IGZpbGVTcmMgICAgdGhlIHNvdXJjZSBvZiBhbiBpbWdhZSBmaWxlXG4gICAgICAgICAqIEByZXR1cm5zIHtQcm9taXNlfSAgICAgICAgICAgcmVzb2x2ZXMgd2l0aCBiZXNwb2tlIGltYWdlIGRhdGEgb2JqZWN0XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCByZW5kZXJJbWFnZSA9IChmaWxlU3JjKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1cGxvYWRlZEltZyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdXBsb2FkZWRJbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgbmVlZCBjYWNsdWxhdGVkIHZhbHVlcyBoZXJlIHRvIGF2b2lkIHNjYWxpbmcgaW1hZ2VzIHVwXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWRXaWR0aCA9ICh1cGxvYWRlZEltZy53aWR0aCA8IERFRkFVTFRfV0lEVEggP1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWRJbWcud2lkdGggOiBERUZBVUxUX1dJRFRIKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FsY3VsYXRlZEhlaWdodCA9ICh1cGxvYWRlZEltZy5oZWlnaHQgLyAodXBsb2FkZWRJbWcud2lkdGggPiBERUZBVUxUX1dJRFRIID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZGVkSW1nLndpZHRoIC8gREVGQVVMVF9XSURUSCA6IDEpKTtcblxuICAgICAgICAgICAgICAgICAgICBjYW52YXNFbGVtLndpZHRoID0gY2FsY3VsYXRlZFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICBjYW52YXNFbGVtLmhlaWdodCA9IGNhbGN1bGF0ZWRIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSh1cGxvYWRlZEltZywgMCwgMCwgY2FsY3VsYXRlZFdpZHRoLCBjYWxjdWxhdGVkSGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYW52YXNJbWdEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCBjYWxjdWxhdGVkV2lkdGgsIGNhbGN1bGF0ZWRIZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzSW1nRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdXBsb2FkZWRJbWcuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIHVwbG9hZGVkSW1nLnNyYyA9IGZpbGVTcmM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgZXZlbnQgYWZ0ZXIgdXNlcnMgc2VsZWN0cyBhIGZpbGUgdG8gdXBsb2FkIHVzaW5nIHRoZSBmaWxlIGlucHV0IGVsZW1lbnQuXG4gICAgICAgICAqIFJldHJpZXZlcyBhIGZpbGUgZnJvbSB0aGUgZmlsZSBpbnB1dCBlbGVtZW50LFxuICAgICAgICAgKiBhbmQgcGFzc2VzIGl0IHRvIHRoZSBjb250cm9sbGVyIHRvIGdldCB0aGUgc291cmNlIGZvciB0byB0aGUgaW1hZ2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBoYW5kbGVPbkNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVMaXN0ID0gdXBsb2FkSW1nSW5wdXQuZmlsZXM7XG5cbiAgICAgICAgICAgIGlmICghZmlsZUxpc3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbGVUb1VwbG9hZCA9IGZpbGVMaXN0WzBdO1xuXG4gICAgICAgICAgICAvLyBjb250cm9sbGVyIGhhbmRsZXMgdGhlIHVwbG9hZFxuICAgICAgICAgICAgdXBsb2FkQ29udHJvbGxlci5oYW5kbGVGaWxlVXBsb2FkKGZpbGVUb1VwbG9hZClcbiAgICAgICAgICAgICAgICAvLyB2aWV3IGhhbmRsZXMgcmVuZGVyaW5nIHRoZSBpbWFnZVxuICAgICAgICAgICAgICAgIC50aGVuKChmaWxlU3JjKSA9PiByZW5kZXJJbWFnZShmaWxlU3JjKSlcbiAgICAgICAgICAgICAgICAvLyBhbmQgbm90aWZ5aW5nIHdob2V2ZXIgaXMgbGlzdGVudGluZyB3aGVuIHJlYWR5XG4gICAgICAgICAgICAgICAgLnRoZW4oKGltYWdlRGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vbkltYWdlUmVuZGVyZWQgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGFzcyB0aGUgZGF0YSB0byB0aGUgcHJvdmlkZWQgaGFuZGxlclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkltYWdlUmVuZGVyZWQoaW1hZ2VEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHVwbG9hZEltZ0lucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhhbmRsZU9uQ2hhbmdlKTtcbiAgICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy91cGxvYWRWaWV3LmpzXG4gKiovIiwiZXhwb3J0IGNvbnN0IERFRkFVTFRfV0lEVEggPSAod2luZG93LmlubmVyV2lkdGggLSAyMCkgLyAyO1xyXG5leHBvcnQgY29uc3QgREVGQVVMVF9IRUlHSFQgPSAod2luZG93LmlubmVySGVpZ2h0IC0gMjApIC8gMjtcclxuLy8gdG8gYXZvaWQgdXNpbmcgbWFnaWMgc3RyaW5nc1xyXG5leHBvcnQgY29uc3Qgc3VwcG9ydGVkRXZlbnRzID0ge1xyXG4gICAgSU1BR0VfUkVOREVSRUQ6ICdpbWFnZS1yZW5kZXJlZCdcclxufVxyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb25zdGFudHMuanNcbiAqKi8iLCIvKiBnbG9iYWwgVElMRV9XSURUSCAqL1xuLyogZ2xvYmFsIFRJTEVfSEVJR0hUICovXG5pbXBvcnQgeyBERUZBVUxUX1dJRFRILCBERUZBVUxUX0hFSUdIVCB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9zYWljVmlldyB7XG5cbiAgICAvLyBzaW1pbGFyeSB0byBVcGxvYWRWaWV3L3VwbG9hZENvbnRyb2xsZXIgc2V0dXAgdGhpcyB2aWV3XG4gICAgLy8gcmVjZWl2ZXMgdGlsZSBzZXJ2aWNlIGFzIGV4dGVybmFsIGRlcGVuZGVuY3kgKElvQylcbiAgICAvLyBpbnN0ZWFkIG9mIGltcG9ydGluZyBpdFxuICAgIGNvbnN0cnVjdG9yKHRpbGVTZXJ2aWNlLCBtb3NhaWNTZWxlY3RvciA9ICcjbW9zYWljLWltZycpIHtcblxuICAgICAgICBpZiAoIXRpbGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ3RpbGVTZXJ2aWNlIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aWxlU2VydmljZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RpbGVTZXJ2aWNlIGlzIG5vdCBhbiBvYmplY3QnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBtb3NhaWNFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihtb3NhaWNTZWxlY3Rvcik7XG5cbiAgICAgICAgICAgIC8vIHByaXZhdGUsIHJlYWRvbmx5IHByb3BlcnRpZXNcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX3RpbGVTZXJ2aWNlJywge1xuICAgICAgICAgICAgICAgIGdldDogKCkgPT4gdGlsZVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ19tb3NhaWNFbGVtJywge1xuICAgICAgICAgICAgICAgIGdldDogKCkgPT4gbW9zYWljRWxlbSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX21vc2FpY0VsZW0uc3R5bGUud2lkdGggPSBgJHtERUZBVUxUX1dJRFRIfXB4YDtcbiAgICAgICAgICAgIHRoaXMuX21vc2FpY0VsZW0uc3R5bGUuaGVpZ2h0ID0gYCR7REVGQVVMVF9IRUlHSFR9cHhgO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHV0aWwgbWV0aG9kc1xuICAgIHN0YXRpYyByZ2JUb0hleChyLCBnLCBiKSB7XG4gICAgICAgIHJldHVybiAoKDEgPDwgMjQpICsgKHIgPDwgMTYpICsgKGcgPDwgOCkgKyBiKS50b1N0cmluZygxNikuc2xpY2UoMSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGF2Z0NvbG9yKGNvbG9yQXJyYXkpIHtcbiAgICAgICAgY29uc3QgY29sb3JTdW0gPSBjb2xvckFycmF5LnJlZHVjZSgocHJldiwgY3VycikgPT4gcHJldiArIGN1cnIpO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQoY29sb3JTdW0gLyBjb2xvckFycmF5Lmxlbmd0aCwgMTApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbmRlcnMgdGhlIG1vc2FpYyByb3cgYnkgcm93LlxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqIEBwYXJhbSAge09iamVjdH0gbW9zYWljRGF0YSBhIGJlc3Bva2Ugb2JqZWN0IGNvbnRhaW5nIGRhdGFcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmVjZXNzYXJ5IHRvIHJlbmRlciB0aGUgbW9zYWljXG4gICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgIHJlc29sdmVzIHdpdGggYSBtZXNzYWdlIHdoZW4gdGhlIG1vc2FpYyBpcyBmaW5pc2hlZFxuICAgICAqL1xuICAgIHJlbmRlcihtb3NhaWNEYXRhKSB7XG4gICAgICAgIHRoaXMuX21vc2FpY0VsZW0uaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHRoaXMuX21vc2FpY0VsZW0uc3R5bGUud2lkdGggPSBgJHttb3NhaWNEYXRhLmNhbGN1bGF0ZWRXaWR0aH1weGA7XG4gICAgICAgIHRoaXMuX21vc2FpY0VsZW0uc3R5bGUuaGVpZ2h0ID0gYCR7bW9zYWljRGF0YS5jYWxjdWxhdGVkSGVpZ2h0fXB4YDtcblxuICAgICAgICBjb25zdCBjYW52YXNJbWdEYXRhID0gbW9zYWljRGF0YS5jYW52YXNJbWdEYXRhO1xuICAgICAgICAvLyBjb252ZXJ0IHRoZSBjbGFtcGxlZCBhcnJheSB0byBhIHJlZ3VsYXIgb25lXG4gICAgICAgIGNvbnN0IHBpeGVsRGF0YSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGNhbnZhc0ltZ0RhdGEuZGF0YSk7XG5cbiAgICAgICAgLy8gaG9yaXpvbnRhbCB0aWxlc1xuICAgICAgICBjb25zdCB4VGlsZXNDb3VudCA9IE1hdGguZmxvb3IoY2FudmFzSW1nRGF0YS53aWR0aCAvIFRJTEVfV0lEVEgpO1xuICAgICAgICAvLyB2ZXJ0aWNhbCB0aWxlc1xuICAgICAgICBjb25zdCB5VGlsZXNDb3VudCA9IE1hdGguZmxvb3IoY2FudmFzSW1nRGF0YS5oZWlnaHQgLyBUSUxFX0hFSUdIVCk7XG4gICAgICAgIGNvbnN0IHJvd3NEYXRhID0gW107XG5cbiAgICAgICAgbGV0IGRhdGFTdGFydCA9IDA7XG4gICAgICAgIGxldCBkYXRhRW5kID0gY2FudmFzSW1nRGF0YS53aWR0aCAqIDQgKiBUSUxFX1dJRFRIO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIGEgaHRtbCBzdHJpbmcgb2YgYSBzaW5nbGUgdGlsZS5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSB0aWxlRGF0YSBwaXhlbCBkYXRhIGZvciB0aGUgdGlsZVxuICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggaHRtbCBzdHJpbmcgb2YgYSB0aWxlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBnZXRUaWxlID0gKHRpbGVEYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWRDb2xvciA9IFtdO1xuICAgICAgICAgICAgY29uc3QgZ3JlZW5Db2xvciA9IFtdO1xuICAgICAgICAgICAgY29uc3QgYmx1ZUNvbG9yID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGlsZURhdGEubGVuZ3RoOyBpIDwgbDsgaSArPSA0KSB7XG4gICAgICAgICAgICAgICAgcmVkQ29sb3IucHVzaCh0aWxlRGF0YVtpXSk7XG4gICAgICAgICAgICAgICAgZ3JlZW5Db2xvci5wdXNoKHRpbGVEYXRhW2kgKyAxXSk7XG4gICAgICAgICAgICAgICAgYmx1ZUNvbG9yLnB1c2godGlsZURhdGFbaSArIDJdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYXZnSGV4Q29sb3IgPSBNb3NhaWNWaWV3LnJnYlRvSGV4KFxuICAgICAgICAgICAgICAgIE1vc2FpY1ZpZXcuYXZnQ29sb3IocmVkQ29sb3IpLFxuICAgICAgICAgICAgICAgIE1vc2FpY1ZpZXcuYXZnQ29sb3IoZ3JlZW5Db2xvciksXG4gICAgICAgICAgICAgICAgTW9zYWljVmlldy5hdmdDb2xvcihibHVlQ29sb3IpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGlsZVNlcnZpY2UuZ2V0VGlsZShhdmdIZXhDb2xvcilcbiAgICAgICAgICAgICAgICAudGhlbigodG1wbCkgPT4gdG1wbClcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0IGEgdGlsZSBmYWlsZWQnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyBhIGh0bWwgc3RyaW5nIGZvciBhbGwgdGlsZXMgdGhhdCBhIHJvdyBpcyBjb21wb3NlZCBvZi5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7TnVtYmVyfSByb3dJbmRleCAgICByb3dJbmRleFxuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHJvd0RhdGEgICAgIHBpeGVsIGRhdGEgZm9yIHRoZSB3aG9sZSByb3dcbiAgICAgICAgICogQHBhcmFtICB7TnVtYmVyfSBjYW52YXNXaWR0aCB0aGUgbGVuZ3RoIG9mIHRoZSBzb3VyY2UgY2FudmFzIGltYWdlXG4gICAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgYSBQcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2l0aCBodG1sIHN0cmluZyBvZiByb3dcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGdldFJvdyA9IChyb3dJbmRleCwgcm93RGF0YSwgY2FudmFzV2lkdGgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRpbGVEYXRhID0gW107XG4gICAgICAgICAgICBjb25zdCB0aWxlRGF0YVByb21pc2VzID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgeFRpbGVzQ291bnQ7IHgrKykge1xuICAgICAgICAgICAgICAgIHRpbGVEYXRhW3hdID0gW107XG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgYSBibG9jayBkYXRhIGZvciBhIHRpbGUgKGV4YW1wbGUgNHg0IHRpbGUpXG4gICAgICAgICAgICAgICAgLy8gW3IsZyxiLGFdIFtyLGcsYixhXSBbcixnLGIsYV0gW3IsZyxiLGFdICg0IHZhbHVlcyBmb3IgZWFjaCBwaXhlbClcbiAgICAgICAgICAgICAgICBkYXRhU3RhcnQgPSB4ICogVElMRV9XSURUSCAqIDQ7XG4gICAgICAgICAgICAgICAgZGF0YUVuZCA9IGRhdGFTdGFydCArIChUSUxFX1dJRFRIICogNCk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCB0aWxlUm93SW5kZXggPSAwOyB0aWxlUm93SW5kZXggPD0gVElMRV9XSURUSDsgdGlsZVJvd0luZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGlsZURhdGFbeF0gPSB0aWxlRGF0YVt4XS5jb25jYXQocm93RGF0YS5zbGljZShkYXRhU3RhcnQsIGRhdGFFbmQpKTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVN0YXJ0ID0gKCh0aWxlUm93SW5kZXggKyAxKSAqIGNhbnZhc1dpZHRoICogNCkgKyAoeCAqIFRJTEVfV0lEVEggKiA0KTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YUVuZCA9IGRhdGFTdGFydCArIChUSUxFX1dJRFRIICogNCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGlsZURhdGFQcm9taXNlcy5wdXNoKGdldFRpbGUodGlsZURhdGFbeF0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHRpbGVEYXRhUHJvbWlzZXMpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHN2Z1RpbGVzKSA9PiBzdmdUaWxlcy5qb2luKCcnKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0dGluZyBhIHJvdyBmYWlsZWQnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBsb29wIHRocnUgZXZlcnkgcm93XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgeVRpbGVzQ291bnQ7IHkrKykge1xuICAgICAgICAgICAgcm93c0RhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgZGF0YVN0YXJ0LFxuICAgICAgICAgICAgICAgIGRhdGFFbmQsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gXCJtb3ZlXCIgcmFuZ2UgdG8gdGhlIG5leHQgcm93XG4gICAgICAgICAgICBkYXRhU3RhcnQgPSBkYXRhRW5kO1xuICAgICAgICAgICAgZGF0YUVuZCA9IGRhdGFTdGFydCArIGNhbnZhc0ltZ0RhdGEud2lkdGggKiA0ICogVElMRV9XSURUSDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoZSBwcmV2aW91cyB2ZXJzaW9uIHdhcyAocGFyZG9uIG15IGZyZW5jaCkgYSBicmFpbmZhcnQsXG4gICAgICAgIC8vIGxlZnQgYWZ0ZXIgSSB3YXMgdGVzdGluZyBvdXQgZGlmZmVyZW50IG9wdGlvbnMgdG8gcmVuZGVyIHJvd3NcbiAgICAgICAgcmV0dXJuIHJvd3NEYXRhLnJlZHVjZSgocHJvbWlzZSwgcm93RGF0YSwgaW5kZXgpID0+XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4gZ2V0Um93KFxuICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgcGl4ZWxEYXRhLnNsaWNlKHJvd0RhdGEuZGF0YVN0YXJ0LCByb3dEYXRhLmRhdGFFbmQpLFxuICAgICAgICAgICAgICAgICAgICBjYW52YXNJbWdEYXRhLndpZHRoKVxuICAgICAgICAgICAgICAgIC50aGVuKChyb3dUbXBsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vc2FpY0VsZW0uaW5uZXJIVE1MICs9IHJvd1RtcGw7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgKSwgUHJvbWlzZS5yZXNvbHZlKCkpO1xuICAgIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL21vc2FpY1ZpZXcuanNcbiAqKi8iLCJleHBvcnQgZnVuY3Rpb24gaGFuZGxlRmlsZVVwbG9hZChmaWxlKSB7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoIWZpbGUpIHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdmaWxlIGlzIHVuZGVmaW5lZCcpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICghKGZpbGUgaW5zdGFuY2VvZiBGaWxlKSkge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ2ZpbGUgaXMgbm90IGFuIGluc3RhbmNlIG9mIEZpbGUnKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgICAgICBmaWxlUmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiByZXNvbHZlKGZpbGVSZWFkZXIucmVzdWx0KSk7XG4gICAgICAgIGZpbGVSZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiByZWplY3QoZmlsZVJlYWRlci5lcnJvcikpO1xuXG4gICAgICAgIGZpbGVSZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICB9KTtcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3VwbG9hZENvbnRyb2xsZXIuanNcbiAqKi8iLCJmdW5jdGlvbiBoYW5kbGVFcnJvcihyZXNwb25zZSkge1xuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGlsZShoZXhDb2xvcikge1xuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIHdlIHdhbnQgdG8gYmUgYWJsZSB0byBQcm9taXNlLmNhdGNoIHRoaXMgZXJyb3JcbiAgICAgICAgICAgIGlmICghaGV4Q29sb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ2hleENvbG9yIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghaGV4Q29sb3IubWF0Y2goL15bMC05YS1mQS1GXXs2fSQvKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2hleENvbG9yIGlzIG5vdCBhIGhleGFkZWNpbWFsIGNvbG9yJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmZXRjaChgL2NvbG9yLyR7aGV4Q29sb3J9YClcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVFcnJvcilcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpO1xuICAgICAgICB9KTtcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3RpbGVTZXJ2aWNlLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==