function topinstance(data){
    console.log('inside topinstance');
    console.log(data);
    var mongoose = require('mongoose');
    var topping = mongoose.model('topping');
    var topin = new topping(data);
    console.log('data in topin: '+topin);
    topin.save(function(err){
    console.log('inside');
    if (err) {
        console.log(err);
      }
    else {
        console.log('saved');
      }
   
    });
}
module.exports = topinstance;