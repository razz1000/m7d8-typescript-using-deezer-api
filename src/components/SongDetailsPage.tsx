import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";

import ShowArtistDetailsComponent from "./ShowArtistDetailsComponent";
import { Track } from "../types/Track";

let SongDetailsPage = () => {
  const [artistDetail, setArtistDetail] = useState<Track[]>([]);

  const params = useParams();
  const id = params.id;
  console.log("ID:", id);

  let fetchData = async () => {
    let response = await fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/track/" + id
    );
    if (response.ok) {
      let data = await response.json();
      console.log("Artist DATA only:!", data.artist);
      setArtistDetail(data.artist);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ListGroup>
      {artistDetail && (
        <ShowArtistDetailsComponent artistDetail={artistDetail} />
      )}
    </ListGroup>
  );
};
export default SongDetailsPage;
