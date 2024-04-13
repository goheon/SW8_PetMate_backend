import multer from "multer";

export const uploadFiles=multer({
    //파일저장위치
    dest:"public/images/",
})

