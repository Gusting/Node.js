/**
 * Created by zhy on 16/6/16.
 */
function WeiBo() {
    var self = this;

    //数据库
    var mysql = require('./Mysql');
    var connection = mysql.getConnection();

    //文件
    var file = require('./File');

    this.add = function (req, res, callBack) {
        file.solveUploadedFiles(req, res, function (newName, fields) {
            //重命名成功后插入数据库
            var sql = 'insert into weibo(img, passage) values("' +
                req.url + '/' + newName + '", "' +
                fields.inputbox[0] + '")';

            console.log(sql);

            connection.query(sql, function (error) {
                if (error) {
                    res.send('<script>' +
                        'alert("数据库操作失败");' +
                        'location.href="../../"' +
                        '</script>');

                    return;
                }

                var sql2 = 'insert into user_weibo(user_id, weibo_id) values(' +
                    req.session.userId + ', (SELECT max(id) FROM weibo))';

                connection.query(sql2, function (error) {
                    if (error) {
                        res.send('<script>' +
                            'alert("数据库操作失败");' +
                            'location.href="../../"' +
                            '</script>');

                        return;
                    }

                    res.send('<script>' +
                        'alert("数据库操作成功");' +
                        'location.href="../../"' +
                        '</script>');
                });
            });
            
            callBack();
        })
    };
    
    this.getAllWeiBos = function (callBack) {
        var sql = 'select *, us.img userImg, wb.img weiBoImg from weibo wb, user_weibo uw, user us ' +
            'where us.id = uw.user_id and uw.weibo_id = wb.id ' +
            'group by wb.id ' +
            'order by wb.id desc';
        
        connection.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
                return;
            }
            
            callBack(rows);
        })
    };
    
    this.getWeibosByUserId = function (userId, callBack) {
        var sql = 'select * from weibo wb, user_weibo uw, user us ' +
            'where us.id = uw.user_id and uw.weibo_id = wb.id and uw.user_id = ' + userId +
            'order by wb.id desc ' +
            'group by wb.id';
        
        connection.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
                return;
            }
            
            callBack(rows);
        })
    }
}

module.exports = new WeiBo();