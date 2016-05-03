import template from './view/template.js';

const supportedEvents = [
    'keyup:clearTitle',
    'click:titleChanged',
];

let config;

function render(selector) {
    // TODO
    // compile template
    // render template
    // bind events

    // supportedEvents.map((eventName) => {
    //     if (config[eventName]) {

    //         return {
    //             eventName: config[eventName],
    //         };
    //     }
    // });
}

function setConfig(newConfig = { data: {}, template: '' }) {
    config = newConfig;
}

function getConfig() {
    return config;
}

export default {
    render,
    setConfig,
    getConfig,
};

