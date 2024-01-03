import React, { useState, useContext, useEffect } from "react";
import "../../styles/profile.css";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { MdDriveFileRenameOutline, MdOutlineEmail } from "react-icons/md";
import { BsTelephoneOutbound, BsGenderAmbiguous } from "react-icons/bs";
import { FaAddressCard } from "react-icons/fa";

export default function Profile() {
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(currentUser);
  const [files, setFiles] = useState("");

  // declaration fields in form
  const [inputField, setInputField] = useState({
    Name: user.Name,
    Telephone: user.Telephone,
    Email: user.Email,
    Number: user.Number,
    Street: user.Street,
    District: user.District,
    City: user.City,
    Gender: user.Gender,
  });

  const InputHandler = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // set locaL storage after update
    sessionStorage.setItem("user", JSON.stringify(user));
    const userInfo = JSON.parse(sessionStorage.getItem("user"));
    const newUpdatedUserInfo = {
      ...userInfo,
    };
    sessionStorage.setItem("user", JSON.stringify(newUpdatedUserInfo));
  });

  // update avatar
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

      const data = {
        StaffId: user._id,
        Image: list,
      };
      try {
        const response = await axios.put(
          "http://localhost:8800/api/staff/update/" + user._id,
          data
        );
        const record = response.data;
        setUser(record.value);
        if (record.status === 200) {
          toast.success(record.message);
        } else {
          toast.error(record.message);
        }
      } catch (err) {
        toast.error("Cập nhật trong bộ nhớ phiên không thành công");
      }
    } catch (err) {
      toast.error("Có thể lấy hình ảnh từ Cloud ");
    }
  };

  // update information
  const submitHandler = async (e) => {
    e.preventDefault();
    const staff = {
      StaffId: user._id,
      Name: inputField.Name,
      Telephone: inputField.Telephone,
      Email: inputField.Email,
      Number: inputField.Number,
      Street: inputField.Street,
      District: inputField.District,
      City: inputField.City,
      Gender: inputField.Gender,
    };
    try {
      const response = await axios.put(
        "http://localhost:8800/api/staff/update/" + user._id,
        staff
      );
      const record = response.data;
      setUser(record.value);
      if (record.status === 200) {
        toast.success(record.message);
      } else {
        toast.error(record.message);
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi");
    }
  };

  return (
    <div className="container">
      {/* container for sidebar */}
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
          <ToastContainer />
          {/* phần hình ảnh khi chỉnh sửa */}
          <div className="left-profile">
            <div className="header-change">Thông tin của bạn</div>
            <div className="image-avatar">
              {user.Image && (
                <img
                  src={files ? URL.createObjectURL(files[0]) : user.Image}
                  alt=""
                  className="avatar"
                />
              )}
            </div>
          </div>
          {/* phần thông tin liên hệ  */}
          <div className="right-profile">
            <div className="items-profile">
              <div className="action-profile">
                <form>
                  <label htmlFor="file" className="button-action">
                    Chọn hình ảnh
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
                  Lưu hình ảnh
                </button>
              </div>
            </div>
            {/* phần form để cập nhật thông tin  */}
            <form action="submit">
              <div className="profile-information">
                <div className="input-container-profile">
                  <span className="icon-input">
                    <MdDriveFileRenameOutline />
                  </span>
                  <input
                    className="input-profile"
                    name="Name"
                    autoComplete="off"
                    onChange={InputHandler}
                    required
                    value={inputField.Name}
                    type="text"
                    placeholder="Tên"
                  />
                </div>
                <div className="input-container-profile">
                  <span className="icon-input">
                    <BsTelephoneOutbound />
                  </span>
                  <input
                    className="input-profile"
                    name="Telephone"
                    autoComplete="off"
                    onChange={InputHandler}
                    required
                    value={inputField.Telephone}
                    type="text"
                    placeholder="Số điện thoại"
                  />
                </div>
                <div className="input-container-profile">
                  <span className="icon-input">
                    <MdOutlineEmail />
                  </span>
                  <input
                    className="input-profile"
                    name="Email"
                    autoComplete="off"
                    onChange={InputHandler}
                    required
                    value={inputField.Email}
                    type="email"
                    placeholder="Email"
                  />
                </div>

                <div className="input-container-profile">
                  <span className="icon-input">
                    <FaAddressCard />
                  </span>
                  <input
                    className="input-profile"
                    name="Number"
                    autoComplete="off"
                    onChange={InputHandler}
                    required
                    value={inputField.Number}
                    type="text"
                    placeholder="Số"
                  />
                </div>

                <div className="input-container-profile">
                  <span className="icon-input">
                    <FaAddressCard />
                  </span>
                  <input
                    className="input-profile"
                    name="Street"
                    autoComplete="off"
                    onChange={InputHandler}
                    required
                    value={inputField.Street}
                    type="text"
                    placeholder="Đường"
                  />
                </div>

                <div className="input-container-profile">
                  <span className="icon-input">
                    <FaAddressCard />
                  </span>
                  <input
                    className="input-profile"
                    name="District"
                    autoComplete="off"
                    onChange={InputHandler}
                    required
                    value={inputField.District}
                    type="text"
                    placeholder="Quận"
                  />
                </div>
                <div className="input-container-profile">
                  <span className="icon-input">
                    <FaAddressCard />
                  </span>
                  <input
                    className="input-profile"
                    name="City"
                    autoComplete="off"
                    onChange={InputHandler}
                    required
                    value={inputField.City}
                    type="text"
                    placeholder="Thành phố"
                  />
                </div>

                <div className="input-container-profile">
                  <span className="icon-input">
                    <BsGenderAmbiguous />
                  </span>
                  <select
                    name="Gender"
                    id="selects"
                    className="input-profile"
                    onChange={InputHandler}
                    value={inputField.Gender}
                  >
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other genders">Giới tính khác</option>
                  </select>
                </div>

                <div className="action-profile">
                  <button className="button-action" onClick={submitHandler}>
                    Lưu
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
