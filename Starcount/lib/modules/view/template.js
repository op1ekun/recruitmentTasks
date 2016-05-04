export function compile(tmplStr) {

    /* eslint arrow-body-style: ["error", "always"] */
    return (tmplData) => {

        return new Promise((resolve, reject) => {

            setTimeout(() => {
                try {
                    let parsedTmpl = tmplStr;

                    Object.keys(tmplData)
                        .forEach((valueName) => {
                            const regex = new RegExp(`{{${valueName}}}`, 'g');
                            parsedTmpl = parsedTmpl.replace(regex, tmplData[valueName]);
                        });

                    // remove not replaced values and resolve
                    resolve(parsedTmpl.replace(/{{[a-zA-Z0-9]+}}/g, ''));
                } catch (err) {
                    reject(err);
                }
            }, 0);
        });
    };
}
