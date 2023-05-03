import { Navigate } from "solid-start"
import { HttpStatusCode } from "solid-start/server"

export default () => {
  return (
    <>
      <HttpStatusCode code={301} />
      <Navigate href="teams" />
    </>
  )
}
