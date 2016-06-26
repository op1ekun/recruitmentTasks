import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from './constants.js';

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

export function render(mosaicData) {

    return new Promise((resolve, reject) => {

    });
}
