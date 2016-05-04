import * as template from './view/template.js';

const supportedEvents = [
    'keyup:titleChanged',
    'click:clearTitle',
];

let config;

export function render(selector) {

    const tmplStr = document.querySelector(config.template).innerHTML;
    const compiledTmpl = template.compile(tmplStr);
    const contentElem = document.querySelector(selector);

    return compiledTmpl(config.data)
        .then((parsedTmpl) => {
            contentElem.innerHTML = parsedTmpl;

            supportedEvents.forEach((eventName) => {
                const eventElem = contentElem.querySelector(`${selector} > *[data-event="${eventName}"]`);
                const [type, handler] = eventName.split(':');

                if (eventElem && config[handler]) {
                    eventElem.addEventListener(type, config[handler]);
                }
            });
        });

}

export function setConfig(newConfig = { data: {}, template: '' }) {
    config = newConfig;
}

export function getConfig() {
    return config;
}

