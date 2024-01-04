import React, { useState, useContext, useEffect } from "react";
import "../../styles/components/Sidebar.css";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ContactsIcon from "@mui/icons-material/Contacts";
import { AuthContext } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  BsImages,
  BsPeopleFill,
  BsJournalBookmarkFill,
  BsReceipt,
} from "react-icons/bs";
import {
  MdSpaceDashboard,
  MdOutlinePostAdd,
  MdAttachMoney,
} from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";

export default function Sidebar() {
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(currentUser);

  return (
    <div className="Sidebar">
      <div className="top-sidebar">
        <div className="div-logo">
          <span className="logo"> SpaSimplify</span>
          <span className="burger">
            <GiHamburgerMenu />
          </span>
        </div>
      </div>
      {user?.isAdmin === true ? (
        <div className="bottom-sidebar">
          <NavLink to={`/home`} className="Link">
            <div className="items-sidebar">
              <MdSpaceDashboard className="icon" />
              <div className="item-sidebar">Bảng điều khiển</div>
            </div>
          </NavLink>
          {/* <NavLink to={`/store`} className="Link">
            <div className="items-sidebar">
              <MdSpaceDashboard className="icon" />
              <div className="item-sidebar">Cửa hàng</div>
            </div>
          </NavLink> */}
          <NavLink to={`/customer`} className="Link">
            <div className="items-sidebar">
              <BsPeopleFill className="icon" />
              <div className="item-sidebar">Khách hàng</div>
            </div>
          </NavLink>
          <NavLink to={`/staff`} className="Link">
            <div className="items-sidebar">
              <BsPeopleFill className="icon" />
              <div className="item-sidebar">Nhân viên</div>
            </div>
          </NavLink>
          <NavLink to={`/booking`} className="Link">
            <div className="items-sidebar">
              <BsJournalBookmarkFill className="icon" />
              <div className="item-sidebar">Đặt lịch</div>
            </div>
          </NavLink>
          <NavLink to={`/category`} className="Link">
            <div className="items-sidebar">
              <BiCategoryAlt className="icon" />
              <div className="item-sidebar">Danh mục</div>
            </div>
          </NavLink>
          <NavLink to={`/service`} className="Link">
            <div className="items-sidebar">
              <BiCategoryAlt className="icon" />
              <div className="item-sidebar">Dịch vụ</div>
            </div>
          </NavLink>
          <NavLink to={`/products`} className="Link">
            <div className="items-sidebar">
              <BiCategoryAlt className="icon" />
              <div className="item-sidebar">Sản phẩm</div>
            </div>
          </NavLink>
          <NavLink to={`/orders`} className="Link">
            <div className="items-sidebar">
              <BiCategoryAlt className="icon" />
              <div className="item-sidebar">Đơn hàng</div>
            </div>
          </NavLink>
          {/* <NavLink to={`/post`} className="Link">
            <div className="items-sidebar">
              <MdOutlinePostAdd className="icon" />
              <div className="item-sidebar">Bài viết</div>
            </div>
          </NavLink> */}
          <NavLink to="/receipt" className="Link">
            <div className="items-sidebar">
              <BsReceipt className="icon" />
              <div className="item-sidebar">Biên lai</div>
            </div>
          </NavLink>
          <NavLink to="/revenue" className="Link">
            <div className="items-sidebar">
              <MdAttachMoney className="icon" />
              <div className="item-sidebar">Doanh thu</div>
            </div>
          </NavLink>
          {/* <NavLink to="/banner" className="Link">
            <div className="items-sidebar">
              <BsImages className="icon" />
              <div className="item-sidebar">Banner</div>
            </div>
          </NavLink> */}
        </div>
      ) : (
        <div className="bottom-sidebar">
          <NavLink to={`/home`} className="Link">
            <div className="items-sidebar">
              <MdSpaceDashboard className="icon" />
              <div className="item-sidebar">Dashboard</div>
            </div>
          </NavLink>
          <NavLink to={`/store`} className="Link">
            <div className="items-sidebar">
              <MdSpaceDashboard className="icon" />
              <div className="item-sidebar">Store</div>
            </div>
          </NavLink>
          <NavLink to={`/customer`} className="Link">
            <div className="items-sidebar">
              <BsPeopleFill className="icon" />
              <div className="item-sidebar">Customers</div>
            </div>
          </NavLink>
          <NavLink to={`/booking`} className="Link">
            <div className="items-sidebar">
              <BsJournalBookmarkFill className="icon" />
              <div className="item-sidebar">Booking</div>
            </div>
          </NavLink>
          <NavLink to={`/category`} className="Link">
            <div className="items-sidebar">
              <BiCategoryAlt className="icon" />
              <div className="item-sidebar">Category</div>
            </div>
          </NavLink>
          <NavLink to={`/service`} className="Link">
            <div className="items-sidebar">
              <BiCategoryAlt className="icon" />
              <div className="item-sidebar">Services</div>
            </div>
          </NavLink>
          <NavLink to={`/post`} className="Link">
            <div className="items-sidebar">
              <MdOutlinePostAdd className="icon" />
              <div className="item-sidebar">Posts</div>
            </div>
          </NavLink>
          <NavLink to="/receipt" className="Link">
            <div className="items-sidebar">
              <BsReceipt className="icon" />
              <div className="item-sidebar">Receipts</div>
            </div>
          </NavLink>
          <NavLink to="/banner" className="Link">
            <div className="items-sidebar">
              <BsImages className="icon" />
              <div className="item-sidebar">Banner</div>
            </div>
          </NavLink>
        </div>
      )}
    </div>
  );
}
