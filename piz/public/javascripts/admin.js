

//window.onload = init;
var list = document.getElementById('showpizza');
var add = document.getElementById('addpizza');
var edit = document.getElementById('edit');
var listview = document.getElementById('list');
var addview = document.getElementById('addition');
var del = document.getElementById('delete');

var submit = document.getElementById('submit'),target,editflag = false,olddetails;
function init(){
    //for pizza
    list.onmousedown = displayList;
    add.onmousedown = activateAddView;
    edit.onmousedown = editview;
    del.onmousedown = removerow;
    submit.onmousedown = addPizza;
    
    
    
}
function displayList(){
    listview.style.visibility = 'visible';
    listview.style.position = 'relative';
    addview.style.visibility = 'hidden';
    addview.style.position = 'absolute';
    edit.style.visibility = 'hidden';
    del.style.visibility = 'hidden';
    listview.innerHTML = '';
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
             xmlhttp=new XMLHttpRequest();
    }
    else{// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
               console.log('got');
               var data = JSON.parse(xmlhttp.responseText);
               console.log(data);
               for (var i=0;i<data.length;i++) {
               console.log(data[i]);
                    if (data[i].pizza&&data[i].price) {
                    console.log(data);
                    insertList(data[i]);
                    }
               }
               var rows = document.getElementsByClassName('row');
               for (var i=0;i<rows.length;i++) {
                rows[i].onmousedown = showOptions;
               }
               }
    }
    xmlhttp.open("GET","/admin/?showlist=true",true);
    xmlhttp.send();
}
function insertList(data) {
    
    var row =document.createElement('p');
    row.className = 'row';
    row.innerHTML = '<span class="r">'+'pizza :'+data.pizza+'</span><br>'+'<span class="size">'+'small :'+data.price.size.small+'</span>'+'<span class="size">'+'medium :'+data.price.size.medium+'</span>'+'<span class="size">'+'large :'+data.price.size.large+'</span>';  
    listview.appendChild(row);
}
function showOptions(e){
    //saving target to be used for editing or deleting
    target = e.target.parentNode;
    console.log('in show options');
    edit.style.visibility = 'visible';
    del.style.visibility = 'visible';
}
function activateAddView() {
    addview.style.visibility = 'visible';
    addview.style.position = 'relative';
    listview.style.visibility = 'hidden';
    listview.style.position = 'absolute';
    edit.style.visibility = 'hidden';
    del.style.visibility = 'hidden';
    document.getElementById('newpizza').value='';
    document.getElementById('small').value='';
    document.getElementById('medium').value='';
    document.getElementById('large').value='';
}
function removerow(){
    olddetails = extractData(target);
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
                 xmlhttp=new XMLHttpRequest();
        }
        else{// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                   console.log(JSON.parse(xmlhttp.responseText));
                   //if edit flag is true than display list as it is been edited
                   displayList();
                }
        }
        xmlhttp.open("post","/admin/"+JSON.stringify(olddetails)+"?details=true",true);
        //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        //editflag for checking whether to edit or add
        //var txt =JSON.stringify(data);
        xmlhttp.send();
    
}
function editview(){
    addview.style.visibility = 'visible';
    addview.style.position = 'relative';
    listview.style.visibility = 'hidden';
    listview.style.position = 'absolute';
    edit.style.visibility = 'hidden';
    del.style.visibility = 'hidden';
    olddetails = extractData(target);
    document.getElementById('newpizza').value = olddetails.pizza;
    document.getElementById('small').value = olddetails.price.size.small;
    document.getElementById('medium').value = olddetails.price.size.medium;
    document.getElementById('large').value = olddetails.price.size.large;
    editflag = true;
}
function extractData(parentnode){
   var child = parentnode.getElementsByClassName('r');
   var price = parentnode.getElementsByClassName('size');
   var details = {};
   details.price = {};
   details.price.size = {};
   details.pizza = extractText(child[0],'pizza :');
   details.price.size.small = 1*extractText(price[0],'small :');
   details.price.size.medium = 1*extractText(price[1],'medium :');
   details.price.size.large = 1*extractText(price[2],'large :');
   return details;
}
function extractText(nod,str){
    console.log(nod);
    var txt = nod.textContent;
    var len = str.length;
    txt = txt.slice(len);
    console.log(txt);
    return txt;
}
function addPizza(){
    var data = {},size = {};
    data.price  = {};
    data.price.size = {};
    var pizza = document.getElementById('newpizza').value;
    size.small = document.getElementById('small').value;
    size.medium = document.getElementById('medium').value;
    size.large = document.getElementById('large').value;
    console.log('price :');
    console.log(size);
    if (editflag) {
        data.changed = {};
        data.changed.price = {};
        data.changed.price.size = {};
        data.old = {};
        data.old = olddetails;
        data.changed.pizza=pizza;
        data.changed.price.size=size;
    }
    else {
    //data should be handled with care as it is going to be stored
    //directly in database
        data.pizza = pizza;
        data.price.size = size;
    }
        if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
                 xmlhttp=new XMLHttpRequest();
        }
        else{// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                   console.log(JSON.parse(xmlhttp.responseText));
                   //if edit flag is true than display list as it is been edited
                   displayList();
                   editflag=false;
                }
        }
        xmlhttp.open("post","/admin/"+JSON.stringify(data)+"?editflag="+editflag,true);
        //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        //editflag for checking whether to edit or add
        //var txt =JSON.stringify(data);
        xmlhttp.send();
}