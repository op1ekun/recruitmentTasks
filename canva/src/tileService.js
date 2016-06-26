function handleError(response) {

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response;
}

export function getTile(hexColor) {

    return Promise.resolve()
        .then(() => {
            // we want to be able to Promise.catch this error
            if (!hexColor || !hexColor.match(/^[0-9a-fA-F]{6}$/)) {
                throw new TypeError('passed value is not a hexadecimal color');
            }

            return fetch(`/color/${hexColor}`)
                .then(handleError);
        });
}
