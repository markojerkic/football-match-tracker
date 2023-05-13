import Pusher from "pusher";
import PusherClient from "pusher-js";
import { z } from "zod";

const pusherSchema = z.object({
  PUSHER_APP_ID: z.string(),
  PUSHER_KEY: z.string(),
  PUSHER_SECRET: z.string(),
  PUSHER_CLUSTER: z.string(),
});

const pusherConf = pusherSchema.parse(process.env);

export const sendMessage = (gameId: string) => {
  const pusher = new Pusher({
    appId: pusherConf.PUSHER_APP_ID,
    key: pusherConf.PUSHER_KEY,
    secret: pusherConf.PUSHER_SECRET,
    cluster: pusherConf.PUSHER_CLUSTER,
    useTLS: true,
  });

  pusher.trigger("game", "update", {
    gameId,
  });
};

export const subscribeGame = (gameId: string, callback: () => void) => {
  const pusher = new PusherClient(pusherConf.PUSHER_KEY, {
    cluster: pusherConf.PUSHER_CLUSTER,
  });

  const channel = pusher.subscribe("game");
  channel.bind("update", (payload: { gameId: string }) => {
    if (payload.gameId === gameId) {
      callback();
    }
  });

  return channel;
};
