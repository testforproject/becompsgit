function pizinstance(data){
    console.log('inside');
    console.log(data);
    var mongoose = require('mongoose');
    var pizza = mongoose.model('pizza');
    var pizin = new pizza(data);
    console.log('data in pizin: '+pizin);
    pizin.save(function(err){
    console.log('inside');
    if (err) {
        console.log(err);
      }
    else {
        console.log('saved');
      }
   
    });
}
module.exports = pizinstance;