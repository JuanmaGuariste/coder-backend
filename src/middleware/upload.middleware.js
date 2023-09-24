import multer from 'multer';

export const uploadFile = () => {
    let extencion;
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if (file.fieldname === 'identification') {
                extencion = ".pdf";
                cb(null, 'public/documents/identification');
            } else if (file.fieldname === 'address') {
                extencion = ".pdf";
                cb(null, 'public/documents/address');
            } else if (file.fieldname === 'account') {
                extencion = ".pdf";
                cb(null, 'public/documents/account');
            } else if (file.fieldname === 'profile') {
                extencion = ".jpg";
                cb(null, 'public/profiles');
            } else {
                cb(new Error('Campo de archivo no válido'), null);
            }
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + req.user._id + extencion);
        },
    });
    return multer({ storage });
}