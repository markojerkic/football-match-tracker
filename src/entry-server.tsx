import {
  createHandler,
  renderAsync,
  renderStream,
  renderSync,
  StartServer,
} from "solid-start/entry-server";

export default createHandler(
  renderSync((event) => <StartServer event={event} />)
);
