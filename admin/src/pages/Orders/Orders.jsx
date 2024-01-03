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
import { convertStringToNumber, getDate } from "../../utils/Utils";
import { Badge, Image, Select, Table } from "antd";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Orders() {
  const { user } = useContext(AuthContext);

  const [dataOrder, setDataOrders] = useState([]);
  const [rowId, setRowId] = useState("");
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState("");

  //effect data staff
  const fetchService = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/orders");
      setDataOrders(res.data.value);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchService();
  }, []);



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
        setDataOrders(fetchData.data.value);
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


  const columns = useMemo(
    () => [
      {
        key: "_id",
        title: "Mã đơn hàng",
        width: 200,
        render: (value) => <p>{value?._id}</p>,
      },
      {
        key: "createdAt",
        title: "Ngày đặt",
        width: 220,
        render: (value) => <p>{getDate(value)}</p>,
      },
      {
        key: "PaymentMethod",
        title: "Phương thức thanh toán",
        width: 250,
        render: (value) => <p>{parseInt(value?.PaymentMethod) === 0 ? 'Chuyển khoản' : 'Tiền mặt'}</p>,
      },
      {
        key: "Vnp_TxnRef",
        title: "Mã thanh toán",
        width: 180,
        render: (value) => <p>{value?.Vnp_TxnRef ?? ''}</p>,
      },
      {
        key: "StatusPayment",
        title: "Trạng thái",
        width: 350,
        render: (value) => {
          return (
            <div>
              <Select
                value={(value?.StatusPayment)}
                style={{ width: '200px' }}
                onChange={(valueSelect) => handleStatusChange(valueSelect, value)}
                options={[
                  {
                    label: 'Chưa thanh toán',
                    value: 0
                  },
                  {
                    label: 'Đã thanh toán',
                    value: 1
                  },
                ]}
              />
            </div>
          );
        },
      },
      {
        key: "TotalPrice",
        title: "Tổng giá trị",
        render: (value) => <p>{convertStringToNumber(value?.TotalPrice)}</p>,
      },
    ],
    []
  );
  const handleStatusChange = async (selectedStatus, row) => {
      try {
        const data = {
          statusPayment: 1,
          staffName : user?.Name
        }
        const response = await axios.put(
          "http://localhost:8800/api/orders/" + row?._id,data
          );
          const resp = response?.data; 
          if (resp?.status === 200){
            toast.success('Lưu dữ liệu thành công')
          }else{
            toast.error('Hệ thống lỗi')
          }
          fetchService();
      } catch (error) {
        
      }
  };
  const expandedRowRender = (record) => {
    // Hiển thị thông tin sản phẩm trong đơn hàng
    const productColumns = [
      { title: 'Tên sản phẩm', dataIndex: 'ProductName', key: 'ProductName' },
      {
        title: 'Hình ảnh', dataIndex: 'Image', key: 'Image', render: (value, record) => {
          return <Image style={{ width: 100 }} src={value} alt='demmo' />
        },
      },
      { title: 'Số lượng', align: 'right', dataIndex: 'Quantity', key: 'Quantity', render: (_, record) => (record.Quantity), },
      { title: 'Giá sản phẩm', align: 'right', dataIndex: 'Price', key: 'Price', render: (value) => convertStringToNumber(value) },
      {
        title: 'Tỏng giá trị',
        dataIndex: 'TotalValue',
        key: 'TotalValue',
        align: 'right',
        render: (_, record) => convertStringToNumber(record.Price * record.Quantity),
      },
    ];

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p><strong>Mã đơn hàng:</strong> {(record?._id)}</p>
          <p><strong>Ngày tạo:</strong> {getDate(record.createdAt)}</p>
        </div>
        <p><strong>Địa chỉ:</strong> {(record?.Address)}</p>
        {/* Bảng hiển thị chi tiết sản phẩm */}
        <Table columns={productColumns} dataSource={record.Products} pagination={false} />

        <h3 style={{ float: 'right', marginTop: 20 }}>
          <strong>Tổng giá trị: </strong>
          {convertStringToNumber(record.TotalPrice)}
        </h3>
      </div>
    );
  };

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 8,
    },
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataOrders([]);
    }
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
            <Table
              style={{ width: '100%'}}
              columns={columns}
              expandable={{
                expandedRowRender: expandedRowRender,
                rowExpandable: (record) => record.name !== 'Not Expandable',
              }}
              dataSource={dataOrder ?? []}
              rowKey="_id"
              pagination={tableParams.pagination}
              onChange={handleTableChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
