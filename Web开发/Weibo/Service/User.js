/**
 * Created by zhy on 16/6/8.
 */
function User() {
    var self = this;

    var mysql = require('./Mysql');
    var connection = mysql.getConnection();

    var file = require('./File');

    this.searchUser = function (req, username, callBack) {
        var sql = 'select * from user where user.name = "' + username + '"';

        connection.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
                return;
            }

            req.session.friendInfo = {
                name: rows[0]['name'],
                location: rows[0]['location'],
                sign: rows[0]['sign'],
                focus: rows[0]['focus'],
                fan: rows[0]['fan'],
                weibo_num: rows[0]['weibo_num'],
                birthday: rows[0]['birthday'],
                img: rows[0]['img'],
                mainpage: rows[0]['mainpage']
            };

            callBack();
        })
    };

    this.search = function (req, callBack) {
        var sql = "select * from user where user.name = '" + req.body.username + "' and password = '" + req.body.password + "'";

        connection.query(sql, function (err, rows) {
            if (err) {
                
                return;
            }

            req.session.userInfo = {
                name: rows[0]['name'],
                location: rows[0]['location'],
                sign: rows[0]['sign'],
                focus: rows[0]['focus'],
                fan: rows[0]['fan'],
                weibo_num: rows[0]['weibo_num'],
                birthday: rows[0]['birthday'],
                img: rows[0]['img'],
                mainpage: rows[0]['mainpage']
            };
            
            callBack(err, rows[0]['id']);
        })
    };

    this.add = function (req, res, callBack) {
        //解析上传
        file.solveUploadedFiles(req, res, 'face', function (newName, fields) {
            var sql = 'insert into user(name, password, sign, location, birthday, img, mainpage) ' +
                'values("' +
                fields.username[0] + '","' +
                fields.password[0] + '","' +
                fields.sign[0] + '","' +
                fields.location[0] + '","' +
                fields.birthday[0] + '","' +
                '/upload/' + newName +  '","' +
                'http://127.0.0.1:8011/' + fields.username[0] + '/")';
            
            console.log(sql);

            //提交至数据库
            connection.query(sql, function (error) {
                callBack(error);
            });
        });
    };

    this.getInterestPeople = function (userId, callBack) {
        var sql = "select * from user, user_friend uf " +
            "where user.id <> " + userId + " or (" +
            "uf.user_id = " + userId + " and uf.friend_id <> user.id) " +
            "group by user.id";

        console.log(sql);

        connection.query(sql, function (err, rows) {
            if (err) {
                callBack(err);
                return;
            }
            
            callBack(rows);
        })
    };

    this.addFocus = function (req) {
       var sql = "insert into user_friend(user_id, friend_id) values(" +
           "(select id from user " +
           "where name = '" + req.session.userInfo.name + "'), " +
           "(select id from user " +
           "where name = '" + req.body.tran + "'))";

        console.log(sql);

        connection.query(sql, function (err) {
            if (err) {
                console.log(err);
            }
        })
    };

    this.logout = function (req) {
        //断开与数据库的链接
        // connection.disconnect();

        //销毁session
        req.session.destroy();
    }
}

module.exports = new User();