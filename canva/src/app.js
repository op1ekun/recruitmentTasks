import UploadView from './uploadView.js';
import * as mosaicView from './mosaicView.js';

import * as uploadController from './uploadController.js';

const uploadView = new UploadView(uploadController);
// const mosaicView = new MosicaView(mosaicController);

mosaicView.init()
    .then(() => {
        uploadView.onImageRendered = (renderedImageData) => {

            mosaicView.render(renderedImageData)
                .then(() => {
                    console.log('mosaic ready');
                });
        };
    });
