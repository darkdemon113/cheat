var canvasId="myDrawingCanvas";var wheelImageName=site+"/js/winwheel/prizewheel.png?v=4";var spinButtonImgOn=site+"/js/winwheel/spin_on.png?v=4";var spinButtonImgOff=site+"/js/winwheel/spin_off.png?v=4";var theSpeed=10;var pointerAngle=90;var doPrizeDetection=true;var spinMode="determinedAngle";var determinedGetUrl=site+"/game/vong-quay-may-man/?a=play";var prizes=new Array();prizes[0]={"name":"trúng 1000 bạc","startAngle":0,"endAngle":11};prizes[1]={"name":"ô trừ 500 bạc","startAngle":12,"endAngle":33};prizes[2]={"name":"danh hào ngẫu nhiên","startAngle":34,"endAngle":78};prizes[3]={"name":"nguyệt phiếu","startAngle":79,"endAngle":101};prizes[4]={"name":"ô may mắn lần sau","startAngle":102,"endAngle":168};prizes[5]={"name":"hoàng kim lệnh","startAngle":169,"endAngle":191};prizes[6]={"name":"trúng 200 bạc","startAngle":192,"endAngle":213};prizes[7]={"name":"danh hào ngẫu nhiên","startAngle":214,"endAngle":258};prizes[8]={"name":"hỏa tinh châu","startAngle":259,"endAngle":281};prizes[9]={"name":"ô may mắn lần sau","startAngle":282,"endAngle":348};prizes[10]={"name":"trúng 1000 bạc","startAngle":349,"endAngle":359};var surface;var wheel;var angle=0;var targetAngle=0;var currentAngle=0;var power=3;var xhr=new XMLHttpRequest();xhr.onreadystatechange=ajaxCallback;var randomLastThreshold=150;var spinTimer;var wheelState='reset';function begin()
{surface=document.getElementById(canvasId);if(surface.getContext)
{wheel=new Image();wheel.onload=initialDraw;wheel.src=wheelImageName;}}
function initialDraw(e)
{var surfaceContext=surface.getContext('2d');surfaceContext.drawImage(wheel,0,0);}
function startSpin(determinedValue)
{var stopAngle=undefined;if(spinMode=="random")
{stopAngle=Math.floor(Math.random()*360);}
else if(spinMode=="determinedAngle")
{if(typeof(determinedValue)==='undefined')
{if(determinedGetUrl)
{xhr.open('GET',determinedGetUrl,true);xhr.send('');}}
else
{if(determinedValue>360){alert("Để chơi trò này bạn cần 200 bạc.\nSố bạc trong tài khoản của bạn không đủ để chơi trò này");resetWheel();document.getElementById('spin_button').className="";wheelState='spinning';}
else
stopAngle=determinedValue;}}
else if(spinMode=="determinedPrize")
{if(typeof(determinedValue)==='undefined')
{if(determinedGetUrl)
{xhr.open('GET',determinedGetUrl,true);xhr.send('');}}
else
{stopAngle=Math.floor(prizes[determinedValue]['startAngle']+(Math.random()*(prizes[determinedValue]['endAngle']- prizes[determinedValue]['startAngle'])));}}
if((typeof(stopAngle)!=='undefined')&&(wheelState=='reset')&&(power))
{stopAngle=(360+ pointerAngle)- stopAngle;targetAngle=(360*(power*6)+ stopAngle);randomLastThreshold=Math.floor(90+(Math.random()*90));document.getElementById('spin_button').className="";$(".power_controls").hide();wheelState='spinning';doSpin();}}
function ajaxCallback()
{if(xhr.readyState<4)
{return;}
if(xhr.status!==200)
{return;}
startSpin(xhr.responseText);}
function doSpin()
{var surfaceContext=surface.getContext('2d');surfaceContext.save();surfaceContext.translate(wheel.width*0.5,wheel.height*0.5);surfaceContext.rotate(DegToRad(currentAngle));surfaceContext.translate(-wheel.width*0.5,-wheel.height*0.5);surfaceContext.drawImage(wheel,0,0);surfaceContext.restore();currentAngle+=angle;if(currentAngle<targetAngle)
{var angleRemaining=(targetAngle- currentAngle);if(angleRemaining>6480)
angle=55;else if(angleRemaining>5000)
angle=45;else if(angleRemaining>4000)
angle=30;else if(angleRemaining>2500)
angle=25;else if(angleRemaining>1800)
angle=15;else if(angleRemaining>900)
angle=11.25;else if(angleRemaining>400)
angle=7.5;else if(angleRemaining>220)
angle=3.80;else if(angleRemaining>randomLastThreshold)
angle=1.90;else
angle=1;spinTimer=setTimeout("doSpin()",theSpeed);}
else
{wheelState='stopped';if((doPrizeDetection)&&(prizes))
{var times360=Math.floor(currentAngle/360);var rawAngle=(currentAngle-(360*times360));var relativeAngle=Math.floor(pointerAngle- rawAngle);if(relativeAngle<0)
relativeAngle=360- Math.abs(relativeAngle);for(x=0;x<(prizes.length);x++)
{if((relativeAngle>=prizes[x]['startAngle'])&&(relativeAngle<=prizes[x]['endAngle']))
{alert("Bạn đã quay trúng "+ prizes[x]['name']+"!");$(".power_controls").show();$(".reset_controls").show();updatelog();break;}}}}}
function DegToRad(d)
{return d*0.0174532925199432957;}
function powerSelected(powerLevel)
{if(wheelState=='reset')
{power=powerLevel;document.getElementById('spin_button').className="clickable";}}
function resetWheel()
{clearTimeout(spinTimer);angle=0;targetAngle=0;currentAngle=0;power=0;$(".reset_controls").hide();document.getElementById('spin_button').className="";wheelState='reset';initialDraw();powerSelected(3);}
function updatelog(){$.ajax({url:site+'/index.php',type:"POST",data:'winwheel=1&a=log',cache:false,success:function(html){$(".list-group").html(html);}});}
