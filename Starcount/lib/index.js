import * as view from './modules/view.js';

function create(config = {}) {

    view.setConfig(config);

    return {
        render: view.render,
    };
}

window.Framework = {
    create,
};
