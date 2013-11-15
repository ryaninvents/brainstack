#!/usr/local/bin/node

var argv = require("optimist").argv;
var fs = require("fs");

var data = {
  currentItem: -1,
  stack: [],
  title: "BrainStack",
  id: 0,
  focus: 0,
  seq: 1
};

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

if(fs.existsSync(getUserHome()+"/.brainstack.json")){
  data = require(getUserHome()+"/.brainstack");
}

if(!argv._ || argv._.length<1){
  argv._ = ['display'];
}

function getActive(d){
  return findById(data.focus);
}

function getActiveParent(d){
  return findParentById(data.focus);
}

function pushTo(d, text){
  d.stack.push({
    title: text,
    stack: [],
    currentItem: -1,
    id: data.seq++
  });
  d.currentItem = d.stack.length - 1;
  data.focus = d.stack[d.currentItem].id;
}

function display(d, indent){
  if(!d){
    d = data;
    if(d.stack.length===0){
      console.log('  Empty stack');
      return;
    }
  }
  if(!indent) indent = 1;
  var line = "";
  for(var i=0;i<indent; i++){
    line += '  ';
  }
  line += (data.focus === d.id? "*": ' ')+d.id + ". " + d.title;
  if(d.id===0){
    line = "  Your Brainstack:";
  }
  console.log(line);
  for(i=0;i<d.stack.length;i++){
    display(d.stack[i], indent+1);
  }
}

function throwStack(d, indent){
  if(!d){
    d = data;
    if(d.stack.length===0){
      console.log(" Empty stack");
      return;
    }
    console.log("  Exception in thread \"main\": io.muller.BrainOverflowException");
  }
  if(!indent) indent = 1;
  var line = "    at " + d.title + " (line " + d.id + ")";
  if(d.currentItem >= 0){
    throwStack(d.stack[d.currentItem], indent+1);
  }
  if(d.id>0) console.log(line);
}


function showStack(d, indent){
  if(!d) d = data;
  if(!indent) indent = 1;
  var line = "  ";
  line += d.id + ". " + d.title;
  if(d.currentItem >= 0){
    showStack(d.stack[d.currentItem], indent+1);
  }
  if(d.id !== 0) console.log(line);
}

function focusById(id, d){
  if(!d) d = data;
  for(var i=0;i<d.stack.length;i++){
    if(d.stack[i].id === id){
      d.currentItem = i;
      data.focus = id;
      return true;
    }
  }
  for(var i=0;i<d.stack.length;i++){
    var f = focusById(id, d.stack[i]);
    if(f){
      d.currentItem = i;
      return true;
    }
  }
  
  return false;
}


function findParentById(id, d){
  if(!d) d = data;
  for(var i=0;i<d.stack.length;i++){
    if(d.stack[i].id === id) return d;
  }
  for(var i=0;i<d.stack.length;i++){
    var f = findParentById(id, d.stack[i]);
    if(f) return f;
  }
  
  return null;
}

function popById(id){
  var parent = findParentById(id);
  for(var i=0;i<parent.stack.length;i++){
    if(parent.stack[i].id === id){
      parent.stack.splice(i, 1);
      if(parent.currentItem >= parent.stack.length) 
        parent.currentItem--;
      focusById(parent.id);
      return;
    }
  }
}

function pop(){
   var parent = getActiveParent();
   focusById(parent.id);
   parent.stack.splice(parent.currentItem,1);
   if(parent.currentItem >= parent.stack.length){
     parent.currentItem--;
   }
}

function findById(id, d){
  if(!d) d = data;
  if(d.id === id) return d;
  for(var i=0;i<d.stack.length;i++){
    var f = findById(id, d.stack[i]);
    if(f) return f;
  }
  return null;
}

function save(){
    fs.writeFileSync(getUserHome()+"/.brainstack.json",JSON.stringify(data));
}

function renumber(d,origFocus){
  if(!d){
    data.seq = 0;
    origFocus = data.focus;
    d = data;
  }
  var chFocus = (d.id === origFocus);
  d.id = data.seq++;
  if(chFocus) data.focus = d.id;
  for(var i=0;i<d.stack.length;i++){
    renumber(d.stack[i],origFocus);
  }
}


var cmd = argv._[0];
var txt;
switch(cmd){
  case 'display':
  case 'all':
    display();
    break;
  case 'focus':
    if(argv._.length<2){
      console.log("Need number of the item to focus on!");
      process.exit(-1);
    }
    data.focus = argv._[1];
    display();
    save();
    break;
  case 'parent':
    display(findParentById(argv._[1]));
    break;
  case 'renumber':
    renumber();
    display();
    save();
    break;
  case 'drop':
    if(argv._.length<2){
      console.log("Need number of the item to drop!");
      process.exit(-1);
    }
    popById(argv._[1]);
    save();
    display();
    break;
  case 'throw':
    throwStack();
    break;
  case 'stack':
    showStack();
    break;
  case 'json':
    console.log(JSON.stringify(data,null,2));
    break;
  case 'push':
  case 'put':
    if(argv._.length<2){
      console.log("Need item to "+cmd+"!");
      process.exit(-1);
    }
    txt = argv._[1];
    var parent = (cmd==='push')? getActive(): getActiveParent();
    pushTo(parent, txt);
    save();
    display();
    break;
  case 'pop':
    pop();
    display();
    save();
    break;
  case 'dbg':
    console.log(JSON.stringify(argv,null,2));
    break;
}
