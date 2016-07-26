export function handleFileUpload(file) {

    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new TypeError('file is undefined'));
            return;
        } else if (!(file instanceof File)) {
            reject(new TypeError('file is not an instance of File'));
            return;
        }

        const fileReader = new FileReader();

        fileReader.addEventListener('load', () => resolve(fileReader.result));
        fileReader.addEventListener('error', () => reject(fileReader.error));

        fileReader.readAsDataURL(file);
    });
}
