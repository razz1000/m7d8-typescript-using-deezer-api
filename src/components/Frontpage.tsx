import { useState } from "react";
import { Form, Button, ListGroup, Container, Row, Col } from "react-bootstrap";
import { Songs } from "../types/Songs";
import SongResultsComponent from "./SongResultsComponent";

const Frontpage = () => {
  const [songQuery, setSongQuery] = useState("");
  const [songData, setSongData] = useState<Songs[]>([]);
  let onChangeFunction = (event: any) => {
    setSongQuery(event.target.value);
  };

  const fetchData = async () => {
    let response = await fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/search?q=" + songQuery
    );
    if (response.ok) {
      const data = await response.json();
      console.log("DATA;", data.data);
      setSongData(data.data);
    }
  };

  const onSubmitFunction = (event: any) => {
    event.preventDefault();

    fetchData();
  };

  return (
    <div>
      <Form onSubmit={onSubmitFunction}>
        <Form.Group controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Search for a song"
            onChange={onChangeFunction}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>
      <div>
        <Container>
          <Row lg={2}>
            <Col>
              <ListGroup className="text-dark">
                {songData.map((song) => (
                  <SongResultsComponent songs={song} />
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Frontpage;
