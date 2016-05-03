import view from './view.js';

function create(config = {}) {

    view.setConfig(config);

    return {
        render: view.render,
    };
}

export default {
    create,
};
