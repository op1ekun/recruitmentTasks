import { TILE_WIDTH } from './constants.js';

export const SVG_TMPL = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="%d" height="%d">' +
    '<ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="#%s"></ellipse>' +
  '</svg>';

export function getTile(hexColor) {

    return new Promise((resolve, reject) => {
        // we want to be able to Promise.catch this error
        if (!hexColor) {
            reject(new ReferenceError('hexColor is undefined'));
        } else if (!hexColor.match(/^[0-9a-fA-F]{6}$/)) {
            reject(new TypeError('hexColor is not a hexadecimal color'));
        } else {
            setTimeout(() => {
                resolve(SVG_TMPL.replace('%s', hexColor).replace(/%d/g, TILE_WIDTH));
            }, 16);
        }
    });
}
