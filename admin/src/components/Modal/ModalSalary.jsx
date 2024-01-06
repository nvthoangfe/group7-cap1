import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ModalSalary({ open }) {
  const [staff, setStaff] = useState([]);
  const [nameStaff, setNameStaff] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState(moment().format("yyyy-MM-DD"));
  const [salary, setSalary] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchStaff = async () => {
      const res = await axios.get("http://localhost:8800/api/staff/all");
      setStaff(res.data.value);
    };
    fetchStaff();
  }, []);

  const handleStaff = (e) => {
    setNameStaff(e.target.value);
  };
  const handleDate = (e) => {
    const newDate = moment(new Date(e.target.value));
    setDate(newDate);
  };

  const resetForm = () => {
    setDate("");
    setSalary();
    setAllowance();
    setNameStaff("");
    setStatus("");
  };
  const onChangeTotal = () => {
    setTotal(parseInt(allowance) + parseInt(salary));
    console.log(total);
  };

  const submitHandle = async (e) => {
    e.preventDefault();

    const data = {
      Name: nameStaff,
      Status: status,
      Date: date,
      Salary: salary,
      Allowance: allowance,
      Total: total,
    };

    console.log(data);
    try {
      const res = await axios.post(
        "http://localhost:8800/api/salary/add",
        data
      );
      resetForm();
      if (res.data.status === 200) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Tạo lương không thành công");
      resetForm();
    }
  };

  return (
    open && (
      <div className="salary-modal">
        <ToastContainer />
        <div className="modal-container">
          <div className="header-receipt"> Thêm lương</div>
          <div className="item-receipt">
            <select
              type="text"
              className="input-receipt"
              placeholder="Nhân viên"
              onChange={handleStaff}
            >
              {staff.map((values, u) => (
                <option value={values.Name} key={u}>
                  {values.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="item-receipt">
            <select
              type="text"
              className="input-receipt"
              placeholder="Trạng thái"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Paid">Thanh toán</option>
              <option value="Unpaid">Chưa thanh toán</option>
            </select>
          </div>
          <div className="item-receipt">
            <input
              type="date"
              className="input-receipt"
              placeholder="Ngày"
              value={moment(date).format("yyyy-MM-DD")}
              onChange={handleDate}
            />
          </div>
          <div className="item-receipt">
            <input
              type="number"
              className="input-receipt"
              placeholder="Lương"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>
          <div className="item-receipt">
            <input
              type="number"
              className="input-receipt"
              placeholder="Phụ cấp"
              value={allowance}
              onChange={(e) => setAllowance(e.target.value)}
            />
          </div>
          <div className="item-receipt">
            <input
              type="number"
              className="input-receipt"
              placeholder="Tổng"
              value={total}
              onChange={onChangeTotal}
            />
          </div>
          <div className="button-receipt">
            <button className="button-action padding" onClick={submitHandle}>
              Tạo
            </button>
          </div>
        </div>
      </div>
    )
  );
}
