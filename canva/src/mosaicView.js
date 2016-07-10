/* global TILE_WIDTH */
/* global TILE_HEIGHT */
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from './constants.js';
import * as tileService from './tileService';

let mosaicElem;

export function init() {

    return new Promise((resolve, reject) => {
        try {
            mosaicElem = document.querySelector('#mosaic-img');

            mosaicElem.style.width = `${DEFAULT_WIDTH}px`;
            mosaicElem.style.height = `${DEFAULT_HEIGHT}px`;

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
    const colorSum = colorArray.reduce((prev, curr) => prev + curr);
    return parseInt(colorSum / colorArray.length, 10);
}

/**
 * Gets a html string of a single tile.
 *
 * @param  {Object} tileData pixel data for the tile
 * @return {Promise}         a Promise that resolves with html string of a tile
 */
function getTile(tileData) {
    const redColor = [];
    const greenColor = [];
    const blueColor = [];

    for (let i = 0, l = tileData.length; i < l; i += 4) {
        redColor.push(tileData[i]);
        greenColor.push(tileData[i + 1]);
        blueColor.push(tileData[i + 2]);
    }

    const avgHexColor = rgbToHex(avgColor(redColor), avgColor(greenColor), avgColor(blueColor));

    return tileService.getTile(avgHexColor)
        .then((tmpl) => tmpl)
        .catch((err) => {
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
    const tileData = [];
    const tileDataPromises = [];

    for (let x = 0; x < xTilesCount; x++) {
        tileData[x] = [];

        // get a block data for a tile (example 4x4 tile)
        // [r,g,b,a] [r,g,b,a] [r,g,b,a] [r,g,b,a] (4 values for each pixel)
        let dataStart = x * TILE_WIDTH * 4;
        let dataEnd = dataStart + (TILE_WIDTH * 4);

        for (let tileRowIndex = 0; tileRowIndex <= TILE_WIDTH; tileRowIndex++) {
            tileData[x] = tileData[x].concat(rowData.slice(dataStart, dataEnd));
            dataStart = ((tileRowIndex + 1) * canvasWidth * 4) + (x * TILE_WIDTH * 4);
            dataEnd = dataStart + (TILE_WIDTH * 4);
        }

        tileDataPromises.push(getTile(tileData[x]));
    }

    return Promise.all(tileDataPromises)
        .then((svgTiles) => svgTiles.join(''))
        .catch((err) => {
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
export function render(mosaicData) {
    mosaicElem.innerHTML = '';
    mosaicElem.style.width = `${mosaicData.calculatedWidth}px`;
    mosaicElem.style.height = `${mosaicData.calculatedHeight}px`;

    const canvasImgData = mosaicData.canvasImgData;
    // convert the clampled array to a regular one
    const pixelData = Array.prototype.slice.call(canvasImgData.data);

    // horizontal tiles
    const xTilesCount = Math.floor(canvasImgData.width / TILE_WIDTH);
    // vertical tiles
    const yTilesCount = Math.floor(canvasImgData.height / TILE_HEIGHT);
    const rowsData = [];

    let dataStart = 0;
    let dataEnd = canvasImgData.width * 4 * TILE_WIDTH;

    // loop thru every row
    for (let y = 0; y < yTilesCount; y++) {
        rowsData.push({
            dataStart,
            dataEnd,
        });

        // "move" range to the next row
        dataStart = dataEnd;
        dataEnd = dataStart + canvasImgData.width * 4 * TILE_WIDTH;
    }

    // rows will be processed one at time
    // to not hammer server with tile requests
    // which caused issue when all rows where processed in paraller
    return rowsData.reduce((promise, rowData, index) =>
        promise.then((rowTmpl) => {
            mosaicElem.innerHTML += rowTmpl;
            return getRow(xTilesCount, index, pixelData.slice(rowData.dataStart, rowData.dataEnd), canvasImgData.width);
        }), Promise.resolve('')
    ).then((rowTmpl) => {
        mosaicElem.innerHTML += rowTmpl;
    });
}
