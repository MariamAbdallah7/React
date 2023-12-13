import React from "react";
import { useQuery } from "react-query";
import styles from "./AllProduct.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { fetchData } from "../../API/functions";

import BeatLoader from 'react-spinners/BeatLoader';
import Spinner from "../../components/Spinner";

// import Spinner from "../../components/Spinner";

function All() {
  const navigate = useNavigate();
  //react query usage
  const { data, error, isLoading } = useQuery("products", fetchData, {
    staleTime: Infinity,
  });
  //handle slider with filter
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  const handleSliderChange = (event) => {
    const value = event.target.value;
    setPriceRange({ ...priceRange, [event.target.name]: value });
  };
  const filteredProducts =
    data &&
    data.filter(
      (product) =>
        parseFloat(product.price) >= priceRange.min &&
        parseFloat(product.price) <= priceRange.max
    );
  //handle loading and errors
  if (isLoading) return <div className={styles.spiner} ><Spinner/></div>;
  // if (isLoading) return <div><BeatLoader color="#36d7b7" /></div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <br />
      <div style={{ textAlign: "center" }}>
        <label>Min Price: </label>
        <input
          type="range"
          name="min"
          min="0"
          max="100"
          value={priceRange.min}
          onChange={handleSliderChange}
        />
        <span> {priceRange.min} </span>
        <label>Max Price: </label>
        <input
          type="range"
          name="max"
          min="0"
          max="1000"
          value={priceRange.max}
          onChange={handleSliderChange}
        />
        <span> {priceRange.max} </span>
      </div>
      <div className={styles.test} style={{}}>
        {filteredProducts &&
          filteredProducts.map((product) => (
            <div key={product.id}>
              <Card
                className={styles.card}
                style={{
                  height: "400px",
                  width: "18rem",
                  border: "1px solid #ccc",
                  margin: "15px",
                  borderRadius: "15px",
                  padding: "15px 10px",
                  position:'relative'
                }}
              >
                <Card.Img
                  className={styles.img}
                  variant="top"
                  src={product.image}
                />
                <hr />
                <Card.Body>
                  <Card.Title>
                    <h2>{product.title}</h2>
                  </Card.Title>
                  <Card.Title>{product.category}</Card.Title>
                  <Card.Text>Price: {product.price}</Card.Text>
                  <Button
                    className={styles.btn}
                    variant="primary"
                    onClick={() => {
                      navigate(`/details/${product.id}`);
                    }}
                    id="btn"
                  >
                    Show Details
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
      </div>
    </div>
  );
}

export default All;
