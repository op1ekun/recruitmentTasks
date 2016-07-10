import { supportedEvents } from './constants.js';
import * as uploadView from './uploadView.js';
import * as mosaicView from './mosaicView.js';

uploadView.init()
    .then(mosaicView.init)
    .then(() => {
        // process uploaded images
        uploadView.on(supportedEvents.IMAGE_RENDERED, (renderedImageData) => {

            mosaicView.render(renderedImageData)
                .then(() => {
                    console.log('mosaic ready');
                });
        });
    });

