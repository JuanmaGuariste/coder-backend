import multer from 'multer';

export const uploadFile = (destination, extencion) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destination);
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + req.user._id + extencion);
        },
    });

    return multer({ storage });
}