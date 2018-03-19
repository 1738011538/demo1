var express = require('express');
var router = express.Router();
var query = require("../lib/query");
var md5 = require("md5");

/* GET home page. */
router.get('/', function(req, res, next) {
	query('select * from getNewsList',function(err,data){

		res.render('index', { news:data })
		console.log(data)
	})

});

router.get('/api/getNewsList', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	query('select title,url from getNewsList',function(err,data){
		res.json({results:data})
	})
})

router.post('/api/getOrderList', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	var getOrderListData = req.body;
	if(getOrderListData.productLabel === ''){
		query("select * from getorderlist",function(err,data){
			res.json({results:data})
		})
	}else{
		query("select * from getorderlist g where g.product=?",getOrderListData.productLabel,
			function(err,data){
			res.json({results:data})
		})
	}
})
//注册路由
router.post('/api/register', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	var d = req.body;
	query('insert into users(username,password)values(?,?)',[d.username,md5(d.password)],function(err,data){
		res.json({id:200})
	})
})

router.post('/api/login', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	var dd = req.body;
	query('select * from users where username=?',dd.username,function(err,data){
		if ( data == "") {
			res.json({ok: 11})
		}else if (md5(dd.password) == data[0].password) {
			res.json({results: data[0]})
		}else if (md5(dd.password) != data[0].password) {
			res.json({ok: 14})
		}
	})
})

router.post('/api/getPrice', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	var PriceData = req.body;
	var aaa = PriceData.version.split(',');
	if(aaa.length === 1){
		query('select * from analysis where version=? and period=? and buyType=?',
			[aaa[0],PriceData.period,PriceData.buyType],
			function(err,data){
				var priceD = data[0].price * PriceData.buyNumber;
				res.json({results:priceD});
			});
	}else{
		var newPrice = 0;
		query('select * from analysis where version in (?) and period=? and buyType=?',
			[aaa,PriceData.period,PriceData.buyType],
			function(err,data){
				for(var i=0;i<data.length;i++){
					var priceD = data[i].price * PriceData.buyNumber;
					newPrice += priceD
				}
				res.json({results:newPrice});
			});
	}
})

router.post('/api/createOrder', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	var createOrder = req.body;
	var buyDate = new Date();
	query('select * from getorderlist where product=? order by id desc',createOrder.product,function(err, data){
		var newOrderId = Number(data[0].orderId) + 1;
		query('insert into getorderlist (orderId,product,version,period,buyNum,date,amount,bankId)values(?,?,?,?,?,?,?,?)',
			[newOrderId,createOrder.product,createOrder.version,createOrder.period,createOrder.buyNumber,buyDate,createOrder.amount,createOrder.bankId],
			function(err, data){
				if(!err){
					res.json({orderId: newOrderId})
				}
			})
	})
});

router.post('/api/checkOrder', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	var checkOrderData = req.body;
	query('select * from getorderlist where orderId=?',checkOrderData.orderId,
		function(err,data){
			if(data[0] === ''){
				res.json({ok:400})
			}else{
				res.json({ok:200})
			}
		})
});

module.exports = router;
