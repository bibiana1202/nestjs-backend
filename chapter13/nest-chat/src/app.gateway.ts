import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ namespace: 'chat' }) // 웹소켓 서버 설정 데코레이터
export class ChatGateway {
    @WebSocketServer() server: Server; // 웹소켓 서버 인스턴스 선언

    @SubscribeMessage('message') // message 이벤트 구독
    handleMessage(socket: Socket, data: any): void {
        const { message, nickname } = data;
        // this.server.emit('message', `client-${socket.id.substring(0, 4)}:${data}`,); // 접속한 클라이언트들에 메시지 전송
        socket.broadcast.emit('message', `${nickname}: ${message}`);
    }
}

@WebSocketGateway({ namespace: 'room' })
export class RoomGateway {

    constructor(private readonly chatGateway: ChatGateway) { }
    rooms: string[] = [];

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('createRoom')
    handleMessage(@MessageBody() data: { nickname: string; room: string }) {
        const { nickname, room } = data;
        this.chatGateway.server.emit('notice', {
            message: `${nickname}님이 ${room}방을 만들었습니다.`,
        });
        this.rooms.push(room);
        this.server.emit('rooms', this.rooms);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(socket: Socket, data) {
        const { nickname, room, toLeaveRoom } = data;
        socket.leave(toLeaveRoom);
        this.chatGateway.server.emit('notice', {
            message: `${nickname}님이 ${room}방에 입장했습니다.`,
        });
        socket.join(room);
    }

    @SubscribeMessage('message')
    handleMessageToRoom(socket: Socket, data) {
        const { nickname, room, message } = data;
        console.log(data);
        socket.broadcast.to(room).emit('message', {
            message: `${nickname}:${message}`,
        });
    }
}