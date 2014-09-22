var express = require('express');
var router = express.Router();
var dir = './html/';
var mongoose = require('mongoose');
var user = mongoose.model('user');

router.get('/',function(req,res){
    console.log('inside orders');
    res.sendfile(dir+'login.html');
    });

router.post('/:data',function(req,res){
    console.log('inside login');
    var data = JSON.parse(req.params.data);
    user.findOne({'email':data.email,'password':data.pwd},function(err,doc){
        if (err) {
            console.log(err);
            res.send(false);
        }
        else{
            console.log(doc);
            res.send(JSON.stringify(doc));
        }
        });
    });

module.exports = router;