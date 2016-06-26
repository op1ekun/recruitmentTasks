// import mosaicRender
// import utils
// ???

const uploadImgInput = document.querySelector('#upload-img');
const canvasElem = document.querySelector('#source-img');
const mosaicElem = document.querySelector('#mosaic-img');

const DEFAULT_WIDTH = (window.innerWidth - 20) / 2;
const DEFAULT_HEIGHT = (window.innerHeight - 20) / 2;

// public to enbale unit testing
export function upload(fileList) {

}

// public to enbale unit testing
export function render() {

}

function handleFileUpload() {
    const fileList = this.files;

    upload(fileList)
        .then(render);
}

export function init() {
    uploadImgInput.addEventListener('change', handleFileUpload);
}
