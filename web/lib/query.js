/**
 * Created by 50492 on 2017/11/25.
 */
var mysql = require("mysql");//引入mysql
var conf = require("./conf");//引入mysql路由

//创建query函数
function query(){

    var connection = mysql.createConnection(conf);//创建连接

    connection.connect();//启动
//判断传入几个参数
    if(arguments.length == 2){
//传入两个参数
        var sql = arguments[0];
        var fn = arguments[1];

//执行sql语句
        connection.query(sql,function(err,data){
//回掉函数
            fn(err,data);

        })

    }
//传入三个参数
    if(arguments.length == 3){

        var sql = arguments[0];
        var arr = arguments[1];
        var fn = arguments[2];

        connection.query(sql,arr,function(err,data){

            fn(err,data);

        })

    }
//终止连接
    connection.end();


}

module.exports = query;

