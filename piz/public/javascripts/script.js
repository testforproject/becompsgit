window.onload = init;
var ordercomplete = document.getElementById('ordercomplete');
var dropdown = document.getElementById('pizza');
var toplist = document.getElementById('toplisthtml');
var modal = document.getElementById('displaymodal');
var total = document.getElementById('total');
var nooforder = document.getElementById('nooforders');
var anotherorder = document.getElementById('anotherorder');
var deliver = document.getElementById('deliver');
var edit = document.getElementById('orderedit');
var del = document.getElementById('orderdelete');
var target;
var size;
var info = {};
function init() {
    //console.log(sessionStorage.total);
    if (sessionStorage.info) {
        info = JSON.parse(sessionStorage.info);
        console.log(info);
        console.log(sessionStorage.info);
        document.getElementById('phno').value = info.phonenumber;
        document.getElementById('address').value = info.address;
        document.getElementById('username').value = info.username;
        document.getElementById('nooforders').value = 1;
        ordercomplete.onmousedown = extractInfo;
        anotherorder.onmousedown = redirect;
        deliver.onmousedown = exit;
        dropdown.onfocus = getNames;
        edit.onmousedown = enableEditing;
        del.onmousedown = delOrder;
        getNames();
    }
    else{
        window.location.pathname = "";
    }
}

function exit(){
    document.getElementsByTagName('body')[0].innerHTML = "<p class='thanks'>THANKS FOR PURCHASING</p>";
    delete sessionStorage.total;
    delete sessionStorage.info;
    delete sessionStorage.data;
}

function redirect(){
    alert('going to redirect');
    window.location.pathname = '/pizza';
}

function getNames(){
    
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
                 xmlhttp=new XMLHttpRequest();
        }
        else{// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                    //converting data into object form
                    console.log(JSON.parse(xmlhttp.responseText));
                    dropdown.innerHTML = '';
                    toplist.innerHTML = '';
                    var data = JSON.parse(xmlhttp.responseText);
                    for(var i=0;i<data.topping.length;i++){
                        if (data.topping[i].name) {
                            createTopping(data.topping[i].name);
                        }
                    }
                    for(var i=0;i<data.pizza.length;i++){
                        if (data.pizza[i].pizza) {
                            createList(data.pizza[i].pizza);
                        }
                        
                    }
                }
        }
        //sending data in the string form as it is not getting received as object
        xmlhttp.open("GET","/pizza/?names=true",true);
        xmlhttp.send();
}

function createList(data){
    var element = document.createElement('option');
    element.value = data;
    element.textContent = data;
    dropdown.appendChild(element);
}

function createTopping(data) {
    console.log('creating topping :'+data);
   // var container = document.createElement('div');
   // container.className = 'topcontainer';
    var element = document.createElement('input');
    element.type = 'checkbox';
    element.value = data;
    element.name = 'toppings';
    var span = document.createElement('span');
    span.textContent = data;
    //container.appendChild(element);
    //container.appendChild(span);
    toplist.appendChild(element);
    toplist.appendChild(span);
}

function removeSpace(text) {
        //removing whitespace
        return text.replace(/ /g,"");
}

function extractInfo(){
    var data = {},ph,add,date,time,pizza,size,nsize,toppings = new Array(),ntoppings,specialinfo;
    data.toppings = toppings;
    data.ph = document.getElementsByName('phonenumber')[0].value;
    data.add = document.getElementById('address').value;
    data.date = document.getElementsByName('orderdate')[0].value;
    data.nooforders = nooforder.value;
    
    //date is retrieved in the format yyyy-mm-dd
    data.time = document.getElementsByName('ordertime')[0].value;
    
    data.pizza = document.getElementById('pizza').value;
    console.log(data.pizza);
    nsize = document.getElementsByName('size');
    for (i=0;i<nsize.length;i++) {
        if (nsize[i].checked) {
            data.size = nsize[i].value;
            size = nsize[i].value;
        }
    }
    ntoppings = document.getElementsByName('toppings');
    for(i=0;i<ntoppings.length;i++){
        if (ntoppings[i].checked) {
            data.toppings.push(ntoppings[i].value);
            
        }
    }
    data.specialinfo = document.getElementById('specialinfo').value;
    console.log(data);
    sendData(data);
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.style.visibility = 'visible';
}
function sendData(passeddata) {
    var data = passeddata;
    console.log('inside sendData');
    console.log(passeddata);
     if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
                 xmlhttp=new XMLHttpRequest();
        }
        else{// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                    //converting data into object form
                    console.log('inside sendData after response');
                    console.log(data);
                    console.log(JSON.parse(xmlhttp.responseText));
                    var res = JSON.parse(xmlhttp.responseText);
                    //priceonsize is the total price on size of pizza
                    var priceonsize;
                    if (document.getElementsByName('size')[0].checked) {
                        priceonsize = res.price.size.small;
                        console.log('for small : '+priceonsize);
                    }
                    else if (document.getElementsByName('size')[1].checked) {
                        priceonsize = res.price.size.medium;
                        console.log('for medium : '+priceonsize);
                    }
                    else if (document.getElementsByName('size')[2].checked) {
                        priceonsize = res.price.size.large;
                        console.log('for large : '+priceonsize);
                    }
                    //passing price by multiplying by no of orders
                    sessionManagement(data,priceonsize*nooforder.value);
                    console.log('after sessionManagement');

                    createModal();
                }
        }
        //sending data in the string form as it is not getting received as object
        xmlhttp.open("POST","/pizza/"+JSON.stringify(data),true);
        xmlhttp.send();
}
function createModal(){
    var totl;
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.style.visibility = 'visible';
    totl = add(JSON.parse(sessionStorage.price));
    console.log('total :'+totl);
    sessionStorage.total = ''+totl;
    console.log('sessionStorage.total :'+sessionStorage.total);
    createRow(JSON.parse(sessionStorage.data),JSON.parse(sessionStorage.price));
    total.innerText = 'TOTAL PRICE : '+totl;
}

function add(data) {
    var result = 0;
    for(var i=0;i<data.length;i++){
        result = result+(1*data[i]);
    }
    return result;
}

function createRow(data,price) {
    edit.style.cursor='not-allowed';
    del.style.cursor = 'not-allowed';
    console.log('inside createRow');
    console.log(data);  
    var row;
    var tdpizza,tdno,tdtoppings,tdprice;
    var strtoppings = '';
    
    for (var i=0;i<data.length;i++){
        var toppings = data[i].toppings;
        console.log(toppings);
        row = document.createElement('tr');
        row.className = 'orderrow';
        console.log(row);
        tdserno = document.createElement('td');
        tdpizza = document.createElement('td');
        tdno = document.createElement('td');
        tdtoppings = document.createElement('td');
        tdprice = document.createElement('td');
        tdserno.innerText = i+1;
        row.appendChild(tdserno);
        tdpizza.innerText = data[i].pizza;
        console.log(tdpizza);
        row.appendChild(tdpizza);
        console.log(row);
        
        tdno.innerText = data[i].nooforders;
        console.log(tdno);
        row.appendChild(tdno);
        console.log(row);
        
        for (var j=0;j<toppings.length;j++){
            strtoppings = strtoppings + ',' + toppings[j];
        }
        tdtoppings.innerText = toppings;
        row.appendChild(tdtoppings);
        tdprice.innerText = price[i];
        row.appendChild(tdprice);
        console.log(row);
        document.getElementById('listoforders').appendChild(row);
        row.onmousedown = activateedit;
    }
}

function activateedit(e){
    if (target) {
        
        target.classList.remove('tract');
    }
    target = e.target.parentNode;
    console.log(e);
    console.log(e.target);
    console.log(e.target.parentNode);
    console.log(target);
    target.classList.add('tract');
    edit.style.cursor = 'pointer';
    del.style.cursor = 'pointer';
}

function enableEditing() {
    if (!target) {
        alert('Not selected any row');
    }
    else if(target){
    var data = JSON.parse(sessionStorage.data);
    var price = JSON.parse(sessionStorage.price);
    var srno =1*(target.getElementsByTagName('td')[0].innerText);
    console.log(data[srno-1]);
    console.log(price[srno-1]);
    data.splice(srno-1,1);
    price.splice(srno-1,1);
    console.log(data);
    console.log(price);
    sessionStorage.data = JSON.stringify(data);
    sessionStorage.price = JSON.stringify(price);
    
    redirect();
    
    }
}

function delOrder(){
    console.log('deleting an order');
    if (!target) {
        alert('Not selected any row');
    }
    else if (target) {
    var data = JSON.parse(sessionStorage.data);
    var price = JSON.parse(sessionStorage.price);
    var srno =1*(target.getElementsByTagName('td')[0].innerText);
    console.log(data[srno-1]);
    console.log(price[srno-1]);
    data.splice(srno-1,1);
    price.splice(srno-1,1);
    console.log(data);
    console.log(price);
    sessionStorage.data = JSON.stringify(data);
    sessionStorage.price = JSON.stringify(price);
    delRow();
    
    createModal();
    alert('order deleted');
    }
}

function delRow(){
    var node = document.getElementById('headingoforders');
    var parent = document.getElementById('listoforders');
    parent.innerHTML = '';
    parent.appendChild(node);
}

function sessionManagement(data,priceonsize) {
    var orderinfo = [];
    var orderprice = [];
    console.log('inside sessionManagement');
    if (!isNaN(sessionStorage.total)) {
        orderinfo = toObj(sessionStorage.data);
        orderinfo.push(data);
        sessionStorage.data = JSON.stringify(orderinfo);
        console.log('sessionStorage.data : '+sessionStorage.data);
        orderprice = toObj(sessionStorage.price);
        orderprice.push(priceonsize);
        sessionStorage.price = JSON.stringify(orderprice);
        console.log('sessionStorage.price : '+sessionStorage.price);
    }
    else {
        sessionStorage.data = new Array();
        sessionStorage.price = new Array();
        console.log(data);
        orderinfo.push(data);
        console.log(typeof orderinfo);
        orderprice.push(priceonsize);
        console.log('type of sessionStorage : '+typeof sessionStorage.data);
        sessionStorage.data = JSON.stringify(orderinfo);
        console.log('sessionStorage.data : ');
        console.log(typeof sessionStorage.data);
        sessionStorage.price = JSON.stringify(orderprice);
        console.log('sessionStorage.price : ');
        console.log(typeof sessionStorage.price);
    }
}
function toObj(str) {
    return JSON.parse(str);
}