/**
 * Created by zhy on 16/6/16.
 */
//0: home, 1: user, 2: friend
function PageCtrl() {
    var self = this;

    //数据库
    var mysql = require('./Mysql');
    var connection = mysql.getConnection();

    //用户
    var user = require('./User');

    //微博
    var weiBo = require('./WeiBo');

    this.table;
    this.css;

    this.changeHeaderTable = function (req, pageNo) {
        switch (pageNo) {
            case 0:
                self.table = '<form action="../upload" method="post" enctype="multipart/form-data">' +
                    '<table width="100%" border="0" cellpadding="0" cellspacing="0" id="input">' +
                    '<tr>' +
                    '<td width="160" height="48">&nbsp;</td>' +
                    '<td width="479">&nbsp;</td>' +
                    '<td width="31">&nbsp;</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td height="84">&nbsp;</td>' +
                    '<td>' +
                    '<textarea id="inputbox" name="inputbox" cols="45" rows="5"></textarea>' +
                    '</td>' +
                    '<td>&nbsp;</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>&nbsp;</td>' +
                    '<td align="right" valign="top">' +
                    '<a class="upload" href="#"><img src="../images/imgupload.png" width="47" height="22" align="absmiddle"/></a>' +
                    '<input class="upload" type="file" style="display: none;" name="image">' +
                    '<a href="#">' +
                    '<img class="input" src="../images/btn_input.png" width="100" height="26" align="absmiddle"/>' +
                    '</a>' +
                    '</td>' +
                    '<td>&nbsp;</td>' +
                    '</tr>' +
                    '</table>' +
                    '<input type="text" name="action" value="submit_weibo">' +
                    '<input class="input" type="submit" style="display: none">' +
                    '</form>';

                self.css = 'home';

                break;

            case 1:
                var userInfo = req.session.userInfo;

                self.table = '<table width="90%" border="0" align="center" cellpadding="0" cellspacing="0" id="curruser">' +
                    '<tbody><tr>' +
                    '<td width="24%"><img src="' + userInfo.img + '" width="120" height="120" class="userphoto"></td>' +
                    '<td width="76%" valign="top"><table width="100%" border="0" cellpadding="0" cellspacing="0" id="curruserdetail">' +
                    '<tbody><tr>' +
                    '<td class="title">' + userInfo.name + '</td>' +
                    '</tr><tr>' +
                    '<td><p><a href="#">' + userInfo.mainpage + '<br>' +
                    '</a>' + userInfo.location + '<a href="#">' +
                    '</a><br>' +
                     userInfo.sign + '<br>' +
                    '<a href="myface.html">修改头像</a> | <a href="userinfo.html">修改签名</a></p></td>' +
                    '</tr>' +
                    '</tbody></table></td>' +
                    '</tr>' +
                    '</tbody></table>';

                self.css = 'user';

                break;

            case 2:
                self.table = ' <table border="0" align="center" cellpadding="5" cellspacing="0" id="guanzhu">' +
                    '<tr>' +
                    '<td>我关注了5个人</td><td align="right"><form id="form2" name="form1" method="post" action="">' +
                    '</form></td>' +
                    '</tr>' +
                    '</table>';

                self.css = 'friend';

                break;

            default:
                break;
        }
    };

    this.geneWeiboContains = function (userId, callBack) {
        //userId不存在, 获取所有微博
        if (!userId) {
            weiBo.getAllWeiBos(function (rows) {
                callBack(solveWeiBos(rows));
            })
        }
        else {
            weiBo.getWeibosByUserId(userId, function (rows) {
                callBack(solveWeiBos(rows));
            })
        }
    };

    function solveWeiBos(rows) {
        var weibos = [];

        rows.forEach(function (row) {
            var weibo = {
                name: row.name,
                passage: row.passage,
                img: ".." + row.weiBoImg,
                userImg: ".." + row.userImg
            };

            weibos.push(weibo);
        });

        return weibos;
    }
}

module.exports = new PageCtrl();