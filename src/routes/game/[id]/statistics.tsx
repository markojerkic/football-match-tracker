import { useParams } from "solid-start";
import { GameDetailWrapper } from "~/components/games";

export default () => {
  const id = useParams().id;
  return (
    <GameDetailWrapper tab="timeline" gameId={id}>
      <p>statistika</p>
    </GameDetailWrapper>
  );
};
