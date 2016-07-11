import { DEFAULT_WIDTH, DEFAULT_HEIGHT, supportedEvents } from './constants.js';
import PubSub from './pubsub.js';

// TODO pass controller to the constructor
import * as uploadController from './uploadController.js';

const emitter = new PubSub();

let uploadImgInput;
let canvasElem;
let ctx;
let uploadedImg;

// TODO change to promises to avoid callback hell?
// or variables at te top of the scope
function handleImgOnload() {
    // we need caclulated values here to avoid scaling images up
    const calculatedWidth = (uploadedImg.width < DEFAULT_WIDTH ?
        uploadedImg.width : DEFAULT_WIDTH);
    const calculatedHeight = (uploadedImg.height / (uploadedImg.width > DEFAULT_WIDTH ?
        uploadedImg.width / DEFAULT_WIDTH : 1));

    canvasElem.width = calculatedWidth;
    canvasElem.height = calculatedHeight;

    ctx.drawImage(uploadedImg, 0, 0, calculatedWidth, calculatedHeight);

    const canvasImgData = ctx.getImageData(0, 0, calculatedWidth, calculatedHeight);

    // TODO simplify onImageRendered
    emitter.publish(supportedEvents.IMAGE_RENDERED, {
        canvasImgData,
        calculatedWidth,
        calculatedHeight,
    });

    uploadedImg.removeEventListener('load', handleImgOnload);
}

function handleOnChange() {
    const fileList = this.files;

    if (!fileList) {
        return;
    }

    const fileToUpload = fileList[0];

    // controller handles the upload
    uploadController.handleFileUpload(fileToUpload)
        // render image
        .then((fileSrc) => {
            uploadedImg = new Image();

            uploadedImg.addEventListener('load', handleImgOnload);
            uploadedImg.src = fileSrc;
        });
}

/**
 * Initialized the file upload view.
 *
 * @param   {String} uploadImgSel   a CSS selector for uploaded image container
 * @param   {String} sourceImgSel   a CSS selector for source image container
 * @returns {Promise}               a Promise that resolves successfuly when initialization succeeds
 */
export function init(uploadImgSel = '#upload-img', sourceImgSel = '#source-img') {

    // I have to defend my choice to use Promises for synchronous code,
    // this is done for the interface consistency.
    //
    // In my career I've already have a number of conversation when we discussed this "issue".
    // As a developer I would rather have consistency
    // than strict separate behaviour for both sync and async.
    return new Promise((resolve, reject) => {
        try {
            uploadImgInput = document.querySelector(uploadImgSel);
            canvasElem = document.querySelector(sourceImgSel);
            ctx = canvasElem.getContext('2d');

            ctx.clearRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);

            canvasElem.width = DEFAULT_WIDTH;
            canvasElem.height = DEFAULT_HEIGHT;

            uploadImgInput.addEventListener('change', handleOnChange);

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

export function on(...args) {
    emitter.subscribe(...args);
}
