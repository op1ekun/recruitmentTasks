import UploadView from './uploadView.js';
import MosaicView from './mosaicView.js';

import * as uploadController from './uploadController.js';
import * as tileService from './tileService';

const uploadView = new UploadView(uploadController);
// the view receives data only from the tile service
// there seem to be no point for adding additional abstraction
// when one already exists
const mosaicView = new MosaicView(tileService);

uploadView.onImageRendered = (renderedImageData) => {
    mosaicView.render(renderedImageData)
        .then(() => {
            console.log('mosaic ready');
        });
};
