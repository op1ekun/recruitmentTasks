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

function getTile(x, y, tileData) {
    const redColor = [];
    const greenColor = [];
    const blueColor = [];

    // each pixel color is composed of 4 values
    for (let i = 0, l = tileData.length; i < l; i += 4) {
        redColor.push(tileData[i]);
        greenColor.push(tileData[i + 1]);
        blueColor.push(tileData[i + 2]);
    }

    const avgHexColor = rgbToHex(avgColor(redColor), avgColor(greenColor), avgColor(blueColor));

    return tileService.getTile(avgHexColor)
        .then((tmpl) => tmpl)
        .catch((err) => {
            console.error('getTile', err);
        });
}

function getRow(xTilesCount, y, rowData, canvasWidth) {
    const tileData = [];
    const tilePromises = [];

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

        tilePromises.push(getTile(x, y, tileData[x]));
    }

    return Promise.all(tilePromises)
        .then((svgTiles) => svgTiles.join(''))
        .catch((err) => {
            console.error('getRow', err);
        });
}

export function render(mosaicData) {
    // reset before rendering
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
    const rowPromises = [];

    let dataStart = 0;
    let dataEnd = canvasImgData.width * 4 * TILE_WIDTH;

    // loop thru every row
    for (let y = 0; y < yTilesCount; y++) {
        rowPromises.push(getRow(xTilesCount, y, pixelData.slice(dataStart, dataEnd), canvasImgData.width));
        // "move" range to the next row
        dataStart = dataEnd;
        dataEnd = dataStart + canvasImgData.width * 4 * TILE_WIDTH;
    }

    return rowPromises
        // keep rows rendering async, but retain the order
        .reduce((prevPromise, currPromise) =>
            prevPromise
                .then((svgTiles) => { // eslint-disable-line arrow-body-style

                    // optimization to smoothen the rendering of the rows
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            mosaicElem.innerHTML += svgTiles;
                            resolve();
                        }, 50);
                    })
                    .then(() => currPromise);
                })
        )
        // still need to process the "reduced" one
        .then((svgTiles) => {
            mosaicElem.innerHTML += svgTiles;
        });
}
