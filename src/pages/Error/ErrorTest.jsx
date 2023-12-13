import React from "react";
import style from "./errorTest.module.css";
import { NavLink } from "react-router-dom";

export default function ErrorTest() {
  return (
    <div>
      <section className={style.page_404}>
        <div className="container">
          <div className="row text-center">
            <div className="col-sm-12 ">
              <div className="">
                <div className={style.four_zero_four_bg}>
                  <h1 className="text-center font-monospace ">Error..!</h1>
                  <NavLink to="/" className={style.link_404}>
                    Go to Home
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
