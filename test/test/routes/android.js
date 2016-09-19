/**
 * Created by jh on 2016/7/17.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

/* GET users listing. */
router.get('/register', function (req, res) {
    // register(req, res);                    // 注册
    console.log('get register');
});

router.post('/register', function (req, res) {
    register(req, res);                    // 注册
});

router.post('/login', function (req, res) {
    login(req, res);                       // 登录
});

router.post('/getinfo', function (req, res) {
    getInfo(req, res);                      //获取个人信息
});


router.post('/nearby', function (req, res) {
    getNearbyRestaurant(req, res);         // 查找附近餐馆
});

router.post('/getFriendList', function (req, res) {
    getFriendList(req, res);         // 查找好友列表
});

router.post('/getFriendInfo', function (req, res) {
    getFriendInfo(req, res);         // 查找好友信息
});

router.post('/editInfo', function (req, res) {
    editInfo(req, res);            // 修改个人信息
});

router.post("/getMenu", function (req, res) {
    getRestaurantMenu(req, res);       //查看饭店菜单
});

router.post("/addFriend", function (req, res) {
    addFriend(req, res);                //添加好友
});

router.post("/searchUser", function (req, res) {
    searchUser(req, res);               //查找用户
});

router.post('/publish', function (req, res) {
    publish(req, res);                  //发食友圈
});

router.post('/moment', function (req, res) {
    moment(req, res);                   //查看食友圈
});

router.post("/addComment", function (req, res) {
    addComment(req, res);               //增加评论
});

router.post("/getComment", function (req, res) {
    getComment(req, res);               //查看评论
});


function getNearbyRestaurant(req, res) {
    //var city = req.body.city;
    //var province = req.body.province;
    //var area = req.body.area;
    var name = req.body.name;

    var pool = getConnection();

    // var check = 'SELECT * FROM restaurant WHERE province in (select province from ';

    var resQuerySql = 'SELECT * FROM restaurant where province in (select province from user where id in (select id from user_all where username = ? ))';
    console.log(resQuerySql);
    var resQuerySql_Params = [name];

    pool.query(resQuerySql, resQuerySql_Params, function (error, rows, fields) {
        if (error) {
            throw error;
            console.log("失败");
            res.send('查找餐馆失败！');
            pool.end();
            return false;
        }
        console.log(rows);
        pool.end();
        res.send(rows)
    });
}

function register(req, res) {

    var name = req.body.name;
    var pwd = req.body.password;
    var email = req.body.email;
    var phone = req.body.phone;
    // var city = req.body.city;
    // var area = req.body.area;
    var province = req.body.address;
    var pic = req.body.pic;
    var label = req.body.prefer;

    // 查看是否有相同用户名
    var check = 'SELECT id FROM user_all WHERE username = ?';
    var check_Params = [name];

    var pool = getConnection();
    pool.query(check, check_Params, function (err, rows, fields) {

        if (err) {
            throw err;
            pool.end();
            console.log("注册失败");
            res.send('error');
            return false;
        } else if (rows.length != 0) {
            console.log("已存在");
            res.send('unsuccess');
            pool.end();
            return false;
        }

        // 用户插入身份总表
        var id;
        var userAddSql = 'INSERT INTO user_all(username, password, identity) VALUES(?, ?, 1)';  // 用户identity为1
        var userAddSql_Params = [name, pwd];
        pool.query(userAddSql, userAddSql_Params, function (err, result) {

            if (err) {
                throw err;
                pool.end();
                res.send('注册失败！');
                return false;
            }

            id = result.insertId;

            // 插入至用户表
            var userAllSql = 'INSERT INTO user(id , phone, e_mail, pic, province) VALUES(?, ?, ?, ?, ?)';
            var userAllSql_Params = [id, phone, email, pic, province];
            pool.query(userAllSql, userAllSql_Params, function (err, result) {
                if (err) {
                    throw err;
                    pool.end();
                    res.send('注册失败！');
                    return false;
                }

                //pool.end();
                //res.send('success');
            });
            //
            // var provinceSql = 'SELECT provinceid from provinces where province = ? ';
            // var provinceSql_Params = [province];
            // var provinceid;
            // pool.query(provinceSql, provinceSql_Params, function (err, rows, field) {
            //     if (err) {
            //         throw err;
            //         pool.end();
            //         res.send('注册失败！');
            //         return false;
            //     }

            //
            // provinceid = rows[0].provinceid;
            var provinceAddSql = 'UPDATE user set province = ? WHERE id = ?';
            var provinceAddSql_Params = [province, id];

            pool.query(provinceAddSql, provinceAddSql_Params, function (err, result) {
                if (err) {
                    throw err;
                    pool.end();
                    res.send('注册失败！');
                    return false;
                }

                res.send('success');
            });
            // });

            // 用户喜好插入至label表
            // var label_id;
            // var labelAddSql = 'INSERT INTO label(id, ??, identity) VALUES(?, 1, 1)';  // 用户identity为1
            // var labelAddSql_Params = [id, label];
            //
            // pool.query(labelAddSql, labelAddSql_Params, function(err, result){
            //     if(err){
            //         throw err;
            //         pool.end();
            //         res.send('注册失败！');
            //         return false;
            //     }
            //
            //     label_id = result.insertId;
            //
            //     // 插入至用户表
            //     var userAllSql = 'INSERT INTO user(id , phone, email, pic) VALUES(?, ?, ?, ?, ?)';
            //     var userAllSql_Params = [id, phone, email, pic];
            //     pool.query(userAllSql, userAllSql_Params, function(err, result){
            //         if(err){
            //             throw err;
            //             pool.end();
            //             res.send('注册失败！');
            //             return false;
            //         }
            //
            //         pool.end();
            //         res.send('success');
            //     });
            // });
        });
    });
}

function login(req, res) {
    // 从此路径检测到post方式则进行post数据的处理操作
    //get User info
    //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    var uname = req.body.username;
    var upwd = req.body.password;//获取post上来的 data数据中 uname的值

    var pool = getConnection();
    // pool.query('use sinfo');

    function strlen(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            //单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                len++;
            }
            else {
                len += 2;
            }
        }
        return len;
    }

    var check = 'SELECT * FROM user_all where username = ? and password = ? and identity = ?';
    var post = [uname, upwd, 1];
    pool.query(check, post, function (err, result) {

        if (err) {
            throw err;
            pool.end();
            res.send('fail');
        }
        else if (result[0] != null) {
            console.log('登陆成功！');
            console.log(result[0]);
            pool.end();
            res.send('sucess');
            return result;
        }
        else {
            pool.end();
            res.send('error');
            console.log('登录失败！');
        }
    });

}

function getFriendList(req, res) {
    var name = req.body.name;
    var check = 'SELECT  u.id, a.username, u.phone, u.e_mail, u.pic, u.label, u.city, u.province, u.area FROM user u, user_all a WHERE u.id = a.id and a.id IN (SELECT friend_id FROM friend WHERE user_id in (select id from user_all where username = ?))';
    var post = [name];

    var pool = getConnection();
    pool.query(check, post, function (err, result) {
        if (err) {
            throw err;
            pool.end();
            res.send('fail');
        }

        pool.end();
        console.log(result);
        res.send(result);
    });
}

function getFriendInfo(req, res) {
    var id = req.body.id;

    var check = 'SELECT * FROM user where id = ?';
    var post = [id];

    var pool = getConnection();
    pool.query(check, post, function (err, rows, result) {
        if (err) {
            throw err;
            pool.end();
            res.send('fail');
            return false;
        }
        // console.log(result);
        pool.end();
        return result;
        res.send({rows: rows});
    });
}


function editInfo(req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;

    var check = 'update user set e_mail=?, phone=? where id in (select id from user_all where username = ?)';
    var post = [email, phone, name];

    var pool = getConnection();
    pool.query(check, post, function (err, result) {
        if (err) {
            throw err;
            pool.end();
            res.send('fail');
            return false;
        }

        pool.end();
        console.log('上传成功');
        res.send('success');
    });
}

function getInfo(req, res) {

    var name = req.body.uname;

    var check = 'SELECT * FROM user WHERE id in (select id from user_all where username = ? and identity = ?)';
    var post = [name, 1];

    var pool = getConnection();
    pool.query(check, post, function (err, result) {
        if (err) {
            throw err;
            pool.end();
            res.send('fail');
            return false;
        }

        pool.end();
        console.log(result);
        res.send(result);
    });
}

function getConnection() {

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '0000',
        port: '3306',
        database: 'shiyoudb',
    });

    connection.connect(function (err) {
        if (err) {
            console.log('[query] - :' + err);
            return;
        }
        // console.log('[connection connect]  succeed!');
    });

    return connection;
}

function getRestaurantMenu(req, res) {

    var id = req.body.id;

    var querySql = 'SELECT * FROM dish WHERE id IN (SELECT dish_id FROM menu WHERE restaurant_id = ?)';
    var querySql_Params = [id];

    var connection = getConnection();
    connection.query(querySql, querySql_Params, function (error, results, field) {
        if (error) {
            throw error;
            connection.end();
            res.send('fail');
            return;
        }
        console.log(results);
        res.send(results);
    });
}

//查找用户
function searchUser(req, res) {
    var name = req.body.name;

    var query = 'SELECT * FROM user WHERE id IN (SELECT id FROM user_all WHERE username = ? )';
    var query_Params = [name];

    var connection = getConnection();
    connection.query(query, query_Params, function (error, results, field) {

        if (error) {
            throw error;
            connection.end();
            res.send('查找失败！');
            return;
        } else if (results.lenght == 0) {
            connection.end();
            res.send('不存在该用户！');
            return;
        } else {
            connection.end();
            console.log(results);
            res.send(results);
        }
    });
}

// 添加好友
function addFriend(req, res) {


    var name = req.body.name;
    var friend_id = req.body.id;

    var querySql = 'SELECT id FROM user_all WHERE username = ?';
    var querySql_Params = [name];
    var id;

    var connection = getConnection();
    connection.query(querySql, querySql_Params, function (error, results, field) {

        if (error) {
            throw error;
            connection.end();
            res.send('添加失败！');
            return;
        }

        id = results[0]['id'];
        // var querySql_Params1 = [friend_id];


        var insertSql = 'INSERT INTO friend(user_id, friend_id) VALUES(?, ?)'; // user_id  friend_id
        var insertSql_Params = [id, friend_id];
        connection.query(insertSql, insertSql_Params, function (error, results) {
            if (error) {
                throw error;
                connection.end();
                res.send('添加失败！');
                return;
            }

            connection.end();
            res.send('success');

        });
    });

}

// 发布食友圈
function publish(req, res) {

    var username = req.body.username;
    var content = req.body.content;
    var time = new Date();

    var addSql = 'INSERT INTO moments(username, time, content) values(?, ? , ?)';
    var addSql_Params = [username, time, content];

    var connection = getConnection();
    connection.query(addSql, addSql_Params, function (error, results) {
        if (error) {
            throw error;
            connection.end();
            console.log("失败");
            res.send('发布失败！');
            return;
        }

        connection.end();
        res.send('sucess');
    });
}

// 查看食友圈
function moment(req, res) {

    var username = req.body.username;

    var query = 'SELECT * FROM moments ';//WHERE username IN (SELECT fri FROM friend WHERE user_id IN (SELECT id FROM user_all WHERE username = ?))';
    //var query_Params = [username];

    var connection = getConnection();
    connection.query(query, function (error, results) {
        if (error) {
            throw error;
            connection.end();
            res.send('fail');
            return;
        }

        connection.end();
        res.send(results);
    });

}


function addComment(req, res) {

    var content = req.body.content;
    var restaurant_id = req.body.restaurant_id;
    var username = req.body.username;
    var star = req.body.star;
    var time = new Date();

    var connection = getConnection();
    var add = 'INSERT INTO comment(content, star, username, restaurant_id, time) VALUES(?, ?, ?, ?, ?)';
    var add_Params = [content, star, username, restaurant_id, time];
    connection.query(add, add_Params, function (err, result) {
        if (err) {
            throw err;
            connection.end();
            console.log("失败");
            res.send('添加失败！');
            return;
        }

        connection.end();
        res.send('sucess');
        return;
    });
}

function getComment(req, res) {

    var restaurant_id = req.body.id;

    var querySql = 'SELECT * FROM comment WHERE restaurant_id = ?';
    var querySql_Params = [restaurant_id];

    var connection = getConnection();
    connection.query(querySql, querySql_Params, function (error, results, field) {

        if (error) {
            throw error;
            connection.end();
            res.send('fail');
            return;
        }

        connection.end();
        res.send(results);

    });
}

function searchUser(req, res) {
    var name = req.body.name;

    var query = 'SELECT * FROM user WHERE id IN (SELECT id FROM user_all WHERE username = ? )';
    var query_Params = [name];

    var connection = getConnection();
    connection.query(query, query_Params, function (error, results, field) {

        if (error) {
            throw error;
            connection.end();
            res.send('查找失败！');
            return;
        } else if (results.length == 0) {
            connection.end();
            console.log("不存在");
            res.send("noexit");
            return;
        } else {
            connection.end();
            console.log(results);
            res.send(results);
        }
    });
}

module.exports = router;
