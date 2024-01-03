import React, { useState, useEffect, useMemo } from "react";
import "../../styles/staff.css";
import "../../styles/service.css";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableUser from "../../components/table/table-custom/TableUser";
import axios from "axios";
import { Avatar } from "@mui/material";
import { MdDeleteOutline, MdSaveAlt, MdViewHeadline } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { convertStringToNumber } from "../../utils/Utils";

export default function Products() {
  const [dataService, setDataService] = useState([]);
  const [rowId, setRowId] = useState("");
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState("");
  const [category, setCategory] = useState([]);

  //effect data staff
  const fetchService = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/products");
      setDataService(res.data.value);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchService();
  }, []);

  // fetch title category
  useEffect(() => {
    const fetchTitleCategory = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/category/title");
        setCategory(res.data.value);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTitleCategory();
  }, []);

  const [inputField, setInputField] = useState({
    Name_Service: "",
    Price: "",
    Description: "",
    Category: "",
    Image: "",
  });
  const [errField, setErrField] = useState({
    nameServiceErr: "",
    PriceErr: "",
    DescriptionErr: "",
    CategoryErr: "",
  });

  const resetForm = () => {
    setInputField({
      Name_Service: "",
      Price: "",
      Description: "",
    });

    setTimeout(() => {
      setErrField({
        nameServiceErr: "",
        PriceErr: "",
        DescriptionErr: "",
        CategoryErr: "",
      });
    }, 3000);
  };

  const validateForm = () => {
    let formValid = true;
    setInputField({
      Name_Service: "",
      Price: "",
      Description: "",
    });

    if (inputField.Name_Service === "") {
      formValid = false;
      setErrField((prevState) => ({
        ...prevState,
        nameServiceErr: "Vui lòng nhập email",
      }));
    }

    if (inputField.Price <= 0) {
      formValid = false;
      setErrField((prevState) => ({
        ...prevState,
        PriceErr: "Giá phải lớn hơn 0",
      }));
    }

    if (inputField.Price === "") {
      formValid = false;
      setErrField((prevState) => ({
        ...prevState,
        PriceErr: "Vui lòng nhập giá",
      }));
    }

    if (inputField.Description === "") {
      formValid = false;
      setErrField((prevState) => ({
        ...prevState,
        DescriptionErr: "Vui lòng nhập mô tả",
      }));
    }

    if (category.length === 0) {
      formValid = false;
      setErrField((prevState) => ({
        ...prevState,
        CategoryErr: "Vui lòng chọn danh mục",
      }));
    }

    resetForm();
    return formValid;
  };

  const InputHandler = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const Delete = ({ params }) => {
    const handleDelete = async () => {
      const id = params.row._id;
      // const data = params.row.Category;
      const response = await axios.delete(
        "http://localhost:8800/api/products/" + id
      );
      const fetchData = await axios.get(
        "http://localhost:8800/api/products"
      );
      const record = response.data;
      if (record.status === 200) {
        toast.success("Xóa thông tin thành công");
        setDataService(fetchData.data.value);
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

  const Save = ({ params }) => {
    const handleSubmit = async () => {
      const data = {
        Name: params.row.Name,
        Price: params.row.Price,
        Describe: params.row.Describe,
        Category: params.row.Category,
      };
      const response = await axios.put(
        "http://localhost:8800/api/products/" + params.row._id,
        data
      );
      
      const record = response.data;
      fetchService();
      if (record.status === 200) {
        toast.success("Cập nhật thông tin thành công");
      } else {
        toast.error("Cập nhật thông tin không thành công");
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
      setRowId(params.row._id);
    };
    return (
      <div className="view">
        <button className="button-view" onClick={submitHandle}>
          <MdViewHeadline className="icon-view" />
        </button>
      </div>
    );
  };

  const Modal = ({ open, onClose, rowId }) => {
    const [dataSelect, setDataSelect] = useState("");
    useEffect(() => {
      const fetchData = async () => {
        const res = await axios.get(
          "http://localhost:8800/api/products/" + rowId
        );
        setDataSelect(res.data.value);
      };
      fetchData();
    }, [rowId]);
    const UpdateAvatar = async (e) => {
      e.preventDefault();
      // up load file to cloudinary and update coverPicture in database
      try {
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

        const dataImage = {
          Image: list[0],
        };
        try {
          const response = await axios.put(
            "http://localhost:8800/api/products/" + rowId,
            dataImage
          );
          fetchService();
          const record = response.data;
          // setDataService(record.value);
          if (record.status === 200) {
            toast.success('Cập nhật thành công');
          } else {
            toast.error(record.message);
          }
        } catch (err) {
          toast.error("Cập nhật trong bộ nhớ phiên không thành công");
        }
      } catch (err) {
        toast.error("Có thể lấy hình ảnh từ Cloud");
      }
    };

    if (!open) return null;

    return (
      <div className="overlay">
        <div className="modalContainer">
          <p className="closeBtn" onClick={onClose}>
            <IoIosCloseCircleOutline />
          </p>
          <div className="modal-service">
            <div className="left-modal">
              {dataSelect.Image && (
                <img
                  src={files ? URL.createObjectURL(files[0]) : dataSelect.Image}
                  alt=""
                  className="service-image"
                />
              )}
            </div>
            <div className="right-modal">
              <div className="item-right-modal">
                <h3 className="title-value"> Ảnh sản phẩm</h3>
                <form>
                  <label htmlFor="file" className="button-profile">
                    Chọn ảnh
                    <input
                      type="file"
                      id="file"
                      multiple
                      style={{ display: "none" }}
                      onChange={(e) => setFiles(e.target.files)}
                    ></input>
                  </label>
                </form>
                <button className="button-action" onClick={UpdateAvatar}>
                  Thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // state columns of table
  const columns = useMemo(
    () => [
      {
        field: "Image",
        headerName: "Ảnh",
        editable: true,

        width: 70,
        renderCell: (params) => <Avatar src={params.row.Image} />,
        sortable: false,
        filterable: false,
      },
      {
        field: "Name",
        headerName: "Tên Sản phẩm",
        width: 250,
        editable: true,
      },
    {
        field: "Describe",
        headerName: "Mô tả",
        width: 350,
        editable: true,
      },
      {
        field: "Category",
        headerName: "Danh mục",
        width: 120,
        editable: true,
      },
      {
        field: "Price",
        headerName: "Giá cả",
        width: 90,
        editable: true,
        renderCell: (params) => <p>{convertStringToNumber(params.row.Price)}</p>,
      },
      
      {
        field: "save",
        width: 90,
        headerName: "Lưu",
        type: "actions",
        renderCell: (params) => <Save {...{ params, rowId, setRowId }} />,
      },
      {
        field: "delete",
        width: 80,
        headerName: "Xoá",
        type: "actions",
        renderCell: (params) => <Delete {...{ params, rowId, setRowId }} />,
      },
      {
        field: "view",
        width: 80,
        headerName: "Xem",
        type: "actions",
        renderCell: (params) => <View {...{ params, rowId, setRowId }} />,
      },
    ],
    [rowId]
  );

  const CreateNewProduct = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('hihihihih');
      
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
      const product = {
        Name: inputField.Name_Service,
        Price: inputField.Price,
        Image: list,
        Describe: inputField.Description,
        Category: inputField.Category,
      };
      try {
        const response = await axios.post(
          "http://localhost:8800/api/products/",
          product
        );
        const record = response.data;
        const newData = record.value;
        setDataService([...dataService, newData]);
        Clear();
        if (record.status === 200) {
          toast.success(record.message);
        } else {
          toast.error(record.message);
        }
      } catch (err) {
        toast.error("Tạo không thành công");
      }
    }
  };

  const Clear = () => {
    setFiles(null);
    setInputField({
      Name_Service: "",
      Price: "",
      Description: "",
      Category: "",
      Image: "",
    });
  };

  return (
    <div className="container">
      {/* container for sidebar */}
      <Modal open={open} onClose={() => setOpen(false)} rowId={rowId} />
      <ToastContainer />
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
            <TableUser
              title={"Quản lý sản phẩm"}
              column={columns}
              row={dataService}
              rowId={rowId}
              setRowId={setRowId}
            />
          </div>
        </div>
        <div className="create-service-container">
          <div className="left-service"></div>
          <div className="right-service">
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
                <h3 className="header-receipt padding-none">
                  Tạo sản phẩm mới
                </h3>
                <div className="btn-service">
                  <label htmlFor="file" className="button-action">
                    Chọn ảnh
                    <input
                      type="file"
                      id="file"
                      multiple
                      required
                      style={{ display: "none" }}
                      onChange={(e) => setFiles(e.target.files)}
                    ></input>
                  </label>
                  <label className="button-action" onClick={Clear}>
                    Đóng
                  </label>
                </div>
                <div className="item-receipt padding-service">
                  <input
                    type="text"
                    className="input-receipt"
                    name="Name_Service"
                    placeholder="Sản phẩm"
                    required
                    value={inputField.Name_Service}
                    onChange={InputHandler}
                  />
                </div>
                {errField.nameServiceErr.length > 0 && (
                  <span className="error no-padding">
                    {errField.nameServiceErr}{" "}
                  </span>
                )}
                <div className="item-receipt padding-service">
                  <input
                    type="number"
                    className="input-receipt"
                    name="Price"
                    placeholder="Giá cả"
                    required
                    value={inputField.Price}
                    onChange={InputHandler}
                  />
                </div>
                {errField.PriceErr.length > 0 && (
                  <span className="error no-padding">{errField.PriceErr} </span>
                )}
                <div className="item-receipt padding-service">
                  <textarea
                    type="text"
                    className="textarea-service"
                    name="Description"
                    placeholder="Mô tả"
                    required
                    value={inputField.Description}
                    onChange={InputHandler}
                  />
                </div>
                {errField.DescriptionErr.length > 0 && (
                  <span className="error no-padding">{errField.PriceErr} </span>
                )}

                <input
                  name="Category"
                  value={inputField.Category}
                  className="select-service"
                  placeholder="Nhập tên danh mục"
                  onChange={InputHandler}
                >
                </input>
                {errField.CategoryErr.length > 0 && (
                  <span className="error no-padding">
                    {errField.CategoryErr}{" "}
                  </span>
                )}
                <button className="button-action" onClick={CreateNewProduct}>
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
