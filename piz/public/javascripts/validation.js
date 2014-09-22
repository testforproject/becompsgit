window.onload = init;
var emailid,submit,password;


function init(){
    emailid = document.getElementById('txtEmail');
    submit = document.getElementById('signupb');
    password = document.getElementById('pass');
    submit.onmousedown = validateNSend;
    emailid.onkeydown = validateEmail;
    password.onkeydown = validatePassword;
}

function validatePassword(){
    if (password.value.length > 0) {
        password.className = 'correct';
    }
    else{
        password.className = 'incorrect';
    }
}

function validateNSend() {
    var email = emailid.value;
    var pwd = password.value;
    if (checkEmail()&&(pwd.length>0)) {
        var data = {};
        data.email = email;
        data.pwd = pwd;
        var xmlhttp;
        if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
                 xmlhttp=new XMLHttpRequest();
        }
        else{// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                    if (xmlhttp.response==='false') {
                        console.log('error: username or password incorrect');
                        emailid.className = 'incorrect';
                        password.className = 'incorrect';
                    }
                    else{
                        var info = JSON.parse(xmlhttp.responseText);
                        console.log(info);
                        sessionStorage.info = JSON.stringify(info);
                        alert(sessionStorage.info);
                        if (info.status==='admin') {
                            window.location.pathname = '/admin';
                        }
                        else {
                            window.location.pathname = '/pizza';
                        }
                    }
                }
        }
        //sending data in the string form as it is not getting received as object
        xmlhttp.open("POST","/"+JSON.stringify(data),true);
        xmlhttp.send();
    }
}

function validateEmail() {
    if (checkEmail()) {
        
        document.getElementById('txtEmail').className = 'correct';
    }
    else{
        document.getElementById('txtEmail').className = 'incorrect';
        
    }
}

function checkEmail() {

    var email = document.getElementById('txtEmail');
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email.value)) {
    email.focus;
    return false;
    }
    return true;
}