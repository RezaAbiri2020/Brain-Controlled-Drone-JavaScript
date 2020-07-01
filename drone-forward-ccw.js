
	

/////////////////////////////////////////////////////////
var arDrone = require('ar-drone');
var client = arDrone.createClient();
client.takeoff();


console.log("startttttttttttttttttttttttttttttttttttttttttt");
///////////////////////////////////////////////////////////////////////

stopFlight = false;
Fx=0;



client.after(35000, function() {
	stopFlight = true;
	this.land();
});


// Definition of UDP parameters
var PORT = 40000;
var HOST = 'localhost';
var dgram = require('dgram');
var server = dgram.createSocket('udp4');



var v=1;
// Connect to UDP stream from PC
server.on('listening', function () {
	var address = server.address();
	console.log('UDP Server listening on ' + address.address + ":" + address.port);
});


// Add 2 seconds delay




i=0;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
server.on('message', function (msg, remote) {
	mybuffer=msg.toString('utf-8'); //convert the received msg to a string using the utf-8 format
	console.log(i); //display the index i
	console.log(remote.address + ':' + remote.port +' - ' + msg); //display the address of BCI2000, the port, and the received message



	var mymatchOne=/CursorPosX/gi; //define mymatchone as the string CursorPosX
	var mymatchTwo=/Feedback/gi; //define mymatchtwo as the string Feedback

	if (mymatchTwo.test(mybuffer)) { //test if mybuffer contains the string mymatchTwo, which is the feedback
		Fx=(parseFloat(mybuffer.substring(9))); //find the feedback value and convert to a float number
				//console.log("Founddddddddddddddddddddddddddddd");
				//client.stop();
				//var cur_timeFeed = (new Date).getTime();
	      		//console.log(cur_timeFeed);
	      		//console.log(cur_timeFeed - prev_time);
	      		//prev_time = cur_timeFeed;
	}

	if (mymatchOne.test(mybuffer))	{ //test if mybuffer contains the string mymatchOne
		Px=(parseFloat(mybuffer.substring(11))); //find the cursor position and convert to a float number
				//console.log("Founddddddddddddddddddddddddddddd");
				//var cur_timePos = (new Date).getTime();
	      		//console.log(cur_timePos);
	      		//t=Math.abs(cur_timePos-cur_timeFeed);
	      		//t=cur_timePos-prev_time;
	      		//console.log(t);
	}

	
	i=i+1;
	if (i==33) { //the message block contains 33 lines
		console.log(Fx);
		console.log(Px);

		if ((Fx==0) && (stopFlight == false)) {
			client.stop();
		}

		if ((Fx==1) && (stopFlight == false)) {
			 
			
			if ((Px>2700) ) { 
				client.front(0.07);
			} 
			else if ((Px<700) ){
				
				client.counterClockwise(0.5);
			} 
			else {
				client.stop();
			}
		}

		i=0;

	}
	
	});



server.bind(PORT, HOST);




