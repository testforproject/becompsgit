
window.onload = topinit;

var showtoplist = document.getElementById('showtoppings');
var addtop = document.getElementById('addtoppings');
var edittop = document.getElementById('edittoppings');
var deltop = document.getElementById('deletetoppings');
var toplistview = document.getElementById('toplist');
var topaddview = document.getElementById('topadd');
var topsubmit = document.getElementById('topsubmit'),toptarget,topeditflag = false,topolddetails;

function topinit(){
   
    showtoplist.onmousedown = topdisplayList;
    addtop.onmousedown = topactivateAddView;
    edittop.onmousedown = topeditview;
    deltop.onmousedown = topremoverow;
    topsubmit.onmousedown = topaddtopping;
    init();
}

function topdisplayList(){
    var xmlhttp;
    toplistview.style.visibility = 'visible';
    toplistview.style.position = 'relative';
    topaddview.style.visibility = 'hidden';
    topaddview.style.position = 'absolute';
    edittop.style.visibility = 'hidden';
    deltop.style.visibility = 'hidden';
    toplistview.innerHTML = '';
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
             xmlhttp=new XMLHttpRequest();
    }
    else{// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
               console.log('got in top');
               var data = JSON.parse(xmlhttp.responseText);
               console.log(data);
               for (var i=0;i<data.length;i++) {
                    console.log(data[i]);
                    if (data[i]) {
                    console.log(data[i]);
                    topinsertList(data[i]);
                    }
               }
               var rows = document.getElementsByClassName('trow');
               for (var i=0;i<rows.length;i++) {
                rows[i].onmousedown = topshowOptions;
               }
               }
    }
    xmlhttp.open("GET","/admin/?topshowlist=true",true);
    xmlhttp.send();
    
}

function topinsertList(data) {
    var name = data.name;
    var row =document.createElement('p');
    row.className = 'trow';
    row.innerHTML = '<span class="tr">topping :'+name+'</span><span class="tp">price :'+data.price+'</span>';
    toplistview.appendChild(row);
}

function topshowOptions(e){
    //saving target to be used for editing or deleting
    toptarget = e.target.parentNode;
    console.log('in show options');
    edittop.style.visibility = 'visible';
    deltop.style.visibility = 'visible';
}

function topactivateAddView() {
    console.log('inside top activate add view');
    topaddview.style.visibility = 'visible';
    topaddview.style.position = 'relative';
    toplistview.style.visibility = 'hidden';
    toplistview.style.position = 'absolute';
    edittop.style.visibility = 'hidden';
    deltop.style.visibility = 'hidden';
    document.getElementById('newtopping').value='';
    document.getElementById('topprice').value='';
}

function topremoverow(){
    topolddetails = topextractData(toptarget);
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
                   topdisplayList();
                }
        }
        xmlhttp.open("post","/admin/"+JSON.stringify(topolddetails)+"?topdetails=true",true);
        //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        //editflag for checking whether to edit or add
        //var txt =JSON.stringify(data);
        xmlhttp.send();
    
}

function topeditview(){
    topaddview.style.visibility = 'visible';
    topaddview.style.position = 'relative';
    toplistview.style.visibility = 'hidden';
    toplistview.style.position = 'absolute';
    edittop.style.visibility = 'hidden';
    deltop.style.visibility = 'hidden';
    topolddetails = topextractData(toptarget);
    document.getElementById('newtopping').value = topolddetails.name;
    document.getElementById('topprice').value = topolddetails.price;
    topeditflag = true;
}

function topextractData(parentnode){
   var child = parentnode.getElementsByClassName('tr');
   var price = parentnode.getElementsByClassName('tp');
   var details = {};
   details.name = extractText(child[0],'topping :');
   details.price = 1*extractText(price[0],'price :');
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

function topaddtopping(){
    var data = {},price;
    var topping = document.getElementById('newtopping').value;
    price = document.getElementById('topprice').value;
    console.log('price :');
    console.log(price);
    if (topeditflag) {
        data.changed = {};
        data.old = {};
        data.old = topolddetails;
        data.changed.name = topping;
        data.changed.price = price;
    }
    else {
    //data should be handled with care as it is going to be stored
    //directly in database
        data.name = topping;
        data.price = price;
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
                   topdisplayList();
                   topeditflag=false;
                }
        }
        xmlhttp.open("post","/admin/"+JSON.stringify(data)+"?topeditflag="+topeditflag,true);
        //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        //editflag for checking whether to edit or add
        //var txt =JSON.stringify(data);
        xmlhttp.send();
}