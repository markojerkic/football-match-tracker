import Pusher from "pusher";
import PusherClient from "pusher-js";

export const sendMessage = (gameId: string) => {
  const pusher = new Pusher({
    appId: "1600531",
    key: "2b14d4e179b0bf561df3",
    secret: "737296daeb9da0db8806",
    cluster: "eu",
    useTLS: true,
  });

  pusher.trigger("game", "update", {
    gameId,
  });
};

export const subscribeGame = (gameId: string, callback: () => void) => {
  const pusher = new PusherClient("2b14d4e179b0bf561df3", {
    cluster: "eu",
  });

  const channel = pusher.subscribe("game");
  channel.bind("update", (payload: { gameId: string }) => {
    if (payload.gameId === gameId) {
      callback();
    }
  });

  return channel;
};
