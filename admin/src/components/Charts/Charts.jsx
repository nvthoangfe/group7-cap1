import React, { useEffect, useState } from "react";
import "../../styles/components/chart.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { convertStringToNumber } from "../../utils/Utils";

export default function Charts() {
  const [data, setData] = useState([]);

  const current = new Date();

  const start_month = `${current.getFullYear()}-${current.getMonth() + 1}-01`;

  const end_month = `${current.getFullYear()}-${current.getMonth() + 1}-30`;

  useEffect(() => {
    const dataMonth = {
      Start: start_month,
      End: end_month,
    };
    const fetData = async () => {
      const res = await axios.post(
        "http://localhost:8800/api/receipt/week",
        dataMonth
      );
      setData(res.data.value);
    };
    fetData();
  }, []);
  const CustomYAxisTick = (props) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          // transform="rotate(-45)"
        >
          {payload.value.toLocaleString("en-US", {
            style: "currency",
            currency: "VND",
          })}
        </text>
      </g>
    );
  };
  return (
    <div className="Charts">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={300}
          height={100}
          data={data}
          margin={{ top: 20, right: 10, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis tick={<CustomYAxisTick />} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div
                    style={{
                      background: "white",
                      borderRadius: 8,
                      padding: 5,
                    }}
                  >
                    <p>{`ID: ${data._id}`}</p>
                    <p>{`Total Amount: ${convertStringToNumber(
                      data.totalAmount
                    )}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            type="monotone"
            dataKey="totalAmount"
            stroke="#bf925b"
            fill="#bf925b"
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
