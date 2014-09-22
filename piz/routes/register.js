var express = require('express');
var router = express.Router();
var dir = './html/';
var mongoose = require('mongoose');
var user = mongoose.model('user');
var userinstance = require('./userinstance');

router.get('/',function(req,res){
    console.log('inside orders');
    res.sendfile(dir+'register.html');
    });

router.post('/:data',function(req,res){
    console.log('inside register');
    var data = JSON.parse(req.params.data);
    if (!userinstance(data)) {
        console.log('going to create instance');
        
        //halted here not able to redirect
        res.send(true);
    }
    else {
    res.send(false);
    }
    });

function occupied(data){
    var found = false;
    user.findOne({'email':data.email},function(err,doc){
        if (err) {
            console.log(err);
        }
        else {
            if (doc) {
                console.log(doc);
                found = true;
            }
        }
        });
    return found;
}

module.exports = router;