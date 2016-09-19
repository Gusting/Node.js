var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', function(req, res) {
  res.render('home');
});
router.get('/home', function(req, res) {
  res.render('home');
});

router.get('/register',function(req,res){
  res.render('admin/register');  // 商家注册
});
router.post('/register',function(req,res){
  // console.log('register');
  register(req, res);      // 商家 注册
});

router.get('/login',function(req,res){
  res.render('admin/login');  // 商家注册
});
router.post('/login',function(req,res){
  login(req, res);
});

router.get('/admin', function(req, res) {
  admin_main(req, res);     // 管理员主页
  //res.render('admin_main');
});
router.get('/admin_newBusiness', function(req, res) {
  getNewRestaurant(req, res);   // 管理员 新入驻商家
});
router.get('/admin_business', function(req, res) {
  getRestaurant(req, res);     // 管理员 入驻商家
});
router.get('/admin_businessDetail*', function(req, res) {
  getRestaurantDetails(req, res); // 管理员 查看商家详情
});

router.post('/pass',function(req,res){
  pass(req, res);           // 管理员 新商家列表 审核通过
});
router.post('/reject',function(req,res){
  reject(req, res);         // 管理员 新商家列表 审核拒绝
});

router.get('/admin_eva*',function(req,res){
  evaluation(req, res);     // 管理员 商家列表 进入商家评价
});
router.post('/evaluate',function(req,res){
  eva(req, res);            // 管理员 商家评价 提交
});
router.post('/del',function(req,res){
  del(req, res);            // 管理员 商家列表 删除
});


router.get('/admin_detail',function(req,res){

  // 判断管理员是否登录
  if(req.session.username){
    res.locals.username = req.session.username;
    res.render('admin/modify');     // 管理员 修改密码
  }
  else
      res.render('admin/login');
});
router.post('/modify',function(req,res){
  modify(req, res);                 // 管理员 修改密码
});

router.get('/logout',function(req,res){

  req.session.destroy(); // 管理员 登出
  res.render('home');

});


function register(req, res) {

  console.log("----register function-------");
  var name = req.body.username;
  var pwd = req.body.password;
  var email = req.body.email;
  var telephone = req.body.telephone;
  var restaurant_name = req.body.restaurant_name;
  var manager_name = req.body.manager_name;
  var id_num = req.body.id_num;
  var address = req.body.address;
  var business_hours = req.body.business_hours;
  var introduction = req.body.introduction;
  var arr = req.body.arr;

  var pool = getConnection();

  // 插入用户总表
  var id;
  var userAddSql = 'INSERT INTO user_all(username, password, identity) VALUES(?, ?, 2)';
  var userAddSql_Params = [name, pwd];
  pool.query(userAddSql, userAddSql_Params, function(err, result){

    if (err){
      throw err;
      pool.end();
      pool = null;
      res.send('fail');
    }  // error为空 result为空

    id = result.insertId;
    console.log("result id: " + result.insertId);

    // 插入至商人列表
    var resAddSql = 'INSERT INTO restaurant(id, res_name, email, phone, address, business_hour, manager_name, manager_idnum, introduction)' +
        'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
    var resAddSql_Params = [id, restaurant_name, email, telephone, address, business_hours, manager_name, id_num, introduction];
    pool.query(resAddSql, resAddSql_Params, function(err, result){
      if (err){
        throw err;
        pool.end();
        pool = null;
        //res.send('fail');
      }
      //console.log('insert restaurant' + result.affectedRows + ' rows');
    });


    // 插入至标签列表
    var labelAddSql = 'INSERT INTO label(id, 甜点饮品, 火锅, 自助餐, 小吃快餐, 东北菜, 川湘菜, 西餐, 日韩料理, ' +
        '烧烤烤肉, 汤粥, 粤港菜, 香锅烤鱼, 西北菜, 云贵菜, 海鲜, 咖啡酒吧茶馆, 京菜鲁菜, 素食, 江浙菜, 东南亚菜, 新疆菜, 其他美食, identity)' +
        'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 2)';
    var labelAddSql_Params = [id, arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8], arr[9], arr[10],
      arr[11], arr[12], arr[13], arr[14], arr[15], arr[16], arr[17], arr[18], arr[19], arr[20], arr[21]];
    pool.query(labelAddSql, labelAddSql_Params, function(err, r){
      if (err){
        throw err;
        pool.end();
        pool = null;
        res.send('fail');
      }

      var label_id = r.insertId;
      console.log('insert Label ' + r.affectedRows + ' rows');

      // 将标签id插入至商家
      var labelSql = 'UPDATE restaurant SET label = ? WHERE id = ?';
      var labelSql_Params = [label_id, id];
      pool.query(labelSql, labelSql_Params, function(err, t){
        if (err){
          throw err;
          pool.end();
          pool = null;
          res.send("fail");
        }
        console.log('insert Label ' + t.affectedRows + ' rows');
        pool.end();
        pool = null;
        res.send("true");
      });

    });
  });
}

function admin_main(req, res){

  var pool = getConnection();
  var newQuerySql = 'SELECT res_name, phone FROM restaurant WHERE isNew = 1'; // 新入驻商家

  pool.query(newQuerySql, function (error, newrows, fields) {
    if(error) {
      throw error;
      pool.end();
      pool = null;
    }

    console.log('newrows : ' + newrows.length);

    var oldQuerySql = 'SELECT res_name, manager_name, address FROM restaurant WHERE isNew = 0'; // 已入驻商家
    pool.query(oldQuerySql, function (error, oldrows, fields) {
      if(error) {
        throw error;
        pool.end();
        pool = null;
      }

      res.render('admin/main', {newrows: newrows, oldrows: oldrows});
    });
  });
}

function  getNewRestaurant(req, res){

  var resQuerySql = 'SELECT res_name, manager_name, address, id FROM restaurant WHERE isNew = 1';
  var pool = getConnection();

  pool.query(resQuerySql, function (error, rows, fields) {
    if(error) {
      throw error;
      pool.end();
      pool = null;
    }

    pool.end();
    pool = null;
    res.render('admin/newBusinessList', {rows: rows});
  });
}

function  getRestaurant(req, res){

  var resQuerySql = 'SELECT res_name, manager_name, address, id FROM restaurant WHERE isNew = 0';
  var pool = getConnection();
  pool.query(resQuerySql, function (error, rows, fields) {
    if(error) {
      throw error;
      pool.end();
      pool = null;
    }
    
    pool.end();
    pool = null;
    res.render('admin/businessList', {rows: rows});
  });
}

function getRestaurantDetails(req, res){

  var pool = getConnection();
  var id = req.query.id;
  var resQuerySql = 'SELECT res_name, email, phone, address, introduction, business_hour, manager_name, manager_idnum,' +
      'label, star, pic FROM restaurant WHERE id = ?';
  var resQuerySql_Params = [id];

  pool.query(resQuerySql, resQuerySql_Params,function (error, rows, fields) {

    if(error) {
      throw error;
      pool.end();
      return ;
    }

    var dishQuerySql = 'SELECT * FROM dish WHERE id IN (SELECT dish_id FROM menu WHERE restaurant_id = ?)';
    pool.query(dishQuerySql, resQuerySql_Params, function (error, dishRows, fields){
      if(error){
        throw error;
        pool.end();
        return ;
      }

      pool.end();
      res.render('admin/businessDetail', {rows: rows, dishRows : dishRows});

    });
  });
}

function pass(req, res){

  var id = req.body.id;
  var pool = getConnection();

  var passSql = 'UPDATE restaurant SET isNew = 0 WHERE id = ?';
  var passSql_Params = [id];
  pool.query(passSql, passSql_Params, function (err, result) {
    if (err) {
      throw err;
      pool.end();
      res.send('fail');
    }
    console.log('pass changed ' + result.changedRows + ' rows');
    pool.end();
    if(result.changedRows == 1)
      res.send('success');
    else
      res.send('fail');

  })
}

function reject(req, res){

  var id = req.body.id;
  var pool = getConnection();

  var passSql = 'UPDATE restaurant SET isNew = 3 WHERE id = ?';
  var passSql_Params = [id];
  pool.query(passSql, passSql_Params, function (err, result) {
    if (err) {
      throw err;
      pool.end();
      res.send('fail');
    }
    console.log('pass changed ' + result.changedRows + ' rows');
    pool.end();

    if(result.changedRows == 1)
      res.send('success');
    else
      res.send('fail');
  })
}

function evaluation(req, res){

  var pool = getConnection();
  var id = req.query.id;
  var resQuerySql = 'SELECT res_name, id FROM restaurant WHERE id = ?';
  var resQuerySql_Params = [id];

  //console.log(resQuerySql);

  pool.query(resQuerySql, resQuerySql_Params,function (error, rows, fields) {

    if (error) {
      throw error;
      pool.end();
      res.send('fail');
    }

    pool.end();
    res.render('admin/evaluate', {rows: rows});
  });
}

function eva(req, res){

  var pool = getConnection();
  var id = req.body.id;
  var check = req.body.check;

  var resQuerySql = 'UPDATE restaurant SET star = ? WHERE id = ?';
  var resQuerySql_Params = [check, id];

  console.log(resQuerySql);

  pool.query(resQuerySql, resQuerySql_Params,function (error, rows, fields) {
    if(error){
      throw error;
      pool.end();
      res.send('fail');
      return false;
    }

    pool.end();
    res.send('success');
  });

}

function del(req, res){
  
  var id = req.body.id;
  var pool = getConnection();

  var delSql = 'UPDATE restaurant SET isNew = 4 WHERE id = ?';
  var delSql_Params = [id];
  pool.query(delSql, delSql_Params, function (err, result) {

    if (err) {
      throw err;
      pool.end();
      res.send('fail');
    }
    
    console.log('pass changed ' + result.changedRows + ' rows');
    pool.end();
    
    if(result.changedRows == 1)
      res.send('success');
    else
      res.send('fail');
  });

}

function login(req, res){

  var username = req.body.username;
  var password = req.body.password;

  var check = 'SELECT * FROM user_all where username = ? and password = ?';
  var check_Params = [username, password];

  var connection = getConnection();
  connection.query(check, check_Params, function (error, results, fields){
    
    if(error){
      
      throw error;
      connection.end();
      res.send('登录失败！');  
      return false;
    }else if(results.length == 0){
      
      connection.end();
      res.send('用户名密码不匹配！');
      return ;
    }else if(results[0].identity == 2){  // 商家登录
      console.log('business login');
      connection.end();

      req.session.islogin = 'success';
      req.session.username = username;
      req.session.userId = results[0].id;
      
      res.send({redirect: '/restaurant/main'});
      
    }else{  // 管理员登录
      console.log('admin login');      
      connection.end();

      req.session.islogin = 'success';
      req.session.username = username;
      req.session.userId = results[0].id;

      res.send({redirect: '/admin'});
    }
  });
}

function modify(req, res){

  var username = req.session.username;
  var old_pwd = req.body.old_pwd;
  var new_pwd = req.body.new_pwd;

  var connection = getConnection();
  var checkSql = 'SELECT * FROM user_all WHERE username = ? AND password = ?';
  var checkSql_Params = [username, old_pwd];
  connection.query(checkSql, checkSql_Params, function (error, results, fields){

    if(error){
      throw error;
      res.send('修改失败！');
      connection.end();
      return;
    }else if(results.length == 0){
      res.send('用户名密码不匹配');
      connection.end();
      return;
    }

    var updateSql = 'UPDATE user_all SET password = ? WHERE username = ?';
    var updateSql_Params = [new_pwd, username];
    connection.query(updateSql, updateSql_Params, function (err, results, fields){
      if(err){
        throw err;
        connection.end();
        res.send('修改失败！');        
        return ;        
      }

      connection.end();
      res.send('修改成功！'); 

    });

  });



}

function getConnection() {

  var mysql  = require('mysql');
  var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '0000',
    port: '3306',
    database: 'shiyoudb',
  });

  connection.connect(function(err){
    if(err){
      console.log('[query] - :'+err);
      return;
    }
    console.log('[connection connect]  succeed!');
  });

  return connection;
}



module.exports = router;
