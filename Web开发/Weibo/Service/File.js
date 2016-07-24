/**
 * Created by zhy on 2016/6/17.
 */
exports.solveUploadedFiles = function (req, res, fileType, callBack) {
    //文件
    var fs = require('fs');

    //路径
    var path = require('path');

    //文件表单处理
    var multiparty = require('multiparty');
    
    
    var newPath = path.join(__dirname, "../Public/upload/");

    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: newPath});

    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('Parser error: ' + err);
        }
        else {
            console.log(files);

            //各种文件路径
            var inputFile = files.image[0];
            var uploadedPath = inputFile.path;
            var newName = req.session.userId + "_" + fileType + "_" + inputFile.originalFilename;
            var dstPath = newPath + newName;
            // console.log(dstPath);

            //检查文件是否已存在
            if (fs.existsSync(dstPath) == true) {
                res.send('<script>' +
                    'alert("文件已存在");' +
                    'location.href="../../"' +
                    '</script>');
                return;
            }

            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                    res.send('<script>' +
                        'alert("上传失败");' +
                        'location.href="../../"' +
                        '</script>');

                    return;
                }

                console.log('rename ok');
                console.log(req.url);
                
                //文件处理完成后
                callBack(newName, fields);
            })
        }
    })
};