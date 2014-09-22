//make border of input red when not valid input

window.onload = init;

var submit = id('submit'),sub
, txtemail = id('txtEmail'),txtem
, username = id('username'),usr
, password = id('password'),pwd
, surname = id('surname'),srn
, phonenumber = id('phone'),phno
, address = id('address'),addr
, postcode = id('postcode'),postalcode;

function id(data){
    return document.getElementById(data);
}

function init(){
    submit.onmousedown = validate;
    txtemail.onkeydown = validateEmail;
    password.onkeydown = validatePassword;
    phonenumber.onkeydown = validatePhno;
    username.onkeydown = validateUsername;
    surname.onkeydown = validateSurname;
    address.onkeydown = validateAddress;
    postcode.onkeydown = validatePostcode;
}

function validateUsername(){
    //as the color of textbox changes after clicking submit on no input
    if (username.value.length>0) {
        username.className = 'correct';
    }
    else {
        username.className = 'incorrect';
    }
}

function validateSurname(){
    if (surname.value.length>0) {
        surname.className = 'correct';
    }
    else {
        surname.className = 'incorrect';
    }
}

function validateAddress(){
    if (address.value.length>0) {
        address.className = 'correct';
    }
    else {
        address.className = 'incorrect';
    }
}

function validatePostcode(){
    if (postcode.value.length>0) {
        postcode.className = 'correct';
    }
    else {
        postcode.className = 'incorrect';
    }
}

function validate() {
    usr = username.value;
    pwd = password.value;
    txtem = txtemail.value;
    srn = surname.value;
    phno = phonenumber.value;
    addr = address.value;
    postalcode = postcode.value;
    console.log('inside checkProvided');
    console.log(checkProvided(username,password,surname,address,postcode));
    console.log('phno');
    console.log(phno.length>=10);
    console.log('checkEmail');
    console.log(checkEmail());
    if (checkProvided(username,password,surname,address,postcode,phonenumber)&&phno.length>=10&&checkEmail()) {
        //all values are validated
        console.log('correct');
        var xmlhttp;
        var data = {};
        //handle data with care bcoz is directly passed in db
        data.username = usr;
        data.password = pwd;
        data.surname = srn;
        data.email = txtem;
        data.phonenumber = phno;
        data.address = addr;
        data.postcode = postalcode;
        if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
                 xmlhttp=new XMLHttpRequest();
        }
        else{// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                    //converting data into object form
                    //console.log(JSON.parse(xmlhttp.responseText));
                    //console.log('email id occupied');
                    //txtemail.className = 'incorrect';
                    if (xmlhttp.response==='true') {
                        console.log(window.location);
                        window.location.pathname = '/pizza';
                    }
                    else{
                        txtemail.className = 'incorrect'
                    }
                }
        }
        sessionStorage.info = JSON.stringify(data);
        alert(sessionStorage.info);
        //sending data in the string form as it is not getting received as object
        xmlhttp.open("POST","/register/"+JSON.stringify(data),true);
        xmlhttp.send();
    }
    else{
        console.log('incorrect');
    }
 
}

function checkProvided(){
    var provided = true;
    console.log('length of arguments');
    console.log(arguments.length);
    console.log(arguments);
    for (var i = 0;i<arguments.length;i++){
        if (arguments[i].value.length>0) {
            arguments[i].className = 'correct';
            console.log(arguments[i]);
            console.log(arguments[i].value);
            console.log(arguments[i].value>0);
            console.log(arguments[i].classList.contains('correct'));
        }
        else {
            arguments[i].className = 'incorrect';
            console.log(arguments[i]);
            console.log(arguments[i].value);
            console.log(arguments[i].value>0);
            console.log(arguments[i].classList.contains('incorrect'));
            provided = false;
        }
    }
    return provided;
}

function validatePassword(){
    if (password.value.length > 0) {
        password.className = 'correct';
    }
    else{
        password.className = 'incorrect';
    }
}

function validatePhno(){
    if (phonenumber.value.length >= 9) {
        phonenumber.className = 'correct';
    }
    else{
        phonenumber.className = 'incorrect';
    }
}

function validateEmail() {
    var valid = false;
    if (checkEmail()) {
        valid = true;
    }
    else{
        valid = false;
    }
}

function checkEmail() {

    var email = document.getElementById('txtEmail');
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email.value)) {
    email.focus;
    email.className = 'incorrect';
    return false;
    }
    email.className = 'correct';
    return true;
}