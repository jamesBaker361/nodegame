var express = require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Sprites=require("sprites");

var plat=Sprites.PlatformArray;

var userList=["",""];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
   // io.emit
});
//app.get('/piplupleft.png',function(req, res){res.sendFile(__dirname+'/piplupleft.png');});
app.get('/piplupleft.png', function(req, res){
  res.sendFile(__dirname + '/piplupleft.png');
});
app.get('/piplupright.png', function(req, res){
  res.sendFile(__dirname + '/piplupright.png');
});
app.get('/spearowleft.png', function(req, res){
  res.sendFile(__dirname + '/spearowleft.png');
});
app.get('/spearowright.png', function(req, res){
  res.sendFile(__dirname + '/spearowright.png');
});
app.get('/skittyleft.png', function(req, res){
  res.sendFile(__dirname + '/skittyleft.png');
});
app.get('/skittyright.png', function(req, res){
  res.sendFile(__dirname + '/skittyright.png');
});
app.get('/laser.png',function(req,res){
    res.sendFile(__dirname+'/laser.png');
});
app.get('/brick.png',function(req,res){
    res.sendFile(__dirname+'/brick.png');
});
app.get('/pokemonmusic.mp3',function(req,res){
    res.sendFile(__dirname+'/pokemonmusic.mp3');
});
/*app.get('/socket.io.js',function(req,res){
    res.sendFile(__dirname+'/socket.io.js');
});*/
app.get('/socket.io',function(req,res){
   res.sendFile(__dirname+'/socket.io'); 
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});

io.on('connection', function(socket){
    console.log("connected!");
    socket.on("disconnect", function(obj){
    console.log("discnnected");
    });
    socket.on("disconnect user name",function(obj){
       console.log(obj); 
    });
    
  
    
  //  io.emit("countertest",http);
   // io.emit("get User List",["ccks","boooof","dongszx"]);
    socket.on("new user",function(name){
        console.log("new user server");
            userList.push(name);
            Sprites.SpriteArray.push(new Sprites.Character(name, Sprites.pictures[Math.floor(Math.random()*Sprites.pictures.length)], 10,10, true));
    });
    socket.on("get User List", function(n){
       io.emit("get User List", userList); 
    });
    socket.on("key",function(obj){
        for(s in Sprites.CharacterArray){
            console.log(s);
            if(Sprites.CharacterArray[s].user==obj.user){
                switch(obj.key){
                    case "ArrowUp":
                        Sprites.CharacterArray[s].falling=false;
                        break;
                    case "ArrowDown":
                        Sprites.CharacterArray[s].y+=4;
                        break;
                    case "ArrowLeft":
                        Sprites.CharacterArray[s].left=true; 
                        var canGoLeft=true;
                        for(p in plat){
                            if(
                                (plat[p].y>=Sprites.CharacterArray[s].y)
                                &&((plat[p].y+plat[p].height)<=(Sprites.CharacterArray[s].y+Sprites.CharacterArray[s].height))
                                &&
                                (Sprites.CharacterArray[s].x>=(plat[p].x+plat[p].width-10))
                                &&(Sprites.CharacterArray[s].x<=plat[p].x+plat[p].width)
                            ){
                                canGoLeft=false;
                                break;
                            }
                        }
                        if(canGoLeft){
                        Sprites.CharacterArray[s].x-=6;  
                        }
                        break;
                    case "ArrowRight":
                        Sprites.CharacterArray[s].left=false;   
                        var canGoRight=true;
                        for(p in plat){
                            if(
                            (plat[p].y>=Sprites.CharacterArray[s].y)
                                &&((plat[p].y+plat[p].height)<=(Sprites.CharacterArray[s].y+Sprites.CharacterArray[s].height))
                                &&(Sprites.CharacterArray[s].x+Sprites.CharacterArray[s].width>=plat[p].x)
                                &&((Sprites.CharacterArray[s].x+Sprites.CharacterArray[s].width)<=(plat[p].x+10))
                            ){
                                canGoRight=false;
                                break;
                            }
                        }
                        if(canGoRight){
                        Sprites.CharacterArray[s].x+=6;
                        }
                        break;
                    case "Space":
                        if(Sprites.CharacterArray[s].energy>=10){
                         Sprites.CharacterArray[s].energy-=10;
                        if(Sprites.CharacterArray[s].left){
                            Sprites.SpriteArray.push(new Sprites.Laser(
                                Sprites.CharacterArray[s].user+"laser",
                                "laser",
                                (Sprites.CharacterArray[s].x/Sprites.pixels)-1,
                                (Sprites.CharacterArray[s].y/Sprites.pixels)+(Sprites.CharacterArray[s].height/(2*Sprites.pixels)),
                                false,true));
                        }else{
                            Sprites.SpriteArray.push(new Sprites.Laser(
                                Sprites.CharacterArray[s].user+"laser",
                                "laser",
                                (Sprites.CharacterArray[s].x/Sprites.pixels)+1+(Sprites.CharacterArray[s].width/Sprites.pixels),
                                (Sprites.CharacterArray[s].y/Sprites.pixels)+(Sprites.CharacterArray[s].height/(2*Sprites.pixels)),
                                false,false));
                        }   
                        }
                        break;
                    default:
                        break;
                }
            }
        };
       io.emit("render canvas", [Sprites.CharacterArray, Sprites.LaserArray,Sprites.PlatformArray]); 
    });
    var updateLasers=function(){
        var deleteArray=[];
        for(l in Sprites.LaserArray){
            if(Sprites.LaserArray[l].left){
                Sprites.LaserArray[l].x-=8;
            } else{
                Sprites.LaserArray[l].x+=8;
            }
            if((Sprites.LaserArray[l].x<-100)||(Sprites.LaserArray[l].x>900)){
                deleteArray.push(l);
            }
            for(c in Sprites.CharacterArray){
                if(((Sprites.LaserArray[l].x+Sprites.LaserArray[l].width)>Sprites.CharacterArray[c].x)
                  &&(Sprites.LaserArray[l].x<(Sprites.CharacterArray[c].x+Sprites.CharacterArray[c].width))
                  &&(Sprites.LaserArray[l].y>=Sprites.CharacterArray[c].y)
                  &&((Sprites.LaserArray[l].y+Sprites.LaserArray[l].height)<=Sprites.CharacterArray[c].y+Sprites.CharacterArray[c].height)){
                   Sprites.CharacterArray[c].health-=1;
                    deleteArray.push(l);
                }
            }
        }
        for(d in deleteArray){
            Sprites.LaserArray.splice(deleteArray[d],1);
        }
        
    }
    
    var updateCharacters=function(){
        var deleteArray=[];
        for(c in Sprites.CharacterArray){
            if(Sprites.CharacterArray[c].energy<100){
            Sprites.CharacterArray[c].energy++;
            }
            if(Sprites.CharacterArray[c].health<=0){
                deleteArray.push(c);
                io.emit("game over",Sprites.CharacterArray[c].user);
            }
            if(!Sprites.CharacterArray[c].falling){
                Sprites.CharacterArray[c].jumpNum--;
                Sprites.CharacterArray[c].y-=6;
            }else{
                var onSolidGround=false;
                for(p in Sprites.PlatformArray){
                    if((Sprites.CharacterArray[c].x+Sprites.CharacterArray[c].width>=Sprites.PlatformArray[p].x)
                      &&((Sprites.CharacterArray[c].x)<=(Sprites.PlatformArray[p].x+Sprites.PlatformArray[p].width))
                       &&(Sprites.CharacterArray[c].y+Sprites.CharacterArray[c].height>=Sprites.PlatformArray[p].y)
                       &&((Sprites.CharacterArray[c].y+Sprites.CharacterArray[c].height<=Sprites.PlatformArray[p].y+Sprites.PlatformArray[p].height))
                      ){
                        Sprites.CharacterArray[c].y=Sprites.PlatformArray[p].y-Sprites.CharacterArray[c].height;
                        onSolidGround=true;
                    }
                }
                if(onSolidGround){
                    Sprites.CharacterArray[c].resetJump();
                }else{
                    Sprites.CharacterArray[c].y+=8;
                }
            }
            if(Sprites.CharacterArray[c].jumpNum<=0){
                Sprites.CharacterArray[c].falling=true;
               // Sprites.CharacterArray[c].jumpNum=10;
            }
            //Sprites.CharacterArray[c].health--;
        }
        for(d in deleteArray){
            Sprites.CharacterArray.splice(deleteArray[d],1);
        }
        
    }
    
    setInterval(function(){
        updateLasers();
        updateCharacters();
       io.emit("render canvas", [Sprites.CharacterArray, Sprites.LaserArray,Sprites.PlatformArray]); 
    },150);
});
