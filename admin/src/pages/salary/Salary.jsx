import React, { useState, useMemo, useEffect, useContext } from "react";
import "../../styles/listappointment.css";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableUser from "../../components/table/table-custom/TableUser";
import axios from "axios";

import moment from "moment";
import { AuthContext } from "../../context/AuthContext";

export default function ListAppointment() {
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(currentUser);
  const [dataAppointment, setDataAppointment] = useState([]);
  const [dataDayRange, setDataDayRange] = useState([]);
  const [dataReceipt, setDataReceipt] = useState([]);
  const [rowId, setRowId] = useState("");
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);

  const handleStep1 = () => {
    setStep1(true);
    setStep2(false);
    setDateStart(moment(new Date()).format("YYYY-MM-DD"));
  };
  const handleStep2 = () => {
    setStep2(true);
    setStep1(false);
    submitHandle();
  };
  const [dateStart, setDateStart] = useState(moment().format("yyyy-MM-DD"));
  const DateStartHandle = async (e) => {
    setDateStart(moment(new Date(e.target.value)).format("YYYY-MM-DD"));
    handleStep2();
  };

  const submitHandle = async () => {
    try {
      const data = {
        Start: dateStart,
        Staff: user.Name,
      };

      const res = await axios.post(
        "http://localhost:8800/api/appointment/appointment-for-staff",
        data
      );
      setDataDayRange(res.data.value);
    } catch (error) {
      console.log(error);
    }
  };
  const currentDate = moment(new Date()).format("yyyy-MM-DD");

  useEffect(() => {
    const fetchAppointment = async () => {
      const data = {
        Start: currentDate,
        Staff: user.Name,
      };
      const res = await axios.post(
        "http://localhost:8800/api/appointment/appointment-for-staff",
        data
      );
      setDataAppointment(res.data.value);
    };
    fetchAppointment();

    const fetchReceipt = async () => {
      const data = {
        Start: currentDate,
        End: currentDate,
        Staff_Name: user.Name,
      };
      const res = await axios.post(
        "http://localhost:8800/api/receipt/staff-current-day",
        data
      );
      console.log(res.data);
      setDataReceipt(res.data.value);
    };
    fetchReceipt();
  }, []);

  const columns = useMemo(
    () => [
      {
        field: "NameCustomer",
        headerName: "Tên",
        width: 120,
        editable: true,
      },
      {
        field: "TelephoneCustomer",
        headerName: "Số điện thoại",
        width: 90,
        editable: true,
      },
      {
        field: "Email",
        headerName: "Email",
        width: 160,
        editable: true,
      },
      {
        field: "Status",
        headerName: "Trạng thái",
        width: 100,
      },
      {
        field: "date",
        headerName: "Ngày",
        width: 130,
      },
      {
        field: "slotTime",
        headerName: "Thời gian",
        width: 100,
        editable: true,
      },
      {
        field: "Services",
        headerName: "Dịch vụ",
        width: 130,
        editable: true,
      },
    ],
    [rowId]
  );

  const columnReceipt = useMemo(
    () => [
      {
        field: "Name_Customer",
        headerName: "Tên",
        width: 120,
      },
      {
        field: "Telephone",
        headerName: "Số điện thoại",
        width: 100,
      },
      {
        field: "Email",
        headerName: "Email",
        width: 180,
      },
      {
        field: "Staff_Name",
        headerName: "Nhân viên",
        width: 100,
      },

      {
        field: "Services",
        headerName: "Dịch vụ",
        width: 250,
      },
      {
        field: "SumPrice",
        headerName: "Tổng giá",
        width: 90,
      },
      {
        field: "Discount",
        headerName: "Giảm giá",
        width: 70,
      },
      {
        field: "Total",
        headerName: "Tổng",
        width: 90,
      },
    ],
    [rowId]
  );

  return (
    <div className="container">
      {/* container for sidebar */}
      <div className="left-container">
        <Sidebar />
      </div>
      {/* container for topBar and mainBar */}
      <div className="right-container">
        <ToastContainer />
        <div className="top-container">
          <TopBar />
        </div>
        <div className="bottom-container">
          <div className="top-list-appointment">
            <div className="choose-chart">
              <div className="header-revenue">
                <span> Danh sách đặt hẹn</span>
              </div>
              <div className="button-revenue">
                {step1 ? (
                  <React.Fragment>
                    <button
                      className="button-action"
                      onClick={handleStep1}
                      style={{ backgroundColor: "#bf925b", color: "white" }}
                    >
                      Ngày hiện tại
                    </button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <button className="button-action" onClick={handleStep1}>
                      Ngày hiện tại
                    </button>
                  </React.Fragment>
                )}

                {step2 ? (
                  <React.Fragment>
                    <input
                      type="date"
                      className="input-date"
                      value={moment(dateStart).format("yyyy-MM-DD")}
                      onChange={DateStartHandle}
                      style={{ backgroundColor: "#bf925b", color: "white" }}
                    ></input>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <input
                      type="date"
                      className="input-date"
                      value={moment(dateStart).format("yyyy-MM-DD")}
                      onChange={DateStartHandle}
                    ></input>
                  </React.Fragment>
                )}
              </div>
            </div>
            <div className="charts-container">
              {step1 ? (
                <>
                  {dataAppointment.length > 0 ? (
                    <TableUser
                      column={columns}
                      row={dataAppointment}
                      rowId={rowId}
                      setRowId={setRowId}
                    />
                  ) : (
                    <div className="check-table">
                      Hôm nay bạn không có cuộc hẹn nào{" "}
                    </div>
                  )}
                </>
              ) : null}
              {step2 ? (
                <>
                  {dataDayRange.length > 0 ? (
                    <TableUser
                      column={columns}
                      row={dataDayRange}
                      rowId={rowId}
                      setRowId={setRowId}
                    />
                  ) : (
                    <div className="check-table">
                      Hôm nay bạn không có cuộc hẹn nào{" "}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
          <div className="bottom-list-appointment">
            <div className="right-list-appointment">
              <div className="choose-chart">
                <div className="header-revenue">
                  <span> Liệt kê nhiệm vụ hôm nay</span>
                </div>
              </div>
              <>
                {dataReceipt.length > 0 ? (
                  <TableUser
                    column={columnReceipt}
                    row={dataReceipt}
                    rowId={rowId}
                    setRowId={setRowId}
                  />
                ) : (
                  <div className="check-table">
                    Hôm nay bạn chưa phục vụ bất kỳ khách hàng nào
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
