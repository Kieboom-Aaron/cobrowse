
var exports = module.exports;

var counter = 0;
var socketHolders = {};
var ids = [];

exports.connectClient = function(socket, id){
    if(id){
        if(ids.indexOf(Number(id)) === -1){
            socket.holderid = counter;
            var socketholder = {
                socket:socket
            };
            socketHolders[counter] = socketholder;
            ids.push(counter);
            socket.emit('sessionID-res', counter);
            counter++;
        }else{
            if(socketHolders[id].timeout){
                clearTimeout(socketHolders[id].timeout);
                socketHolders[id].timeout = null;
            }
            socket.holderid = id;
            socketHolders[id].socket = socket;
            socket.emit('sessionID-res', id);
            if(socketHolders[id].targetSocket){
                socketHolders[id].targetSocket.clientSocket = socket;
                socket.emit('connectViewer');
            }
        }
    }else{
        socket.holderid = counter;
        var socketholder = {
            socket:socket
        };
        socketHolders[counter] = socketholder;
        ids.push(counter);
        socket.emit('sessionID-res', counter);
        counter++;
    }
};

exports.connectViewerToClient = function(socket, id){
    if(ids.indexOf(id) !== -1){
        if(!socketHolders[id].targetSocket){
            socketHolders[id].targetSocket = socket;
            socket.clientSocket = socketHolders[id].socket;
            socketHolders[id].socket.emit('connectViewer');
        }
    }
};

exports.disconnectSocket = function(socket){
    if(socket.clientSocket){
        socketHolders[socket.clientSocket.holderid].targetSocket = null;
        socket.clientSocket = null;
    }else{
        var holderid = socket.holderid;
        socketHolders[holderid].timeout = setTimeout(function(){
            socketHolders[holderid] = null;
            ids.splice(ids.indexOf(holderid), 1);
        }, (3 * 60 * 1000));
    }
};

exports.handleData = function(socket, data){
    if(socketHolders[socket.holderid] && socketHolders[socket.holderid].targetSocket){
        socketHolders[socket.holderid].targetSocket.emit('data', data);
    }
};