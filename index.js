fetch("https://www.keio.co.jp/_system/_unkou/unkouInformation.xml",{
  method: "GET", // *GET, POST, PUT, DELETE, etc. 
  mode: "cors", // no-cors, *cors, same-origin
  cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, *same-origin, omit
  headers: {
    "Content-Type": "application/json",
  },
})
.then(response => response.text())
.then(data => { console.log(data) })
.catch(error => { console.log('通信に失敗しました') })





function WriteHTML(id, contents){
	document.getElementById(id).innerHTML = contents;
}

function WriteSrc(id, url){
	document.querySelector(id).setAttribute("src", url);
}





function WriteDirection(col, dir, la="jp"){
	WriteSrc("#dir" + col, "./direction/" + dir + "_" + la + ".SVG");
}

function WriteTime(col, n){
	let hh = Math.floor( n / 60 );
	if(hh >= 24){ hh -= 24 }
	const mm = ("0" + (n % 60)).slice(-2);
	WriteSrc("#hh" + col, "./number/" + hh + ".SVG");
	WriteSrc("#colon"+col, "./number/colon.SVG");
	WriteSrc("#mm" + col, "./number/" + mm + ".SVG");
}

function WriteType(col, type, la="jp"){
	const mod = Math.floor( Sec / SwitchInterval ) % 2;
	if(type <= 4){ WriteSrc("#type" + col , "./type/" + type + "_" + la + ".SVG"); }
	if(type == 5 || type == 6){ WriteSrc("#type" + col , "./type/" + type + ".SVG"); }
	if(type == 30 || type == 40){ 
		if(mod == 0){ WriteSrc("#type" + col , "./type/" + type / 10 + "_" + la + ".SVG"); }
		else		{ WriteSrc("#type" + col , "./type/ko29_" + la + ".SVG"); }
	}
}

function WriteDestination(col, dst, la="jp"){
	WriteSrc("#dst" + col, "./destination/" + dst + "_" + la + ".SVG");
}





function Display(col){
	if(i+col < length){
		const mod = Math.floor( Sec / SwitchInterval / 2 ) % 2;
		if( mod == 0 ){
			WriteDirection(col, a[i+col].dir)
			WriteTime(col, a[i+col].n)
			WriteType(col, a[i+col].type)
			WriteDestination(col, a[i+col].dst)
		}else{
			WriteDirection(col, a[i+col].dir, "en")
			WriteTime(col, a[i+col].n)
			WriteType(col, a[i+col].type, "en")
			WriteDestination(col, a[i+col].dst, "en")
		}
	}else{
		Hide(col);
	}
	if(col == 0){ WriteHTML("info", ""); }
}

function Blink(col){
	const mod = Sec % BlinkInterval;
	if(mod == 0){
		Display(col);
		WriteHTML("info", "電車がきます。ご注意ください。");
		document.querySelector("#info").style.color = "#f43";
	}else{
		Hide(col);
		WriteHTML("info", "");
	}
	if(Sec == 0 && Sound == 1){
		new Audio("./sound/" + a[i+col].dir + ".mp3").play();
	}
}

function Hide(col){
	WriteSrc("#dir"+col, "");
	WriteSrc("#hh"+col, "");
	WriteSrc("#colon"+col, "");
	WriteSrc("#mm"+col, "");
	WriteSrc("#type"+col, "");
	WriteSrc("#dst"+col, "");
}





let Sound = 0;

function Click(){
	(Sound == 0) ? Sound = 1: Sound = 0;
	WriteSrc("#button", "./icon/" + Sound + ".SVG");
}


//let test = 0;


function Main(){

	const RealTime = new Date();
	BlinkInterval = 2;
	SwitchInterval = 7.5;
	
	const TimeStr = RealTime.toLocaleTimeString('ja-JP', {hour12:false});
	WriteHTML("realtime",TimeStr);

	const Hour = RealTime.getHours();
	const Min = RealTime.getMinutes();
	Sec = RealTime.getSeconds();
	let N = 0;
	//let N = test;
	N = (Hour > 1) ? Hour * 60 + Min: (Hour + 24) * 60 + Min;

	if( a[0].n-30 <= N || N <= a[length-1].n ){
		for( i=0; i < length; i++ ){
			if( N <= a[i].n ){

				(N == a[i].n) ? Blink(0): Display(0);
				(i+1 < length) ? (N == a[i+1].n) ? Blink(1): Display(1): Hide(1);
				Display(2);
				Display(3);
				Display(4);
				break;
			}
		}
	}else{
		Hide(0);
		Hide(1);
		Hide(2);
		Hide(3);
		Hide(4);
		WriteHTML("info", "◆本日の運転は終了しました◆");
		document.querySelector("#info").style.color = "#f43";
	}
	//test += 1;
}

setInterval(Main,1000);
