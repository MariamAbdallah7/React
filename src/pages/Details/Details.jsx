import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { fetchProductDetails } from "../../API/functions";
import style from "./Details.module.css";
import Spinner from "../../components/Spinner";

const Details = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery(
    ["productDetails", id],
    () => fetchProductDetails(id),
    {
      staleTime: Infinity,
    }
  );

  const navigate = useNavigate();
  if (isLoading)
    return (
      <div className={style.spiner}>
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          <div className="container bootdey">
            <div className="col-md-12">
              <section className={style.panel}>
                <div className="panel-body">
                  <div className="col-md-6">
                    <div className={style.proimgdetails}>
                      <img src={data.image} alt="" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h4 className={style.prodtitle}>
                      <a href="#">{data.title}</a>
                    </h4>
                    <div className={style.des}>
                      <strong>Description : </strong>
                      <span>{data.description}</span>
                    </div>
                    <div className={style.product_meta}>
                      <span className={style.posted_in}>
                        {" "}
                        <strong>Categories:</strong>{" "}
                        <a rel="tag" href="#">
                          {data.category}
                        </a>
                        .
                      </span>
                    </div>
                    <div className={style.m_bot15}>
                      {" "}
                      <strong>Price : </strong>{" "}
                      <span className={style.amount_old}>{data.price} $</span>{" "}
                    </div>
                  </div>
                  <Button
                    className={style.btn}
                    variant="primary"
                    onClick={() => {
                      navigate("/all");
                    }}
                    id="btn"
                  >
                    <span>Back</span>
                  </Button>
                </div>
              </section>
            </div>
          </div>

          {/*  */}
        </div>
      )}
    </div>
  );
};

export default Details;
