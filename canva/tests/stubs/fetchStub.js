// The svgTemplate was used only to document a specific use-case, and any arbitraty string could be used for testing.
export const SVG_TMPL = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="%d" height="%d">' +
    '<ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="#%s"></ellipse>' +
  '</svg>';

/**
 * Only works for the color endpoint.
 * Doesn't throw network errors.
 * 
 * Using a stub for HTTP calls in unit tests is a common practice eg. Angular has HttpBackend mock object.
 * This one is much simpler as there is only one API endpoint. However the its purpose remains the same.
 * We want to test if service behaves properly provided we have fetch method available.
 * The stub can be easily enhanced to provide mock object capabilities.
 *
 * @param   {String}    url an endpoint URL
 * @returns {Promise}
 */
export default function fetchStub(url) {

    return new Promise((resolve) => {
        const matched = url.match(/^\/color\/([0-9a-fA-F]{6})/);

        if (matched) {
            resolve({
                ok: true,
                text: () => new Promise((resolve) => { // eslint-disable-line no-shadow
                    resolve(SVG_TMPL.replace('%s', matched[1]).replace('%d', TILE_WIDTH));
                }),
            });
        } else {
            resolve({
                ok: false,
            });
        }
    });
}