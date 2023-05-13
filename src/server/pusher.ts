import Pusher from "pusher";
import PusherClient from "pusher-js";
import { z } from "zod";

const pusherSchema = z.object({
  PUSHER_APP_ID: z.string(),
  PUSHER_SECRET: z.string(),
});


export const sendMessage = (gameId: string) => {
  const pusherConf = pusherSchema.parse(process.env);
  const pusher = new Pusher({
    appId: pusherConf.PUSHER_APP_ID,
    key: import.meta.env.VITE_PUSHER_KEY,
    secret: pusherConf.PUSHER_SECRET,
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    useTLS: true,
  });

  pusher.trigger("game", "update", {
    gameId,
  });
};

export const subscribeGame = (gameId: string, callback: () => void) => {
  console.log(import.meta.env)
  const pusher = new PusherClient(import.meta.env.VITE_PUSHER_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  });

  const channel = pusher.subscribe("game");
  channel.bind("update", (payload: { gameId: string }) => {
    if (payload.gameId === gameId) {
      callback();
    }
  });

  return channel;
};
