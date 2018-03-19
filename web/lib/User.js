
function User(us,my){
  if(req.session.user){
    var see = req.session.user.username
        var tasks1 = {
          fenlei:function(callback){
            query("select * from art_cate",function(err,data){
              callback(err,data)
            })
          },
          wz:function(callback){
            query("select * from article order by id desc",function(err,data){
              callback(err,data)
            })
          },
          se:function(callback){
            callback(null,see)
          }  
        }
        async.series(tasks1,function(err,results){
          if(err){
            console.log(err);
          }else{
            res.render(us,results)
          }
        })
  }else{
    var tasks = {
      fenlei:function(callback){
        query("select * from art_cate",function(err,data){
          callback(err,data)
        })
      },
      wz:function(callback){
        query("select * from article order by id desc",function(err,data){
          callback(err,data)
        })
      }  
    }   
    async.series(tasks,function(err,results){
      if(err){
        console.log(err);
      }else{
        res.render(my,results)
      }
    })
  }
}


module.exports = User;
