import io from "socket.io-client";

const SOCKET_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

let socket = null;

export const initializeSocket = (userId) => {
	if (socket) {
		socket.disconnect();
	}

	socket = io(SOCKET_URL, {
		auth: { userId },
	});
};

export const getSocket = () => {
	if (!socket) {
		throw new Error("Socket not initialized");
	}
	return socket;
};

export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};
