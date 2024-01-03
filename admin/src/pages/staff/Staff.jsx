import React, { useState, useEffect, useMemo } from "react";
import "../../styles/staff.css";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableUser from "../../components/table/table-custom/TableUser";
import axios from "axios";
import { Avatar } from "@mui/material";
import { MdDeleteOutline, MdSaveAlt, MdViewHeadline } from "react-icons/md";
import ModalStaff from "../../components/Modal/ModalStaff";
import Salary from "../../components/Salary/Salary";
import ChartSalary from "../../components/Charts/ChartSalary";

export default function Staff() {
  const [dataStaff, setDataStaff] = useState([]);
  const [rowId, setRowId] = useState("");
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState("");
  const [gender, setGender] = useState(["Male", "Female", "Other"]);

  const [inputField, setInputField] = useState({
    Name: "",
    Telephone: "",
    Email: "",
    Gender: "",
    Image: "",
  });

  const InputHandler = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const Clear = () => {
    setFiles(null);
    setInputField({
      Name: "",
      Telephone: "",
      Email: "",
      Gender: "",
      Image: "",
    });
    setTimeout(() => {
      setErrField({
        NameErr: "",
        TelephoneErr: "",
        EmailErr: "",
      });
    }, 3000);
  };

  //effect data staff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/staff/all");
        setDataStaff(res.data.value);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStaff();
  }, []);

  const Delete = ({ params }) => {
    const handleDelete = async () => {
      const data = params.row._id;
      const response = await axios.delete(
        "http://localhost:8800/api/staff/delete/" + data
      );
      const fetchData = await axios.get("http://localhost:8800/api/staff/all");

      const record = response.data;
      if (record.status === 200) {
        toast.success("Xóa thông tin thành công");
        setDataStaff(fetchData.data.value);
      } else {
        toast.error("Xóa thông tin không thành công");
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

  const Save = ({ params, rowId, setRowId }) => {
    const handleSubmit = async () => {
      const data = {
        StaffId: params.row._id,
        Name: params.row.Name,
        Telephone: params.row.Telephone,
        Gender: params.row.Gender,
        Active: params.row.Active,
      };
      const response = await axios.put(
        "http://localhost:8800/api/staff/update/" + rowId,
        data
      );
      const record = response.data;
      if (record.statusText === "Success") {
        toast.success("Cập nhật thông tin thành công");
      } else {
        toast.error("Xóa thông tin không thành công");
      }
    };

    return (
      <div className="save">
        <button
          className="button-save"
          onClick={() => {
            if (
              window.confirm("Bạn có chắc chắn cập nhật đối tượng này không?")
            )
              handleSubmit();
          }}
        >
          <MdSaveAlt className="icon-save" />
        </button>
      </div>
    );
  };

  const View = ({ params, setRowId }) => {
    const submitHandle = async (e) => {
      e.preventDefault();
      setOpen(true);
      await setRowId(params.row._id);
    };
    // add link to page information customer
    return (
      <div className="view">
        <button className="button-view" onClick={submitHandle}>
          <MdViewHeadline className="icon-view" />
        </button>
      </div>
    );
  };

  // state columns of table
  const columns = useMemo(
    () => [
      {
        field: "Image",
        headerName: "Ảnh",
        width: 60,
        renderCell: (params) => <Avatar src={params.row.Image[0]} />,
        sortable: false,
        filterable: false,
      },
      {
        field: "Name",
        headerName: "Tên",
        width: 120,
        editable: true,
      },
      {
        field: "Telephone",
        headerName: "Số điện thoại",
        width: 90,
        editable: true,
      },
      {
        field: "Email",
        headerName: "Email",
        width: 180,
      },
      {
        field: "Gender",
        headerName: "Giới tính",
        width: 90,
        type: "singleSelect",
        valueOptions: ["Nam", "Nữ", "Khác"],
        editable: true,
      },
      {
        field: "Active",
        headerName: "Tích cực",
        width: 90,
        type: "boolean",
        editable: true,
      },

      {
        field: "isAdmin",
        headerName: "Admin",
        width: 90,
        type: "boolean",
      },
      {
        field: "save",
        width: 80,
        headerName: "Lưu",
        type: "actions",
        renderCell: (params) => <Save {...{ params, rowId, setRowId }} />,
        editable: true,
      },
      {
        field: "delete",
        width: 80,
        headerName: "Xoá",
        type: "actions",
        renderCell: (params) => <Delete {...{ params, rowId, setRowId }} />,
        editable: true,
      },
      {
        field: "view",
        width: 80,
        headerName: "Xem",
        type: "actions",
        renderCell: (params) => <View {...{ params, rowId, setRowId }} />,
        editable: true,
      },
    ],
    [rowId]
  );
  // check error

  const [errField, setErrField] = useState({
    NameErr: "",
    TelephoneErr: "",
    EmailErr: "",
  });

  const validateForm = () => {
    let formValid = true;
    setInputField({
      Name: "",
      Telephone: "",
      Email: "",
    });

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

    if (inputField.Name === "") {
      formValid = false;
      setErrField((prevState) => ({
        ...prevState,
        NameErr: "Vui lòng nhập tên",
      }));
    }

    if (inputField.Telephone === "") {
      formValid = false;
      setErrField((prevState) => ({
        ...prevState,
        TelephoneErr: "Vui lòng nhập số điện thoại",
      }));
    } else {
      if (!inputField.Telephone.match(checkTelephone)) {
        formValid = false;
        setErrField((prevState) => ({
          ...prevState,
          TelephoneErr: "Bạn đã nhập số điện thoại không hợp lệ!",
        }));
      }
    }

    Clear();
    return formValid;
  };

  // create new staff
  const HandlerSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const list = await Promise.all(
        Object.values(files).map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "social0722");
          const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/johnle/image/upload",
            data
          );
          const { url } = uploadRes.data;
          return url;
        })
      );

      const staff = {
        Name: inputField.Name,
        Telephone: inputField.Telephone,
        Image: list,
        Gender: inputField.Gender,
        Email: inputField.Email,
      };
      const response = await axios.post(
        "http://localhost:8800/api/staff/add",
        staff
      );
      const record = response.data;
      const newData = record.value;
      setDataStaff([...dataStaff, newData]);
      Clear();
      if (record.status === 200) {
        toast.success(record.message);
      } else {
        toast.error(record.message);
      }
    }
  };

  return (
    <div className="container">
      {/* container for sidebar */}
      <ModalStaff open={open} onClose={() => setOpen(false)} rowId={rowId} />

      <div className="left-container">
        <Sidebar />
      </div>
      {/* container for topBar and mainBar */}
      <div className="right-container">
        <div className="top-container">
          <TopBar />
        </div>
        {/* phần thông tin của staff */}
        <div className="bottom-profile">
          <div className="staff">
            <ToastContainer />
            <TableUser
              title={"Manager Staff"}
              column={columns}
              row={dataStaff}
              rowId={rowId}
              setRowId={setRowId}
            />
          </div>
        </div>
        <div className="bottom-staff">
          <div className="left-staff">
            <ChartSalary />
          </div>
          <div className="right-staff">
            <form>
              <div className="left-create">
                {files ? (
                  <img
                    src={URL.createObjectURL(files[0])}
                    alt=""
                    className="service-new-image"
                  />
                ) : (
                  <div className="no-image-service">
                    <span className="header-image"> Ảnh</span>
                  </div>
                )}
              </div>
              <div className="right-create">
                <div className="header-receipt">Tạo nhân viên mới</div>
                <div className="btn-service">
                  <label htmlFor="file" className="button-action">
                    Chọn ảnh
                    <input
                      type="file"
                      id="file"
                      multiple
                      style={{ display: "none" }}
                      onChange={(e) => setFiles(e.target.files)}
                    ></input>
                  </label>
                  <label className="button-action" onClick={Clear}>
                    Đóng
                  </label>
                </div>
                <input
                  type="text"
                  className="input-service"
                  name="Name"
                  placeholder="Tên"
                  value={inputField.Name}
                  onChange={InputHandler}
                />
                {errField.NameErr.length > 0 && (
                  <span className="error no-padding">{errField.NameErr} </span>
                )}
                <input
                  type="text"
                  className="input-service"
                  name="Telephone"
                  placeholder="Số điện thoại"
                  maxLength={11}
                  minLength={10}
                  value={inputField.Telephone}
                  onChange={InputHandler}
                />
                {errField.TelephoneErr.length > 0 && (
                  <span className="error no-padding">
                    {errField.TelephoneErr}{" "}
                  </span>
                )}
                <input
                  type="email"
                  className="input-service"
                  name="Email"
                  placeholder="Email"
                  value={inputField.Email}
                  onChange={InputHandler}
                />
                {errField.EmailErr.length > 0 && (
                  <span className="error no-padding">{errField.EmailErr} </span>
                )}

                <select
                  name="Gender"
                  value={inputField.Gender}
                  className="select-service"
                  onChange={InputHandler}
                >
                  {gender.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <button className="button-action" onClick={HandlerSubmit}>
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="salary-container">
          <Salary />
        </div>
      </div>
    </div>
  );
}
