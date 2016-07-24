/**
 * Created by zhy on 16/6/8.
 */
function RequestParser(app) {
    var bodyParser = require('body-parser');
    var urlEncodedParser = bodyParser.urlencoded({extended: false});

    //用户
    var user = require('./User');

    //路径解析
    var path = require('path');

    //express
    var express = require('express');

    //页面控制器
    var pageCtrl = require('./PageCtrl');
    
    //微博
    var weiBo = require('./WeiBo');

    //公有函数
    this.parseRequest = function () {
        if (app) {
            //post请求
            app.post('/', urlEncodedParser, function (req, res) {
                switch (req.body.action) {
                    //登录
                    case 'login':
                        login(req, res);
                        break;
                    //修改密码
                    case 'update_password':
                        updatePassword(req, res);
                        break;
                    //登出
                    case 'logout':
                        logout(req, res);
                        break;
                    case 'focus':
                        addFocus(req, res);
                        break;

                    default:
                        break;
                }
            });

            //访问根目录
            app.get('/', urlEncodedParser, function (req, res) {
                user.searchUser(req, req.body.username, function (err, userId) {
                    if (req.session.userId == undefined || !req.session.userId) {
                        res.redirect('/view/index.html');
                    }
                    else {
                        res.redirect('/view/home.html');
                    }
                });
            });
            
            //访问登陆页
            app.get('/view/index.html', urlEncodedParser, function (req, res) {
                if (req.session.userId != undefined || req.session.userId) {
                    res.redirect('/view/home.html');
                }
                else {
                    res.sendFile(path.join(__dirname, '../Public/view/index.html'));
                }
            });

            //注册
            app.post('/register', urlEncodedParser, function (req, res) {
                register(req, res);
            });

            //访问主页
            app.get('/view/home.html', urlEncodedParser, function (req, res) {
                if (req.session.userId != undefined || req.session.userId) {
                    pageCtrl.changeHeaderTable(req, 0);
                    renderd(0, req, res);
                }
                else {
                    res.redirect('/view/index.html');
                }
            });

            //访问用户页
            app.get('/view/user.html', urlEncodedParser, function (req, res) {
                if (req.session.userId != undefined || req.session.userId) {
                    pageCtrl.changeHeaderTable(req, 1);
                    renderd(1, req, res);
                }
                else {
                    res.redirect('/view/index.html');
                }
            });

            //访问朋友页
            app.get('/view/friend.html', urlEncodedParser, function (req, res) {
                if (req.session.userId != undefined || req.session.userId) {
                    pageCtrl.changeHeaderTable(req, 2);
                    renderd(1, req, res);
                }
                else {
                    res.redirect('/view/index.html');
                }
            });

            app.post('/upload', urlEncodedParser, function (req, res) {
                //提交微博
                submitWeiBo(req, res);
            });
        }
    };

    //私有函数
    function login(req, res) {
    // || req.body.Captcha == ""
        if (req.body.username == "" || req.body.password == "") {
            res.send('<script type="text/javascript">' +
                'alert("请完成输入");' +
                'location.href="' + req.headers.referer + '"' +
                '</script>');
            return;
        }

        //session id 赋值
        user.search(req, function (err, userId) {
            //输入错误判断
            if (err) {
                res.send('<script type="text/javascript">' +
                    'alert("未知错误");' +
                    'location.href="' + req.headers.referer + '"' +
                    '</script>');
                return;
            }
            if (!userId) {
                res.send('<script type="text/javascript">' +
                    'alert("用户不存在或密码错误");' +
                    'location.href="' + req.headers.referer + '"' +
                    '</script>');
                return;
            }

            //赋值
            req.session.userId = userId;

            //若登录失败
            if (req.session.userId == undefined || !req.session.userId) {
                res.send('<script type="text/javascript">' +
                    'alert("登录失败");' +
                    'location.href="' + req.headers.referer + '"' +
                    '</script>');
                return;
            }

            //登录成功
            res.redirect("/view/home.html");
        });
    }

    function register(req, res) {
        if (req.body.password == "" || req.body.password_confirm == "" || req.body.username == "") {
            res.send('<script type="text/javascript">' +
                'alert("请完成输入");' +
                'location.href="' + req.headers.referer + '"' +
                '</script>');
            return;
        }

        if (req.body.password != req.body.password_confirm) {
            res.send('<script type="text/javascript">' +
                'alert("两次密码输入不同");' +
                'location.href="' + req.headers.referer + '"' +
                '</script>');
            return;
        }

        user.add(req, res, function (error) {
            if (error) {
                res.send('<script type="text/javascript">' +
                    'alert("注册失败!请重试");' +
                    'location.href="' + req.headers.referer + '"' +
                    '</script>');
                return;
            }

            res.send('<script type="text/javascript">' +
                'alert("注册成功");' +
                'location.href="/"' +
                '</script>');
        });
    }

    function updatePassword(req, res) {
        if (req.body.new_password != req.body.new_password_confirm) {
            res.send('<script type="text/javascript">' +
                'alert("两次密码输入不符");' +
                'location.href="' + req.headers.referer + '"' +
                '</script>');

            return;
        }

        var userId = req.session.userId;

        if (!userId || userId == undefined) {
            user.search(req, function (error, rows) {
                if (error) {
                    res.send('<script type="text/javascript">' +
                        'alert("用户不存在");' +
                        'location.href="' + req.headers.referer + '"' +
                        '</script>');

                    return;
                }

                userId = rows[0].id;
                userUpdate(userId);
            })
        }
        else {
            userUpdate(userId);
        }

        function userUpdate(userId) {
            user.update(userId, req.body.old_password, ['password'], [req.body.new_password], function (error) {
                if (error) {
                    res.send('<script type="text/javascript">' +
                        'alert("更新失败");' +
                        'location.href="' + req.headers.referer + '"' +
                        '</script>');

                    return;
                }

                res.send('<script type="text/javascript">' +
                    'alert("更新成功");' +
                    'location.href="/"' +
                    '</script>');

                //登出
                user.logout(req);
            })
        }
    }

    function addFocus(req, res) {
        user.addFocus(req);
    }

    function logout(req, res) {
        user.logout(req);
        res.send('1');
    }

    function submitWeiBo(req, res) {
        weiBo.add(req, res, function () {

        })
    }

    function renderd(pageNo, req, res) {
        if (!pageNo) {//0: home
            pageCtrl.geneWeiboContains(null, function (weibos) {
                user.getInterestPeople(req.session.userId, function (users) {
                    res.render('home', {
                        table: pageCtrl.table,
                        weibos: weibos,
                        user: req.session.userInfo,
                        interests: users,
                        css: pageCtrl.css
                    })
                })
            })
        }
        else {//1: user
            pageCtrl.geneWeiboContains(req.session.userId, function (weibos) {
                user.getInterestPeople(req.session.userId, function (users) {
                    res.render('home', {
                        table: pageCtrl.table,
                        weibos: weibos,
                        user: req.session.userInfo,
                        interests: users,
                        css: pageCtrl.css
                    })
                })
            });
        }
    }
}

module.exports = RequestParser;