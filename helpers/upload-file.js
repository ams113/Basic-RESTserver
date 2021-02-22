const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, validExt = ['png', 'jpg', 'jpeg'], dir = '' ) => {

    return new Promise( (resolve, reject) => {

        console.log('files >>>', files); 

        const { file } = files;
        const splitFile = file.name.split('.');
        const fileExt = splitFile[splitFile.length - 1];


        if (!validExt.includes(fileExt)) {
            return reject( `Invalid ${fileExt} extension, the valid ones are ${validExt}` );
        }

        const name = uuidv4() + '.' + fileExt;

        const uploadPath = path.join(__dirname, '../uploads/', dir, name);

        file.mv(uploadPath, (error) => {

            if (error) {
                console.log(error);
                reject( error );
            }

            resolve( name );
        });
    });
};


module.exports = {
    uploadFile,
};