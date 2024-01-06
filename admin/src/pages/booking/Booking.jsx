import React, { useState, useEffect, useMemo } from "react";
import "../../styles/booking.css";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/Sidebar";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableUser from "../../components/table/table-custom/TableUser";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import ChartAppointment from "../../components/Charts/ChartAppointment";
import { FaBan, FaCheckCircle } from "react-icons/fa";

export default function Booking() {
  const [rowId, setRowId] = useState("");
  const [StatusBooking, setStatusBooking] = useState();
  const [date, setDate] = useState();
  const current = new Date();
  // current date
  const currentDate = moment(new Date()).format("yyyy-MM-DD");
  const nextDate = moment(currentDate).add(1, "days").format("yyyy-MM-DD");
  // data current day
  const [dataDayCurrent, setDataDayCurrent] = useState([]);
  //data previous day
  const [dataDayPrevious, setDataDayPrevious] = useState([]);
  // data current month
  const [dataCurrentMonth, setDataCurrentMonth] = useState([]);
  // data list range date
  const [dataDayRange, setDataDayRange] = useState([]);
  // date start and date end of range date
  const [dateStart, setDateStart] = useState(moment().format("yyyy-MM-DD"));
  const [dateEnd, setDateEnd] = useState(moment().format("yyyy-MM-DD"));
  // current date
  const [step1, setStep1] = useState(true);
  // current week
  const [step2, setStep2] = useState(false);
  // current month
  const [step3, setStep3] = useState(false);

  const [step4, setStep4] = useState(false);

  const handleStep1 = () => {
    setStep1(true);
    setStep2(false);
    setStep3(false);
    setStep4(false);
  };
  const handleStep2 = () => {
    setStep2(true);
    setStep1(false);
    setStep3(false);
    setStep4(false);
  };
  const handleStep3 = () => {
    setStep2(false);
    setStep1(false);
    setStep3(true);
    setStep4(false);
  };

  const handleStep4 = () => {
    setStep2(false);
    setStep1(false);
    setStep4(true);
    setStep3(false);
  };

  // date for previous month

  const start = `${current.getFullYear()}-${current.getMonth() + 1}-01`;

  const end = `${current.getFullYear()}-${current.getMonth() + 1}-30`;
  const FetchDataAfterDelete = async () => {
    setStatusBooking("pending");
    const fetchDayCurrent = async () => {
      const data = {
        Date: currentDate,
        Status: StatusBooking,
      };
      const res = await axios.post(
        "http://localhost:8800/api/appointment/",
        data
      );
      setDataDayCurrent(res.data.value);
    };
    fetchDayCurrent();

    const fetchDatePrevious = async () => {
      const data = {
        Date: nextDate,
        Status: StatusBooking,
      };

      const res = await axios.post(
        "http://localhost:8800/api/appointment/",
        data
      );
      setDataDayPrevious(res.data.value);
    };
    fetchDatePrevious();

    const fetchCurrentMonth = async () => {
      const data = {
        Start: start,
        End: end,
        Status: StatusBooking,
      };

      const res = await axios.post(
        "http://localhost:8800/api/appointment/time-range",
        data
      );

      setDataCurrentMonth(res.data.value);
    };
    fetchCurrentMonth();
  };

  useEffect(() => {
    setStatusBooking("pending");
  }, []);
  useEffect(() => {
    //fetch data of current date
    const fetchDayCurrent = async () => {
      const data = {
        Date: date && date !== "Invalid date" && date,
        Status: StatusBooking,
      };

      const res = await axios.post(
        "http://localhost:8800/api/appointment/time-range",
        data
      );
      if (res.data.value) {
        setDataCurrentMonth(res.data.value);
      }
    };
    fetchDayCurrent();
  }, [StatusBooking, date]);

  // useEffect(() => {
  //   // fetch data for previous date
  //   const fetchDatePrevious = async () => {
  //     const data = {
  //       Date: nextDate,
  //       Status: StatusBooking,
  //     };

  //     const res = await axios.post(
  //       "http://localhost:8800/api/appointment/",
  //       data
  //     );
  //     setDataDayPrevious(res.data.value);
  //   };
  //   fetchDatePrevious();
  // }, [StatusBooking]);

  const DateHandle = async (e) => {
    setDate(moment(new Date(e.target.value)).format("YYYY-MM-DD"));
  };

  const DateEndHandle = async (e) => {
    setDateEnd(moment(new Date(e.target.value)).format("YYYY-MM-DD"));
    handleStep4();
  };

  const submitHandle = async () => {
    try {
      const data = {
        Start: dateStart,
        End: dateEnd,
        Status: StatusBooking,
      };

      const res = await axios.post(
        "http://localhost:8800/api/appointment/time-range",
        data
      );
      setDataDayRange(res.data.value);
    } catch (error) {
      console.log(error);
    }
  };

  const Accept = ({ params }) => {
    const AcceptBooking = async (idAppointment) => {
      const data = {
        Status: "accept",
      };
      try {
        const res = await axios.put(
          "http://localhost:8800/api/appointment/update/" + idAppointment,
          data
        );
        toast.success("Xác nhận thành công");
        FetchDataAfterDelete();
      } catch (error) {
        toast.error("Xác nhận không thành công");
      }
    };
    return (
      <div className="save">
        <button
          className="button-save"
          onClick={() => {
            if (window.confirm("Xác nhận cuộc hẹn ?"))
              AcceptBooking(
                params.row._id,
                params.row.StaffId,
                params.row.DateId,
                params.row.SlotId,
                params.row.Email
              );
          }}
        >
          <FaCheckCircle className="icon-save" />
        </button>
      </div>
    );
  };

  const Denied = ({ params }) => {
    const DeniedeHandle = async (idAppointment) => {
      const data = {
        Status: "denied",
      };
      try {
        const res = await axios.put(
          "http://localhost:8800/api/appointment/update/" + idAppointment,
          data
        );
        toast.success("Từ chối hẹn thành công");
        FetchDataAfterDelete();
      } catch (error) {
        toast.error("Từ chối cuộc hẹn không thành công");
      }
    };
    return (
      <div className="delete">
        <button
          className="button-delete"
          onClick={() => {
            if (window.confirm("Bạn xác nhận từ chối cuộc hẹn ?"))
              DeniedeHandle(params.row._id);
          }}
        >
          <FaBan className="icon-delete" />
        </button>
      </div>
    );
  };

  const Delete = ({ params }) => {
    const DeleteHandle = async (
      idAppointment,
      idStaff,
      idDate,
      idSlot,
      email
    ) => {
      const status = "cancel";
      const data = {
        DateId: idDate,
        StaffId: idStaff,
        SlotId: idSlot,
        Status: status,
        Email: email,
      };
      try {
        const res = await axios.put(
          "http://localhost:8800/api/appointment/update-cancel/" +
            idAppointment,
          data
        );
        toast.success("Hủy cuộc hẹn thành công");
        FetchDataAfterDelete();
      } catch (error) {
        toast.error("Hủy cuộc hẹn không thành công");
      }
    };
    return (
      <div className="delete">
        <button
          className="button-delete"
          onClick={() => {
            if (window.confirm("Bạn có chắc chắn hủy cuộc hẹn này không?"))
              DeleteHandle(
                params.row._id,
                params.row.StaffId,
                params.row.DateId,
                params.row.SlotId,
                params.row.Email
              );
          }}
        >
          <MdDeleteOutline className="icon-delete" />
        </button>
      </div>
    );
  };
  useEffect(() => {
    setStatusBooking("pending");
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
        width: 90,
        renderCell: (params) => (
          <p>
            {params?.row?.Status === "accept"
              ? "Đã xác nhận"
              : params?.row.Status === "denied"
              ? "Đã từ chối"
              : "Chờ xử lý"}
          </p>
        ),
      },
      {
        field: "date",
        headerName: "Ngày",
        width: 100,
      },
      {
        field: "slotTime",
        headerName: "Thời gian",
        width: 80,
        editable: true,
      },
      {
        field: "Services",
        headerName: "Dịch vụ",
        renderCell: (params) => {
          const servicesArray = Array.isArray(params?.row?.Services)
            ? params.row.Services
            : [];
          return (
            <div className="service-list">
              {servicesArray.length > 0 ? (
                <p>{servicesArray.join(", ")}</p>
              ) : (
                <p>No services available</p>
              )}
            </div>
          );
        },
        width: 400,
      },
      {
        field: "Staff",
        headerName: "Nhân viên",
        width: 100,
      },
      {
        field: "Accept",
        width: 80,
        headerName: "Chấp nhận",
        type: "actions",
        renderCell: (params) => (
          <>
            {params.row.Status !== "accept" && (
              <Accept {...{ params, rowId, setRowId }} />
            )}
          </>
        ),
      },
      {
        field: "Denied",
        width: 80,
        headerName: "Từ chối",
        type: "actions",
        renderCell: (params) => (
          <>
            {params.row.Status !== "denied" && (
              <Denied {...{ params, rowId, setRowId }} />
            )}
          </>
        ),
      },
      // {
      //   field: "Cancel",
      //   width: 80,
      //   headerName: "Xoá",
      //   type: "actions",
      //   renderCell: (params) => <Delete {...{ params, rowId, setRowId }} />,
      // },
    ],
    [rowId]
  );

  const StatusBookingOptions = [
    {
      label: "Chờ xử lý",
      value: "pending",
    },
    {
      label: "Đã xác nhận",
      value: "accept",
    },
    {
      label: "Đã từ chối",
      value: "denied",
    },
  ];
  return (
    <div className="container">
      <div className="left-container">
        <Sidebar />
      </div>
      <div className="right-container">
        <div className="top-container">
          <TopBar />
        </div>
        <div className="bottom-container">
          <ToastContainer />

          <div className="revenue-container">
            <div className="choose-chart">
              <div className="header-revenue">
                <span> Bảng đặt hẹn</span>
              </div>
              <div className="button-revenue">
                <React.Fragment>
                  <Link to={`/appointment`} style={{ textDecoration: "none" }}>
                    <button className="button-action">Thêm cuộc hẹn</button>
                  </Link>
                </React.Fragment>
                <select
                  name="Status"
                  value={StatusBooking}
                  className="select-service"
                  onChange={(e) => setStatusBooking(e.target.value)}
                >
                  {StatusBookingOptions.map((option) => (
                    <option key={option} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  className="input-date"
                  // value={moment(dateEnd).format("yyyy-MM-DD")}
                  onChange={DateHandle}
                  style={{ backgroundColor: "#bf925b", color: "white" }}
                ></input>
                {/* {step1 ? (
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
                    <button
                      className="button-action"
                      onClick={handleStep2}
                      style={{ backgroundColor: "#bf925b", color: "white" }}
                    >
                      Ngày tiếp theo
                    </button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <button onClick={handleStep2} className="button-action">
                      Ngày tiếp theo
                    </button>
                  </React.Fragment>
                )}
                {step3 ? (
                  <React.Fragment>
                    <button
                      className="button-action"
                      onClick={handleStep3}
                      style={{ backgroundColor: "#bf925b", color: "white" }}
                    >
                      Tháng hiện tại
                    </button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <button onClick={handleStep3} className="button-action">
                      Tháng hiện tại
                    </button>
                  </React.Fragment>
                )}

                {step4 ? (
                  <React.Fragment>
                    <input
                      type="date"
                      className="input-date"
                      max={dateEnd}
                      value={moment(dateStart).format("yyyy-MM-DD")}
                      onChange={DateStartHandle}
                      style={{ backgroundColor: "#bf925b", color: "white" }}
                    ></input>
                    <input
                      type="date"
                      className="input-date"
                      value={moment(dateEnd).format("yyyy-MM-DD")}
                      onChange={DateEndHandle}
                      style={{ backgroundColor: "#bf925b", color: "white" }}
                    ></input>
                    <button className="button-action" onClick={submitHandle}>
                      {" "}
                      Hoàn thành
                    </button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <input
                      type="date"
                      className="input-date"
                      max={dateEnd}
                      value={moment(dateStart).format("yyyy-MM-DD")}
                      onChange={DateStartHandle}
                    ></input>

                    <input
                      type="date"
                      className="input-date"
                      value={moment(dateEnd).format("yyyy-MM-DD")}
                      onChange={DateEndHandle}
                    ></input>
                  </React.Fragment>
                )} */}
              </div>
            </div>
            <div className="charts-container">
              {step1 ? (
                <>
                  {dataCurrentMonth.length > 0 ? (
                    <TableUser
                      column={columns}
                      row={dataCurrentMonth}
                      rowId={rowId}
                      setRowId={setRowId}
                    />
                  ) : (
                    <div className="check-table">
                      Hôm nay bạn không có cuộc hẹn nào!!!
                    </div>
                  )}
                </>
              ) : null}
              {step2 ? (
                <>
                  {dataCurrentMonth.length > 0 ? (
                    <TableUser
                      column={columns}
                      row={dataCurrentMonth}
                      rowId={rowId}
                      setRowId={setRowId}
                    />
                  ) : (
                    <div className="check-table">
                      Ngày mai bạn không có cuộc hẹn nào!!!
                    </div>
                  )}
                </>
              ) : null}

              {step3 ? (
                <>
                  {dataCurrentMonth.length > 0 ? (
                    <TableUser
                      column={columns}
                      row={dataCurrentMonth}
                      rowId={rowId}
                      setRowId={setRowId}
                    />
                  ) : (
                    <div className="check-table">
                      Bạn không có cuộc hẹn nào trong tháng này !!!
                    </div>
                  )}
                </>
              ) : null}
              {step4 ? (
                <TableUser
                  column={columns}
                  row={dataDayRange}
                  rowId={rowId}
                  setRowId={setRowId}
                />
              ) : null}
            </div>
          </div>
          <div className="chart-booking">
            <div className="chart-booking-right">
              <ChartAppointment />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
