import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from './constants.js';

export default class UploadView {

    constructor(uploadController, uploadImgSel = '#upload-img', sourceImgSel = '#source-img') {
        if (!uploadController) {
            throw new ReferenceError('controller is undefined');
        } if (typeof uploadController !== 'object') {
            throw new TypeError('controller is not an object');
        }

        const uploadImgInput = document.querySelector(uploadImgSel);
        const canvasElem = document.querySelector(sourceImgSel);
        const ctx = canvasElem.getContext('2d');

        ctx.clearRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);

        canvasElem.width = DEFAULT_WIDTH;
        canvasElem.height = DEFAULT_HEIGHT;

        this.onImageRendered = null;

        /**
         * [description]
         *
         * @param   {[type]} fileSrc [description]
         * @returns {[type]}         [description]
         */
        const renderImage = (fileSrc) => {
            const uploadedImg = new Image();

            return new Promise((resolve, reject) => {

                uploadedImg.addEventListener('load', () => {
                    // we need caclulated values here to avoid scaling images up
                    const calculatedWidth = (uploadedImg.width < DEFAULT_WIDTH ?
                        uploadedImg.width : DEFAULT_WIDTH);
                    const calculatedHeight = (uploadedImg.height / (uploadedImg.width > DEFAULT_WIDTH ?
                        uploadedImg.width / DEFAULT_WIDTH : 1));

                    canvasElem.width = calculatedWidth;
                    canvasElem.height = calculatedHeight;

                    ctx.drawImage(uploadedImg, 0, 0, calculatedWidth, calculatedHeight);

                    const canvasImgData = ctx.getImageData(0, 0, calculatedWidth, calculatedHeight);

                    resolve({
                        canvasImgData,
                        calculatedWidth,
                        calculatedHeight,
                    });
                });

                uploadedImg.addEventListener('error', reject);
                uploadedImg.src = fileSrc;
            });
        };

        /**
         * [description]
         *
         * @returns {[type]} [description]
         */
        const handleOnChange = () => {
            const fileList = uploadImgInput.files;

            if (!fileList) {
                return;
            }

            const fileToUpload = fileList[0];

            // controller handles the upload
            uploadController.handleFileUpload(fileToUpload)
                // view handles rendering the image
                .then((fileSrc) => renderImage(fileSrc))
                // and notifying whoever is listenting when ready
                .then((imageData) => {
                    this.onImageRendered(imageData);
                });
        };

        uploadImgInput.addEventListener('change', handleOnChange);
    }
}
