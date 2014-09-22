function userinstance(data){
    var found = false;
    var mongoose = require('mongoose');
    var user = mongoose.model('user');
    user.findOne({'email':data.email},function(err,doc){
        if (err) {
            console.log(err);
        }
        else {
            if (doc) {
                console.log(doc);
                found = true;
            }
            else {
                var userin = new user(data);
                console.log('data in user '+userin);
                userin.save(function(err){
                    console.log('inside save function');
                    if (err) {
                        console.log(err);
                    }
                    else{
                        console.log('saved user data');
                    }
                });     
            }
        }
        });
    return found;
}

module.exports = userinstance;