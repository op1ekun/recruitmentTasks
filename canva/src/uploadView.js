import { DEFAULT_WIDTH, DEFAULT_HEIGHT, supportedEvents } from './constants.js';
import PubSub from './pubsub.js';

const emitter = new PubSub();

let uploadImgInput;
let canvasElem;

// public to enbale unit testing
export function upload(fileList) {
}

// public to enbale unit testing
export function render(imgData) {
    emitter.emit(supportedEvents.IMAGE_RENDERED, imgData);
}

function handleFileUpload() {
    const fileList = this.files;

    upload(fileList)
        .then(render);
}

export function init() {

    return new Promise((resolve, reject) => {
        try {
            uploadImgInput = document.querySelector('#upload-img');
            canvasElem = document.querySelector('#source-img');
            uploadImgInput.addEventListener('change', handleFileUpload);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}
