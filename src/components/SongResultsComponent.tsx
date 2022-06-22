import { Songs } from "../types/Songs";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface SongsProps {
  songs: Songs;
}

let SongResultsComponent = ({ songs }: SongsProps) => {
  return (
    <Card>
      <Card.Img variant="top" src={songs.album.cover} />
      <Card.Body>
        <Card.Title>{songs.artist.name}</Card.Title>
        <Card.Text>{songs.album.title}</Card.Text>
        <Card.Text>{songs.link}</Card.Text>
        {/*         <Button variant="primary">Read more</Button> */}
        <Link to={`/${songs.id}`}>READ MORE</Link>
      </Card.Body>
    </Card>
  );
};

export default SongResultsComponent;
