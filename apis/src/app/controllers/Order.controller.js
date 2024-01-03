import mongoose from "mongoose";
import Order from "../models/Order/Order.model.js";
import Receipts from "../models/Receipts/Receipts.model.js";
import moment from "moment";
import config from 'config';
import crypto from 'crypto';
import QueryString from "qs";

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

async function createPaymentBank(req, amount) {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');

  let ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');
  let vnpUrl = config.get('vnp_Url');
  let returnUrl = config.get('vnp_ReturnUrl');
  let orderId = moment(date).format('DDHHmmss');

  let bankCode = req.body.bankCode;
  let locale = req.body.language;

  locale = 'vn';
  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  const description = `Thanh toán chuyển khoản ` + orderId;
  vnp_Params['vnp_OrderInfo'] = description;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100; // Make sure 'amount' is defined
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  // Rest of the code remains the same
  vnp_Params = sortObject(vnp_Params);
  let signData = QueryString.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + QueryString.stringify(vnp_Params, { encode: false });
  if (vnpUrl) {
    return { vnpUrl:vnpUrl, vnp_TxnRef:orderId };
  }
}

export const CreateOrder = async (req, res) => {
  const responseType = {};
  const input = req.body;
  try {
    let url, vnp_TxnRef; 
    if (parseInt(input.PaymentMethod) === 0) {
      const resp = await createPaymentBank(req, input.TotalPrice);
      url = resp?.vnpUrl;
      vnp_TxnRef = resp?.vnp_TxnRef;
    }

    const products = input.ProductList?.map((item) => (
      {
        ProductId: item._id,
        ProductName: item.Name,
        Price: parseInt(item.Price),
        Quantity: item.Quantity,
        Image: item.Image,
      }));

    const newOrder = new Order({
      Products: products,
      UserId: input.UserId,
      PaymentMethod: input.PaymentMethod,
      StatusPayment: input.StatusPayment,
      Address: input.Address,
      NameReceiver: input.NameReceiver,
      Phone: input.Phone,
      Vnp_TxnRef: vnp_TxnRef ?  vnp_TxnRef : "",
      TotalPrice: input.TotalPrice,
    });
    const savedOrder = await newOrder.save();
    responseType.message = 'Create Order successfully';
    responseType.status = 200;
    responseType.value = savedOrder;
    responseType.url = url;
  } catch (error) {
    responseType.status = 404;
    responseType.message = 'Create Order failed';
    responseType.error = error.message;
  }
  res.json(responseType);
};


export const GetAllOrdersByUserId = async (req, res) => {
  const responseType = {};
  // check input
  try {
    const data = await Order.find();
    responseType.message = "Get successfully";
    responseType.status = 200;
    responseType.value = data;
  } catch (err) {
    responseType.statusText = "Error";
    responseType.message = "Get Failed ";
    responseType.status = 404;
  }
  res.json(responseType);
};


export const GetAllOrders = async (req, res) => {
  const responseType = {};
  // check input
  try {
    const data = await Order.find().sort({ createdAt: -1 });
    responseType.message = "Get successfully";
    responseType.status = 200;
    responseType.value = data;
  } catch (err) {
    responseType.statusText = "Error";
    responseType.message = "Get Failed ";
    responseType.status = 404;
  }
  res.json(responseType);
};

export const GetOrderById = async (req, res) => {
  const responseType = {};
  try {
    const { id } = req.params;
    const orders = await Order.find({ UserId: id }).sort({ createdAt: -1 });
    responseType.message = "Get successfully";
    responseType.status = 200;
    responseType.value = orders;
  } catch (err) {
    responseType.statusText = "Error";
    responseType.message = "Get Failed ";
    responseType.status = 404;
  }
  res.json(responseType);
};


const createReceiptFromOrder = async (order, staffName) => {
  try {
    // Kiểm tra xem order có sản phẩm hay không
    if (!order.Products || order.Products.length === 0) {
      throw new Error("Order has no products");
    }

    // Tính tổng giá trị của đơn đặt hàng
    const totalPrice = order.Products.reduce(
      (acc, product) => acc + product.Price * product.Quantity,
      0
    );

    // Tạo hóa đơn mới từ thông tin của order
    const newReceipt = new Receipts({
      Staff_Name: staffName ?? '', // Thay bằng tên nhân viên thực tế
      Name_Customer: order.Name_Customer,
      Email: order.Email,
      Telephone: order.Telephone,
      Services: order.Products.map((product) => product.ProductName),
      SumPrice: totalPrice,
      Discount: 0, // Bạn có thể tính giảm giá dựa trên logic của mình
      Total: totalPrice,
    });

    // Lưu hóa đơn mới vào cơ sở dữ liệu
    const savedReceipt = await newReceipt.save();
    return savedReceipt;
  } catch (error) {
    console.error("Error creating receipt:", error);
    throw error;
  }
};

export const updateOrderStatusPayment = async (req, res) => {
  const responseType = {};
  try {
    const id = req.params.id;
    const { statusPayment, staffName ,Type} = req.body;
    // Cập nhật trạng thái thanh toán của đơn đặt hàng
    let updatedOrder; 
    if ( parseInt(Type) === 1) {
      updatedOrder = await Order.findOneAndUpdate(
        { Vnp_TxnRef: id },
        { $set: { StatusPayment: statusPayment } },
        { new: true }
      );
    } else {
      updatedOrder = await Order.findByIdAndUpdate(
        id,
        { $set: { StatusPayment: statusPayment } },
        { new: true }
      );
    }
   
    // Nếu trạng thái thanh toán được cập nhật thành công, tạo hóa đơn mới
    if (statusPayment === 1) {
      const newReceipt = await createReceiptFromOrder(updatedOrder, staffName);
    }
    responseType.message = "Update StatusPayment successfully";
    responseType.status = 200;
    responseType.value = updatedOrder;
  } catch (err) {
    responseType.message = "Update StatusPayment failed";
    responseType.status = 500;
  }
  res.json(responseType);
};