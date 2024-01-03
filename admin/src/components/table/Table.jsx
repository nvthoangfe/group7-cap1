import React, { useState, useEffect } from "react";
import "../../styles/components/table.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";

export default function Table({ title }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/customer/last-limit3"
      );
      setData(res.data.value);
    };
    fetchData();
  }, []);

  return (
    <div className="table">
      <div className="top-table">
        <span
          className="label-table"
          style={{ fontWeight: "500", textTransform: "uppercase" }}
        >
          {" "}
          Khách hàng mới{" "}
        </span>
        <Link to={`/customer`} style={{ textDecoration: "none" }}>
          <button className="button-table" style={{ color: "white" }}>
            Xem tất cả{" "}
            <span>
              <AiOutlineArrowRight />{" "}
            </span>
          </button>
        </Link>
      </div>
      <div className="bottom-table">
        <div className="table-of-contents">
          <div className="div-table-header">
            <div className="name-table">Tên</div>
            <div className="other">Số điện thoại</div>
            <div className="other">Email</div>
          </div>
          {data.map((val, key) => {
            return (
              <div className="div-table" key={key}>
                <div className="name-table">{val.Name_Customer}</div>
                <div className="other">{val.Telephone}</div>
                <div className="other">{val.Email}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
