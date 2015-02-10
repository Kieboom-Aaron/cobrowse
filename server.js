var http = require('http'),
	express = require('express'),
	app = express(),
	socketio = require('socket.io'),
	path = require('path');

	app.get('/', function(req, res){
		res.send('test');
	});
	app.set('port', (process.env.PORT || 80))
app.use('/', express.static(path.join(__dirname, '/public')));
var server = http.createServer(app);

var socketServer = socketio();

socketServer.listen(server);

var sockethandle = require('./sockethandler.js');
socketServer.on('connect', function(socket){
	
	socket.on('sessionID', function(data){
		sockethandle.connectClient(socket, data);
	});

	socket.on('ViewClient', function(data){
		sockethandle.connectViewerToClient(socket, data);
	});

	socket.on('data', function(data){
		sockethandle.handleData(socket, data);
	});

	// socket.on('sessionID', function(data){
	// 	if(data === ''){
	// 		sockets[counter] = socket;
	// 		socket.emit('sessionID-res', counter);
	// 		socket.clientId = counter;
	// 		ids.push(counter);
	// 		counter++;
	// 	}else{
	// 		if(sockets[data]){
	// 			socket.emit('sessionID-res', data);
	// 			socket.clientId = data;
	// 			socket.targetSocket = targetSockets[data];
	// 		}else{
	// 			sockets[counter] = socket;
	// 			socket.emit('sessionID-res', counter);
	// 			socket.clientId = counter;
	// 			ids.push(counter);
	// 			counter++;
	// 		}
	// 	}
	// });

	// socket.on('Viewer', function(){
	// 	socket.emit('clients', ids);
	// });

	// socket.on('ViewClient', function(data){
	// 	if(sockets[data]){
	// 		sockets[data].emit('connectViewer');
	// 		sockets[data].targetSocket = socket;
	// 		socket.viewingClient = sockets[data];
	// 	}
	// });

	// socket.on('data', function(data){
	// 	if(socket.targetSocket){
	// 		socket.targetSocket.emit('data', data);
	// 	}
	// });
	// socket.on('disconnect', function(){
	// 	if(socket.targetSocket){
	// 		targetSockets[socket.clientId] = targetSocket;
	// 	}
	// });
});



server.listen(app.get('port'));
console.log('server is listening on port '+app.get('port'));
