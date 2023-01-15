// seteo multer <-- iria a utils (es users y tambien prod eventualmente)
import multer from 'multer';
import path from 'path'

const storage = multer.diskStorage({
    destination: './public/images',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if(mimetype && extname){
        return cb(null, true)
    }else{
        cb('Error: Solo se permiten imagenes!')
    }
}

export const upload = multer({
    storage: storage,
    limits:{fieldSize: 1000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('myImage')