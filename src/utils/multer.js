import multer from 'multer';
import path from 'path'

const profilePicStorage = multer.diskStorage({
    destination: './public/images/profilePics',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const productStorage = multer.diskStorage({
    destination: './public/images/productPics',
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

export const uploadProductPic = multer({
    storage: productStorage,
    limits:{fieldSize: 1000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
})

export const uploadProfilePicNew = multer({
    storage: profilePicStorage,
    limits:{fieldSize: 1000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
})