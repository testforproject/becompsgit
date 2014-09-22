var express = require('express');
var router = express.Router();
var dir = './html/';

router.get('/',function(req,res){
    console.log('inside orders');
    res.sendfile(dir+'orders.html');
    });

module.exports = router;