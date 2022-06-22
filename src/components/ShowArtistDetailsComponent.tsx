import { Card } from "react-bootstrap";
import { Track } from "../types/Track";

interface ArtistProps {
  artistDetail: Track;
}

let ShowArtistDetailsComponent = ({ artistDetail }: ArtistProps) => {
  return (
    <Card>
      <Card.Img variant="top" src={artistDetail.picture} />
      <Card.Body>
        <Card.Title className={"text-dark"}>{artistDetail.name}</Card.Title>
        <Card.Text className={"text-dark"}>{artistDetail.id}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ShowArtistDetailsComponent;
