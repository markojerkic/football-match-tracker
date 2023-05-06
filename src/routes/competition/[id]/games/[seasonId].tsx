import { useParams } from "solid-start"

export default () => {
  const params = useParams();

  return (
    <div>
      Comp: {params.id}
      <span class="divider" />

      Season: {params.seasonId}
    </div>
  )
}
