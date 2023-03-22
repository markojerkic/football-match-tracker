import { createEffect } from "solid-js";
import { isServer } from "solid-js/web";

export const createScrollToBottom = (
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  fetchNextPage: () => void
) => {

    createEffect(() => {
      console.log('server')
      console.log('client')
      alert('scroll')
      const listener = () => {
        const { scrollTop, scrollHeight, clientHeight } =
          document.documentElement;

        if (
          scrollTop + clientHeight >= scrollHeight - (scrollHeight / 4) &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      };
      addEventListener("scroll", listener);

      return () => {
        removeEventListener("scroll", listener);
      };
    });
};

