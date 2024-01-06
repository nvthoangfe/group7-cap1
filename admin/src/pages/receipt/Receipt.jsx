import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import "../../styles/receipt.css";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { TiDeleteOutline } from "react-icons/ti";
import { IoIosCloseCircleOutline } from "react-icons/io";
import moment from "moment";
import TableUser from "../../components/table/table-custom/TableUser";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "../../context/AuthContext";
import { MdDeleteOutline } from "react-icons/md";
import { convertStringToNumber } from "../../utils/Utils";

export default function Receipt() {
  const { user } = useContext(AuthContext);
  const [dataReceipt, setDataReceipt] = useState([]);
  const [staff, setStaff] = useState([]);
  const [service, setService] = useState([]);
  const [nameStaff, setNameStaff] = useState("");
  console.log("🚀 ~ file: Receipt.jsx:24 ~ Receipt ~ nameStaff:", nameStaff);
  const [discount, setDiscount] = useState();
  const [nameService, setNameService] = useState([]);
  const [telephone, setTelephone] = useState("");
  const [bill, setBill] = useState("");
  const [showBill, setShowBill] = useState(false);
  const [rowId, setRowId] = useState("");
  // for find customer
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  // check form before submit

  useEffect(() => {
    const loadData = async () => {
      const res = await axios.get("http://localhost:8800/api/customer/all");
      setData(res.data.value);
    };
    loadData();
  }, []);

  const handleFilter = async (e) => {
    const searchWord = e.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.Name_Customer.toLowerCase().includes(
        searchWord.toLowerCase()
      );
    });
    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  // print file pdf
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // get date now
  const current = new Date();
  const start = `${current.getFullYear()}-${
    current.getMonth() + 1
  }-${current.getDate()}`;

  const end = `${current.getFullYear()}-${current.getMonth() + 1}-${
    current.getDate() + 1
  }`;

  const [inputField, setInputField] = useState({
    Name_Customer: "",
    Email: "",
  });
  const InputHandler = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };
  const onChangTelephone = (e) => {
    setTelephone(e.target.value.slice(0, 11));
  };
  const OnChangeDiscount = (e) => {
    setDiscount(e.target.value);
  };
  const [errField, setErrField] = useState({
    nameStaffErr: "",
    EmailErr: "",
    TelephoneErr: "",
    NameCustomerErr: "",
    ServiceErr: "",
    DiscountErr: "",
  });

  const validateForm = () => {
    let formValid = true;
    // setInputField({
    //   Name_Customer: "",
    //   Email: "",
    // });
    // setNameService("");
    // setNameStaff("");
    // setTelephone("");

    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const checkTelephone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (inputField.Email === "") {
      formValid = false;
      setErrField((prevState) => ({
        ...prevState,
        EmailErr: "Vui lòng nhập email",
      }));
    } else {
      if (!inputField.Email.match(validEmail)) {
        formValid = false;
        setErrField((prevState) => ({
          ...prevState,
          EmailErr: "Bạn đã nhập một địa chỉ email hợp lệ! ",
        }));
      }
    }

    if (inputField.Name_Customer === "") {
      formValid = false;
      setErrField((prevState) => ({
        ...prevState,
        NameCustomerErr: "Vui lòng nhập tên khách hàng",
      }));
    }

    if (nameStaff === "") {
      formValid = false;
      setErrField((prevState) => ({
        ...prevState,
        nameStaffErr: "Vui lòng nhập tên nhân viên",
      }));
    }

    if (telephone === "") {
      formValid = false;
      setErrField((prevState) => ({
        ...prevState,
        TelephoneErr: "Vui lòng nhập số điện thoại",
      }));
    }

    if (discount < 0) {
      formValid = false;
      setErrField((prevState) => ({
        ...prevState,
        DiscountErr: "Vui lòng nhập mức giảm giá lớn hơn 0",
      }));
    }
    return formValid;
  };

  const fetchData = async () => {
    const data = {
      Start: start,
      End: end,
    };
    const res = await axios.post(
      "http://localhost:8800/api/receipt/list/date",
      data
    );
    setDataReceipt(res.data.value);
  };
  // fetch receipt for a day
  useEffect(() => {
    const data = {
      Start: start,
      End: end,
    };
    const fetchReceiptForADay = async () => {
      const res = await axios.post(
        "http://localhost:8800/api/receipt/list/date",
        data
      );
      setDataReceipt(res.data.value);
    };
    fetchReceiptForADay();
  }, []);

  const updateData = async () => {
    const data = {
      Start: start,
      End: end,
    };
    const res = await axios.post(
      "http://localhost:8800/api/receipt/list/date",
      data
    );
    setDataReceipt(res.data.value);
  };

  useEffect(() => {
    const fetchStaff = async () => {
      const res = await axios.get("http://localhost:8800/api/staff/all");
      setStaff(res.data.value);
    };
    fetchStaff();
    // fetService

    const fetchService = async () => {
      const res = await axios.get("http://localhost:8800/api/service/all");
      setService(res.data.value);
    };
    fetchService();
  }, []);

  const handleStaff = async (e) => {
    setNameStaff(e.target.value);
  };

  const handleServices = async (name) => {
    if (nameService.includes(name)) {
      return;
    } else {
      setNameService([...nameService, name]);
    }
  };

  const ChooseHandler = async (id, name, tel, email) => {
    setInputField({
      Email: email,
      Name_Customer: name,
    });
    setTelephone(tel);
    setWordEntered("");
    setFilteredData([]);
  };
  const handelDeleteService = async (value) => {
    const new_Arr = nameService.filter((item) => item !== value);
    setNameService(new_Arr);
  };

  const resetForm = () => {
    setNameService([]);
    setNameStaff("");
    setDiscount("");
    setInputField({
      Name_Customer: "",
      Email: "",
    });
    setTelephone("");
    setTimeout(() => {
      setErrField({
        nameStaffErr: "",
        EmailErr: "",
        TelephoneErr: "",
        NameCustomerErr: "",
        ServiceErr: "",
        DiscountErr: "",
      });
    }, 3000);
  };

  const submitReceipt = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const data = {
        Name_Customer: inputField.Name_Customer,
        Telephone: telephone,
        Email: inputField.Email,
        Staff_Name: nameStaff,
        Services: nameService,
        Discount: discount,
      };

      try {
        const res = await axios.post(
          "http://localhost:8800/api/receipt/add",
          data
        );

        setBill(res.data.value);
        setShowBill(true);
        resetForm();
        updateData();
        toast.success("Tạo biên nhận thành công");
      } catch (error) {
        toast.error("Tạo biên nhận không thành công");
      }
    }
  };

  const columns = useMemo(
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
    []
  );

  const columnsAdmin = useMemo(
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
        width: 220,
      },
      {
        field: "SumPrice",
        headerName: "Tổng giá",
        width: 120,
        renderCell: (params) => (
          <span>{convertStringToNumber(params?.row.SumPrice)}</span>
        ),
      },
      {
        field: "Discount",
        headerName: "Giảm giá",
        width: 70,
      },
      {
        field: "Total",
        headerName: "Tổng",
        renderCell: (params) => (
          <span>{convertStringToNumber(params?.row.Total)}</span>
        ),
        width: 120,
      },

      {
        field: "delete",
        width: 80,
        headerName: "Delete",
        type: "actions",
        renderCell: (params) => <Delete {...{ params, rowId, setRowId }} />,
        editable: true,
      },
    ],
    [rowId]
  );

  const Delete = ({ params }) => {
    const handleDelete = async () => {
      const data = params.row._id;
      const response = await axios.delete(
        "http://localhost:8800/api/receipt/delete/" + data
      );
      fetchData();

      const record = response.data;
      if (record.status === 200) {
        toast.success(record.message);
      } else {
        toast.error(record.message);
      }
    };
    return (
      <div className="delete">
        <button
          className="button-delete"
          onClick={() => {
            if (window.confirm("Bạn có chắc chắn xóa đối tượng này?"))
              handleDelete();
          }}
        >
          <MdDeleteOutline className="icon-delete" />
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="left-container">
        <Sidebar />
      </div>
      {/* container for topBar and mainBar */}
      <div className="right-container">
        <div className="top-container">
          <TopBar />
        </div>
        <div className="receipt-container">
          <div className="left-receipt" style={{ position: "relative" }}>
            {showBill ? (
              <>
                <button
                  onClick={handlePrint}
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    border: "1px solid ",
                    borderRadius: "4px",
                    backgroundColor: "#bf925b",
                    color: "white",
                    padding: "10px",
                    textTransform: "uppercase",
                    fontFamily: "Barlow Condensed, Arial, sans-serif",
                    letterSpacing: "2px",
                  }}
                >
                  Print
                </button>
                <div className="container-bill">
                  <div className="show-bill" ref={componentRef}>
                    <div className="exit" onClick={() => setShowBill(false)}>
                      <IoIosCloseCircleOutline />
                    </div>
                    <div className="header-bill">
                      Chào mừng đến với SpaSimplify
                    </div>
                    <div div className="items-bill">
                      <div className="item-bill">
                        <span className="title-bill">Tên : </span>
                        <span className="value-bill">{bill.Name_Customer}</span>
                      </div>
                      <div className="item-bill">
                        <span className="title-bill">Số điện thoại: </span>
                        <span className="value-bill"> {bill.Telephone} </span>
                      </div>
                      <div className="item-bill">
                        <span className="title-bill">Email: </span>
                        <span className="value-bill">{bill.Email} </span>
                      </div>
                      <div className="item-bill">
                        <span className="title-bill">Nhân viên:</span>
                        <span className="value-bill"> {bill.Staff_Name} </span>
                      </div>
                      <div className="item-bill">
                        <span className="title-bill"> Tổng giá:</span>
                        <span className="value-bill">
                          {convertStringToNumber(bill.SumPrice)}{" "}
                        </span>
                      </div>
                      <div className="item-bill">
                        <span className="title-bill">Giảm giá: </span>
                        <span className="value-bill"> {bill.Discount} %</span>
                      </div>

                      <div className="item-bill">
                        <span className="title-bill">Tổng: </span>
                        <span className="value-bill">
                          {convertStringToNumber(bill.Total)}{" "}
                        </span>
                      </div>
                      <div className="item-bill">
                        <span className="title-bill">Ngày: </span>
                        <span className="value-bill">
                          {moment(bill.createdAt).format("DD-MM-yyyy")}
                        </span>
                      </div>
                      <span className="thank-bill">
                        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="show-service-booking">
                <div className="header-receipt">Dịch vụ</div>

                <div className="grid-service">
                  {service.map((services, i) => (
                    <div
                      key={i}
                      className="items-service-booking"
                      onClick={() => {
                        handleServices(services.Name_Service);
                      }}
                    >
                      <span className="name-services-span">
                        {services.Name_Service}
                      </span>
                      <span> {convertStringToNumber(services.Price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="right-receipt">
            <div className="find-container">
              <div className="item-find find-receipt">
                <span>
                  <BsSearch />
                </span>
                <input
                  type="text"
                  className="input-find"
                  placeholder="Tìm kiếm khách hàng"
                  value={wordEntered}
                  onChange={handleFilter}
                />
                {filteredData.length !== 0 ? (
                  <>
                    <span
                      onClick={() => {
                        setWordEntered("");
                        setFilteredData([]);
                      }}
                    >
                      <AiOutlineCloseCircle />
                    </span>
                  </>
                ) : null}
              </div>
              {filteredData.length !== 0 && (
                <div className="dataResult result-receipt">
                  {filteredData.map((value, index) => {
                    return (
                      <div
                        className="info-customer"
                        key={index}
                        onClick={() => {
                          ChooseHandler(
                            value._id,
                            value.Name_Customer,
                            value.Telephone,
                            value.Email
                          );
                        }}
                        cd
                      >
                        <img
                          className="img-search"
                          src={value.Image[0]}
                          alt=""
                        />
                        <p className="data">{value.Name_Customer} </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="header-receipt">Tạo biên nhận mới</div>
            <div className="item-receipt">
              <input
                type="text"
                className="input-receipt"
                name="Name_Customer"
                placeholder="Tên"
                value={inputField.Name_Customer}
                onChange={InputHandler}
              />
            </div>
            {errField.NameCustomerErr.length > 0 && (
              <span className="error padding-salary">
                {errField.NameCustomerErr}{" "}
              </span>
            )}
            <div className="item-receipt">
              <input
                type="number"
                className="input-receipt"
                placeholder="Số điện thoại"
                value={telephone}
                onChange={onChangTelephone}
              />
            </div>
            {errField.TelephoneErr.length > 0 && (
              <span className="error padding-salary">
                {errField.TelephoneErr}
              </span>
            )}
            <div className="item-receipt">
              <input
                type="text"
                className="input-receipt"
                name="Email"
                placeholder="Email"
                value={inputField.Email}
                onChange={InputHandler}
              />
            </div>
            {errField.EmailErr.length > 0 && (
              <span className="error padding-salary">{errField.EmailErr} </span>
            )}
            <div className="item-receipt">
              <select
                type="text"
                className="input-receipt"
                placeholder="Nhân viên"
                name="StaffId"
                onChange={handleStaff}
              >
                {staff.map((value, i) => (
                  <option value={value.Name} key={i}>
                    {value.Name}
                  </option>
                ))}
              </select>
            </div>
            {errField.nameStaffErr.length > 0 && (
              <span className="error padding-salary">
                {errField.nameStaffErr}{" "}
              </span>
            )}
            <div className="item-receipt">
              {nameService.length >= 1 ? (
                <div className="list-service">
                  {nameService.map((value, i) => (
                    <div className="item-service-receipt" key={i}>
                      <span> {value} </span>
                      <span>
                        <TiDeleteOutline
                          onClick={() => {
                            handelDeleteService(value);
                          }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                "Xem tất cả dịch vụ"
              )}
            </div>
            <div className="item-receipt">
              <input
                type="number"
                className="input-receipt"
                placeholder="Giảm giá"
                value={discount}
                onChange={OnChangeDiscount}
              />
            </div>
            {errField.DiscountErr.length > 0 && (
              <span className="error padding-salary">
                {errField.DiscountErr}
              </span>
            )}
            <div className="button-receipt">
              <button className="button-action padding" onClick={submitReceipt}>
                Tạo
              </button>
            </div>
          </div>
        </div>
        <div className="bottom-receipt">
          <div className="header-receipt" style={{ paddingTop: " 20px" }}>
            Quản lý biên nhận
          </div>
          {dataReceipt.length > 0 ? (
            <>
              {user.isAdmin === true ? (
                <TableUser
                  column={columnsAdmin}
                  row={dataReceipt}
                  rowId={rowId}
                  setRowId={setRowId}
                />
              ) : (
                <TableUser
                  column={columns}
                  row={dataReceipt}
                  rowId={rowId}
                  setRowId={setRowId}
                />
              )}
            </>
          ) : (
            <div className="check-table">
              Hôm nay bạn không có khách hàng!!!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
