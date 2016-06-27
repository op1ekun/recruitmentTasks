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

function drawTile(x, y, tileData) {
    const redColor = [];
    const greenColor = [];
    const blueColor = [];

    return new Promise((resolve, reject) => {
        for (let i = 0, l = tileData.length; i < l; i += 4) {
            redColor.push(tileData[i]);
            greenColor.push(tileData[i + 1]);
            blueColor.push(tileData[i + 2]);
        }

        const avgHexColor = rgbToHex(avgColor(redColor), avgColor(greenColor), avgColor(blueColor));

        tileService.getTile(avgHexColor)
            .then((tmpl) => {
                resolve(tmpl);
            })
            .catch((err) => {
                reject('drawing a tile failed', err);
            });
    });
}

function drawRow(xTilesCount, y, rowData, canvasWidth) {
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

        tilePromises.push(drawTile(x, y, tileData[x]));
    }

    return Promise.all(tilePromises)
        .then((svgTiles) => {
            mosaicElem.innerHTML += svgTiles.join('');
        })
        .catch((err) => {
            console.error('drawing a row failed', err);
        });
}

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
    const rowPromises = [];

    let dataStart = 0;
    let dataEnd = canvasImgData.width * 4 * TILE_WIDTH;

    // loop thru every row
    for (let y = 0; y < yTilesCount; y++) {
        rowPromises.push(drawRow(xTilesCount, y, pixelData.slice(dataStart, dataEnd), canvasImgData.width));
        // "move" range to the next row
        dataStart = dataEnd;
        dataEnd = dataStart + canvasImgData.width * 4 * TILE_WIDTH;
    }

    return Promise.all(rowPromises);
}
