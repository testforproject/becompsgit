var express = require('express');
var pizinstance = require('./pizinstance.js');
var topinstance = require('./topinstance.js');
var router = express.Router();
var dir = './html/';
var mongoose = require('mongoose');
var pizza = mongoose.model('pizza');
var topping = mongoose.model('topping');

/* GET users listing. */
router.get('/', function(req, res) {
  console.log('inside get');
  console.log(req.body);
  //for pizza
  if (req.query.showlist) {
    console.log('got inside query :'+req.query.showlist);
    pizza.find(function(err,data){
    if (err) {
      console.log(err);
    }
    console.log(data);
    res.send(JSON.stringify(data));
    });
  }
  //for topping
  else if (req.query.topshowlist) {
    console.log('got inside topquery :'+req.query.topshowlist);
    topping.find(function(err,data){
    if (err) {
      console.log(err);
    }
    console.log(data);
    res.send(JSON.stringify(data));
    });
  }
  //for sending file
  else{
    console.log('sending files');
    res.sendfile(dir+'admin.html');
    
  }
});
router.post('/:data',function(req,res){
  var data = JSON.parse(req.params.data);
  console.log(data);
  //for pizza:editing
  if (req.query.editflag==='true') {
    console.log('edit');
    console.log(JSON.stringify({'pizza':data.pizza}));
    pizza.findOne({'pizza':data.old.pizza,'price':data.old.price},function(err,doc){
      if (err) {
        console.log(err);
      }
      else {
        console.log('for editing');
        doc.pizza = data.changed.pizza;
        doc.price = data.changed.price;
        doc.save(function(err){
          if (err) {
            console.log(err);
          }
          else{
            console.log('edited');
            res.send(data);
          }
          });
      }
      });
    
  }
  //for topping:editing
  else if (req.query.topeditflag==='true') {
    console.log('edit');
    console.log(JSON.stringify({'name ':data.topping}));
    topping.findOne({'name':data.old.name,'price':data.old.price},function(err,doc){
      if (err) {
        console.log(err);
      }
      else {
        console.log('for editing');
        doc.name = data.changed.name;
        doc.price = data.changed.price;
        doc.save(function(err){
          if (err) {
            console.log(err);
          }
          else{
            console.log('edited');
            res.send(data);
          }
          });
      }
      });
    
  }
  //for pizza:deleting
  else if (req.query.details) {
    console.log(req.query.details);
    pizza.findOne({'pizza':data.pizza,'price':data.price},function(err,doc){
      if (err) {
        console.log(err);
      }
      else{
        doc.remove();
        res.send(data);
      }
      });
    
  }
  //for topping:deleting
  else if (req.query.topdetails) {
    console.log('deleting');
    console.log(req.query.topdetails);
    topping.findOne({'name':data.name,'price':data.price},function(err,doc){
      if (err) {
        console.log(err);
      }
      else{
        console.log(doc);
        doc.remove();
        res.send(data);
      }
      });
    
  }
  //for topping:adding
  else if (req.query.topeditflag==='false') {
    console.log('adding toppings');
    topinstance(data);
    res.send(data);
  }
  //for pizza:adding
  else{
    console.log('add');
    
    pizinstance(data);
    res.send(data);
  }
  
});
/*
router.get('/list',function(req,res){
    pizzas.find(function(err,data){
      if (err) {
        console.log(err);
      }
      console.log(data);
      res.send(data);
      });
  });
*/
module.exports = router;
