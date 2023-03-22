import {
  createHandler,
  renderAsync,
  renderStream,
  renderSync,
  StartServer,
} from "solid-start/entry-server";

export default createHandler(
  renderStream((event) => <StartServer event={event} />)
);
