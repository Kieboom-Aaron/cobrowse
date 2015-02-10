(function(){
	var socket;
	var holder;

	function getCookie(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	    }
	    return "";
	}

	function setCookie(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	}

	function createButton(){
		holder = document.createElement('div');
		holder.style.cssText = 'position:fixed;right:0;bottom:0;z-index:1001';
		var button = document.createElement('button');
		button.innerHTML = 'Connect';
		holder.appendChild(button);
		button.onclick = connect;
		document.body.appendChild(holder);
	}
	
	function addSocketListeners(){
		socket.on('sessionID-res', function(data){
			setCookie('CoBrowseId', data, 1);
		});
		socket.on('connectViewer', function(){
			startChecker();
		});
	}

	function connect(){
		if(window.io){
			socket = new io('ws://localhost');
			socket.on('connect', function(){
				socket.emit('sessionID', getCookie('CoBrowseId'));
				addSocketListeners();
			});
		}else{
			var socketio = document.createElement('script');
			socketio.src='http://localhost/socket.io/socket.io.js';
			document.body.appendChild(socketio);
			socketio.onload = function(){
				connect();
			};
		}
	}

	function start(){
		if(getCookie('CoBrowseId') === ''){
			createButton();
		}else{
			connect();
		}
	}

	var html;
	var keyUp;
	var values;
	function startChecker(){
		html = document.getElementsByTagName('html')[0].outerHTML;
		var inputs = document.getElementsByTagName('input');
			values = {};
			for(var c = 0; c<inputs.length; c++){
				values[c] = inputs[c].value;
			}
		socket.emit('data', {html:html, values:values});
		keyUp = false;
		window.onkeyup = function(){
			keyUp = true;
		};
		setInterval(checkChange, 2000);
	}

	function checkChange(){
		if(keyUp){
			keyUp = false;
			var currentHTML = document.getElementsByTagName('html')[0].outerHTML;
			var inputs = document.getElementsByTagName('input');
			var currentValues = {};
			for(var c = 0; c<inputs.length; c++){
				currentValues[c] = inputs[c].value;
			}
			var emitData = {};
			if(currentHTML !== html){
				emitData.html = currentHTML;
				html = currentHTML;
			}
			if(values !== currentValues){
				emitData.values = currentValues;
				values = currentValues;

			}
			socket.emit('data', emitData);
		}
	}

	function sendUpdate(){

	};

	start();
})();