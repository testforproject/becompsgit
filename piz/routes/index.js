var express = require('express');
var router = express.Router();
var dir = './html/';
var mongoose = require('mongoose');
var pizza = mongoose.model('pizza');
var topping = mongoose.model('topping');
/* GET home page. */
router.get('/', function(req, res) {
  if (req.query.names==='true') {
    var data = {};
    pizza.find({},'pizza',function(err,doc){
      if (err) {
        console.log(err);
      }
      else{
        data.pizza = doc;
        topping.find({},'name',function(err,doc){
          if (err) {
            console.log(err);
          }
          else{
            data.topping = doc;
            res.send(JSON.stringify(data));
          }
          });
      }
    });
    
    
  }
  else{
    res.sendfile(dir+'index.html');
  }
});
router.post('/:data',function(req,res){
  //converting data into object form
  var data = JSON.parse(req.params.data);
  console.log('got');
  console.log(data.pizza);
  pizza.findOne({"pizza":data.pizza},function(err,doc){
    if (err) {
      console.log(err);
    }
    else{
      console.log(doc);
      res.send(JSON.stringify(doc));
      }
    });
});

module.exports = router;
