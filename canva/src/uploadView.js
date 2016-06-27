import { DEFAULT_WIDTH, DEFAULT_HEIGHT, supportedEvents } from './constants.js';
import PubSub from './pubsub.js';

const emitter = new PubSub();

let uploadImgInput;
let canvasElem;
let ctx;

function handleFileUpload() {
    const fileList = this.files;

    if (!fileList) {
        return;
    }

    const fileToUpload = fileList[0];
    const fileReader = new FileReader();
    const uploadedImg = new Image();

    function handleReaderOnload() {
        uploadedImg.src = fileReader.result;
        fileReader.removeEventListener('load', handleReaderOnload);
    }

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

        emitter.publish(supportedEvents.IMAGE_RENDERED, {
            canvasImgData,
            calculatedWidth,
            calculatedHeight,
        });

        uploadedImg.removeEventListener('load', handleFileUpload);
    }

    fileReader.addEventListener('load', handleReaderOnload);
    uploadedImg.addEventListener('load', handleImgOnload);

    fileReader.readAsDataURL(fileToUpload);
}

export function init() {

    return new Promise((resolve, reject) => {
        try {
            uploadImgInput = document.querySelector('#upload-img');
            canvasElem = document.querySelector('#source-img');
            ctx = canvasElem.getContext('2d');

            ctx.clearRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);

            canvasElem.width = DEFAULT_WIDTH;
            canvasElem.height = DEFAULT_HEIGHT;

            uploadImgInput.addEventListener('change', handleFileUpload);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

export function on(...args) {
    emitter.subscribe(...args);
}
