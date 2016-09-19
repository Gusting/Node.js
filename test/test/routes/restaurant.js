var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// var formidable = require('formidable');
// var fs = require('fs');

/* GET users listing. */
router.get('/upload', function(req, res) {
  if(req.session.username)
    res.render('restaurant/uploadRecipe');    // 菜谱上传 浏览
  else
    res.redirect('/login');
});


router.post('/upload', function(req, res) {

  if(req.session.username)
    upload(req, res);                         // 菜谱上传 提交
  else
    res.redirect('/login');


  // var form = new formidable.IncomingForm();    // 创建上传表单
  // form.encoding = 'utf-8';		               // 设置编辑 设置表单域的编码
  // form.uploadDir = '/public/upload';	       // 设置上传目录
  // form.keepExtensions = true;	               // 保留后缀 设置该属性为true可以使得上传的文件保持原来的文件的扩展名。
  // // form.type = true;
  // // form.multiples = false;
  // form.maxFieldsSize = 2 * 1024 * 1024;        // 文件大小  限制所有存储表单字段域的大小（除去file字段），如果超出，则会触发error事件，默认为2M
  //
  // var post = {};
  //
  //
  // form.parse(req, function(err, fields, files) {
  //
  //   if(err){
  //     throw err;
  //   }
  //
  //   console.dir( fields);//这里就是post的XXX 的数据
  //   console.dir( files);//这里就是上传的文件
  //
  //   console.log('11111');
  // });
  
  
});


router.post('/uploadPic', function(req, res) {
  uploadPic(req, res);                      // 菜谱上传图片 提交
});

router.get('/recipeList', function(req, res) {
  // res.render('restaurant/recipeList');   // 菜谱列表
  if(req.session.username)
    getRecipeList(req, res);
  else
    res.redirect('/login');      
  
});
router.get('/recipeDetails*', function(req, res) {
  getRecipeDetails(req, res);                  // 菜谱详情
});
router.post('/delete', function(req, res) {
  deleteRecipe(req, res);                  // 删除菜谱
});
router.get('/modifyRecipe*', function(req, res) {
  res.locals.username = req.session.username;
  
  modifyRecipe(req, res);                  // 修改菜谱
});
router.post('/modifyRecipe', function(req, res) {
  modifyRecipeSubmit(req, res);            // 修改菜谱
});

router.get('/detail', function(req, res) {
  if(req.session.username)
    detail(req, res);                       // 餐馆细节
  else
    res.redirect('/login');
});

router.get('/main', function(req, res) {
  
  if(req.session.username)
    getMain(req, res);                       // 获取主页
  else
    res.redirect('/login');

});
router.get('/comment', function(req, res) {
  if(req.session.username)                 // 评论列表
    getComment(req, res);
  else
    res.redirect('/login');

  // res.render('restaurant/comment');
});

router.get('/modify', function(req, res) {
  if(req.session.username)                 // 修改商家信息
      getRestaurantInfo(req, res);
    // res.render('restaurant/modifyRestaurant');
  else
    res.redirect('/login');
});
router.post('/modify', function(req, res) {
  modifyRestaurant(req, res);              // 修改商家信息
});

router.get('/recipeDisplay', function(req, res) {
  res.render('restaurant/recipeDisplay');
});

router.get('/logout',  function(req, res){
  
  req.session.destroy(); // 管理员 登出
  // res.render('home');
  res.redirect('/home');
});


function uploadPic(req, res){

  var form = new formidable.IncomingForm();    // 创建上传表单
  form.encoding = 'utf-8';		               // 设置编辑 设置表单域的编码
  form.uploadDir = '/public/upload';	       // 设置上传目录
  form.keepExtensions = true;	               // 保留后缀 设置该属性为true可以使得上传的文件保持原来的文件的扩展名。
  // form.type = true;
  // form.multiples = false;
  form.maxFieldsSize = 2 * 1024 * 1024;        // 文件大小  限制所有存储表单字段域的大小（除去file字段），如果超出，则会触发error事件，默认为2M

  var post = {};

  form.parse(req, function(err, fields, files) {
    console.log('11111');
  });

  // form
  //     .on('field', function(field, value) {
  //       post[field] = value;
  //     });
  
    // form.parse(req, function(err, fields, files) {
  //  
  //   console.log('--------- form parse');
  //
  //   if (err) {
  //     // res.locals.error = err;
  //     // res.render('index', { title: TITLE });
  //     return;
  //   }
  //
  //   var extName = '';  //后缀名
  //   switch (files.pic.type) {
  //     case 'image/pjpeg':
  //       extName = 'jpg';
  //       break;
  //     case 'image/jpeg':
  //       extName = 'jpg';
  //       break;
  //     case 'image/png':
  //       extName = 'png';
  //       break;
  //     case 'image/x-png':
  //       extName = 'png';
  //       break;
  //   }
  //
  //   if(extName.length == 0){
  //     res.locals.error = '只支持png和jpg格式图片';
  //     res.render('index', { title: TITLE });
  //     return;
  //   }
  //
  //   var avatarName = Math.random() + '.' + extName;
  //   var newPath = form.uploadDir + avatarName;
  //
  //   console.log(newPath);
  //   fs.renameSync(files.file.path, newPath);  //重命名
  //   return newPath;
  //
  // });

  // res.locals.success = '上传成功';
  // res.render('index', { title: TITLE });

}


function upload(req, res){

  var name = req.body.name;
  var introduction = req.body.introduction;
  var major = req.body.major;
  var minor = req.body.minor;
  var method = req.body.method;
  var time = req.body.time;
  var procedure = req.body.procedure;
  var tip = req.body.tip;
  var flavour = req.body.flavour;
  var avoid = req.body.avoid;
  var price = req.body.price;
  var isRecommended = req.body.isRecommended;
  var img1 = req.body.img1;
  var img2 = req.body.img2;
  
  //var add1 = uploadPic(req, res, img1);
  
  // 插入dish表
  var dish_id;
  var connection = getConnection();
  var uploadSql = 'INSERT INTO dish(name, introduction, major_material, minor_material, method, time, process, tips, flavour, ' +
      'avoid, price, isRecommend) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  var upload_Params = [name, introduction, major, minor, method, time, procedure, tip, flavour, avoid, price, isRecommended];

  connection.query(uploadSql, upload_Params,function (error, result) {

    if(error) {
      throw error;
      res.send('上传失败！');
      connection.end();
      return ;
    }

    dish_id = result.insertId;

    // 插入 menu 表
    var menuSql = 'INSERT INTO menu VALUES(?, ?)';   // restaurant_id dish_id
    var menu_Params = [24, dish_id];
    connection.query(menuSql, menu_Params,function (err, result){
      if(err){
        throw error;
        connection.end();
        res.send('上传失败！');
        return ;
      }

      connection.end();
      res.send('上传成功！');
    } );
    
  });
}

function detail(req, res){

  var id = req.session.userId;

  var check = 'SELECT * FROM restaurant WHERE id = ?';
  var check_Params = [id];

  var connection = getConnection();
  connection.query(check, check_Params, function(err, result, field){

    if(err){
      throw err;
      connection.end();
      return ;      
    }

    // var checklabel = 'SELECT * FROM label WHERE id = ?';
    // var checklabel_Params = [id];
    // connection.query(check, check_Params, function(err, labelresult, field){
    //   if(err){
    //     throw err;
    //     connection.end();
    //     return;
    //   }
    //
    //   connection.end();
    //   res.render('restaurant/details', {result : result, labelresult : labelresult, username : req.session.username});
    // });

    connection.end();
    res.render('restaurant/details', {result : result, username : req.session.username});
  });

}

function getRecipeList(req, res){

  var id = req.session.userId;

  var querySql = 'SELECT * FROM dish WHERE id IN( SELECT dish_id FROM menu WHERE restaurant_id = ?) AND del = ?';
  var query_Params = [id, 0];

  var connection = getConnection();
  connection.query(querySql, query_Params,function (error, rows, fields) {

    if(error) {
      throw error;
      connection.end();
    }

    connection.end();
    res.render('restaurant/recipeList', {rows: rows});
  });
}

function getRecipeDetails(req, res){

  var id = req.query.id;
  // console.log(id);

  var querySql = 'SELECT * FROM dish WHERE id = ?';
  var query_Params = [id];

  var connection = getConnection();

  connection.query(querySql, query_Params,function (error, rows, fields) {

    if(error) {
      throw error;
      connection.end();
    }

    connection.end();
    res.render('restaurant/recipeDetails', {rows: rows});
  });
}

function deleteRecipe(req, res){

  var id = req.body.id;

  var connection = getConnection();
  var updateSql = 'UPDATE dish SET del = 1 WHERE id = ?';
  var updateSql_Params = [id];
  connection.query(updateSql, updateSql_Params, function (err, result) {

    if (err) {
      throw err;
      connection.end();
      res.send('删除失败！');
      return ;
    }

    console.log('deleted ' + result.affectedRows + ' rows');
    connection.end();
    res.send('删除成功！');

  })
}

function modifyRecipe(req, res){

  var id = req.query.id;

  var querySql = 'SELECT * FROM dish WHERE id = ?';
  var query_Params = [id];

  var connection = getConnection();

  connection.query(querySql, query_Params,function (error, rows, fields) {

    if(error) {
      throw error;
      connection.end();
    }

    connection.end();
    res.render('restaurant/modifyRecipe', {rows: rows, username : req.session.username});
  });

}

function getComment(req, res){

  var id = req.session.userId;

  var querySql = 'SELECT * FROM comment WHERE restaurant_id = ?';
  var querySql_Params = [id];

  var connection = getConnection();
  connection.query(querySql, querySql_Params,function (error, rows, fields){
    if(error){
      throw error;
      connection.end();
      return ;
    }
    
    res.render('restaurant/comment', { rows : rows, username : req.session.username});
  });
}

function getRestaurantInfo(req, res){
  var id = req.session.userId;

  var getInfoSql = 'SELECT * FROM restaurant WHERE id = ?';
  var getInfoSql_Params = [id];
  
  var connection = getConnection();
  connection.query(getInfoSql, getInfoSql_Params, function (error, rows, fields){
    if(error){
      throw error;
      connection.end();
      return ;
    }
    
    res.render('restaurant/modifyRestaurant', { rows : rows, username : req.session.username});
  });
}

function modifyRestaurant(req, res){

  var id = req.session.userId;
  var res_name = req.body.res_name;
  var introduction = req.body.introduction;
  var manager_name = req.body.manager_name;
  var manager_idnum = req.body.manager_idnum;
  var phone = req.body.phone;
  var email = req.body.email;
  var address = req.body.address;
  var business_hour = req.body.business_hour;

  var connection = getConnection();
  var modifySql = 'UPDATE restaurant SET res_name = ?, email = ?, phone = ?, address = ?, introduction = ?, business_hour = ?, ' +
      'manager_name = ?, manager_idnum = ? WHERE id = ?';
  var modifySql_Params = [res_name, email, phone, address, introduction, business_hour, manager_name, manager_idnum, id];
  connection.query(modifySql, modifySql_Params, function (err, result){
   
    if(err){
      throw err;
      connection.end();
      res.send('修改失败！');
      return ;
    }

    // console.log('修改 ' + result.affectedRows);
    connection.end();
    res.send('修改成功');
    
  });

}

function modifyRecipeSubmit(req, res){

  var id = req.body.id;
  var introduction = req.body.introduction;
  var major = req.body.major;
  var minor = req.body.minor;
  var email = req.body.email;
  var method = req.body.method;
  var time = req.body.time;
  var procedure = req.body.procedure;
  var tips = req.body.tips;
  var flavour = req.body.flavour;
  var avoid = req.body.avoid;
  var price = req.body.price;
  var isRecommended = req.body.isRecommended;

  var connection = getConnection();
  var updateSql = 'UPDATE dish SET introduction = ?, major_material = ?, minor_material = ?, method = ?, time = ?, process = ?, ' +
      'tips = ?, flavour = ?, avoid = ?, price = ?, isRecommend = ? WHERE id = ?';
  var updateSql_Params = [introduction, major, minor, method, time, procedure, tips, flavour, avoid, price, isRecommended, id];
  connection.query(updateSql, updateSql_Params, function (err, result){
    if(err){
      throw err;
      res.send('修改失败！');
      connection.end();
      return ;
    }

    connection.end();
    res.send('修改成功！');

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
    // console.log('[connection connect]  succeed!');
  });

  return connection;
}

function getMain(req, res){
  var id = req.session.userId;
  var username = req.session.username;

  var connection = getConnection();
  var comment = 'SELECT * FROM comment WHERE restaurant_id = ?';
  var comment_Params = [id];
  connection.query(comment, comment_Params, function (err, commentList, field){

    if(err){
      throw err;
      connection.end();
      return false;
    }

    var recipe = 'SELECT * FROM dish WHERE id IN (SELECT dish_id FROM menu WHERE restaurant_id = ?)';
    connection.query(recipe, comment_Params, function (err, dishList, field){
      if(err){
        throw err;
        connection.end();
        return false;
      }

      connection.end;
      res.render('restaurant/main', {commentList : commentList, dishList : dishList, id : id, username : username});
    });
  });
}

module.exports = router;
