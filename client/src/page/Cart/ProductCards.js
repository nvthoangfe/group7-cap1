import React from "react";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBRow,
    MDBTypography,
} from "mdb-react-ui-kit";
import './Cart.css'
import { Button, FormControl, FormControlLabel, FormLabel, Input, Radio, RadioGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { decreaseQuantity, increaseQuantity, removeAllProductFromCart, removeFromCart } from "../../redux/action";
import { convertStringToNumber } from "../../utils/Utils";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Col, InputNumber, Row, Select } from "antd";
function Product({ product }) {
    const [TotalPrice, setTotalPrice] = useState()
    const dispatch = useDispatch();
    useEffect(() => {
        let newPrice = product?.Quantity > 1 ? parseInt(product?.Price) * product?.Quantity : parseInt(product?.Price);
        setTotalPrice(newPrice);
    }, [product?.Quantity])

    function handleRemove() {
        dispatch(removeFromCart(product._id));
    }
    function handleAdd() {
        dispatch(increaseQuantity(product._id));
    }
    function handleMinus() {
        dispatch(decreaseQuantity(product._id));
    }
    return (
        <MDBCard className="product">
            <MDBCardBody style={{ padding: 20 }}>
                <MDBRow className="container-row">
                    <MDBCol md="2" lg="2" xl="2">
                        <MDBCardImage className="row-image" fluid
                            src={product?.Image}
                            alt="Cotton T-shirt" />
                    </MDBCol>
                    <MDBCol md="3" lg="3" xl="3">
                        <p className="row-title">{product?.Name}</p>
                    </MDBCol>
                    <MDBCol md="3" lg="3" xl="2"
                        className="row-action">
                        <Button color='success' onClick={handleMinus}>  <MDBIcon fas icon="minus" /></Button>
                        <Input min={0} defaultValue={1} sx={{ width: 30, textAlign: 'right' }} value={product?.Quantity} type="number" size="sm" />
                        <Button color='success' onClick={handleAdd}> <MDBIcon fas icon="plus" /></Button>
                    </MDBCol>
                    <MDBCol md="3" lg="2" xl="2" className="offset-lg-1">
                        <MDBTypography tag="h5" className="mb-0">
                            {convertStringToNumber(TotalPrice)}
                        </MDBTypography>
                    </MDBCol>
                    <MDBCol md="1" lg="1" xl="1" className="text-end">
                        <Button onClick={handleRemove} className="text-danger">
                            <MDBIcon fas icon="trash text-danger" size="lg" />
                        </Button>
                    </MDBCol>
                </MDBRow>
            </MDBCardBody>
        </MDBCard>
    )
}
export default function ProductCards() {
    const { user } = useContext(AuthContext);
    const cartList = useSelector((state) => state?.cart?.cartItems);
    const [TotalPrice, setTotalPrice] = useState()
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fetchSubmitOrder = async (data) => {
        try {
            const resp = await axios.post("http://localhost:8800/api/orders", data);
            if (parseInt(data.PaymentMethod) === 1 && resp?.data?.status === 200) {
                toast.success('Tạo đơn hàng thành công');
                dispatch(removeAllProductFromCart());
                navigate('/shop')
            }
            else if (resp.data?.url && parseInt(resp.data?.status) === 200) {
                window.location.href = resp.data.url
                dispatch(removeAllProductFromCart());
                setLoading(false);
                navigate('/shop')
            }
            else {
                setLoading(false);
                toast.error('Hệ thống lỗi');
            }
        } catch (error) {
            setLoading(false);
            console.error("Error submitting order:", error);
        }
    };

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const [step, setStep] = useState(1);
    function handleAddAddress() {
        setStep(2);

    }
    const isValidPhoneNumber = (phoneNumber) => {
        // Define a regular expression for the desired phone number format
        const phoneRegex = /^[0-9]{10,}$/; // Assuming a simple format of at least 10 digits
        
        // Test the phone number against the regular expression
        return phoneRegex.test(phoneNumber);
    };
    function validateSubmit(data) {
        if (data?.ProductList.length === 0 ) {
            toast.error('Không có sản phẩm nào để thanh toán')
            setLoading(false);
            return false;
        }
        if ( !data?.NameReceiver || data?.NameReceiver === '' ) {
            toast.error('Vui lòng điền tên người nhận')
            setLoading(false);
            return false;
        }
        if ( !data?.Phone || data?.Phone === '' || !isValidPhoneNumber(data.Phone)  ) {
            toast.error('Vui lòng điền só điện thoại người nhận')
            setLoading(false);
            return false;
        }
        if ( !profile?.province ) {
            toast.error('Vui lòng điền tỉnh/thành phố')
            setLoading(false);
            return false;
        }
        if ( !profile?.district ) {
            toast.error('Vui lòng điền quận/huyện')
            setLoading(false);
            return false;
        }
        if ( !profile?.ward ) {
            toast.error('Vui lòng điền phường/xã')
            setLoading(false);
            return false;
        }
        if ( !profile.address ) {
            toast.error('Vui lòng điền địa chỉ đường')
            setLoading(false);
            return false;
        }
        return true
    }
    
    function handleSubmit() {
        setLoading(true);
        const provincesName = provinces?.find(item => item.value === parseInt(profile?.province))?.label
        const districtName = districts?.find(item => item.value === parseInt(profile?.district))?.label
        const wardName = wards?.find(item => item.value === parseInt(profile?.ward))?.label
        const Address = `${profile.address}, ${wardName}, ${districtName}, ${provincesName},`
        const data = {
            ProductList: cartList,
            UserId: user?._id,
            PaymentMethod: paymentMethod ?? 0,
            StatusPayment: 0,
            TotalPrice: TotalPrice,
            Address: Address,
            NameReceiver: profile?.nameReceiver,
            Phone: profile?.phone
        }
        if (validateSubmit(data)) {
            fetchSubmitOrder(data)
        }
    }
    useEffect(() => {
        let TotalPrice = 0;
        cartList?.forEach((item) => {
            const productPrice = parseInt(item.Price) * item?.Quantity;
            TotalPrice += productPrice;
        })
        setTotalPrice((TotalPrice));
    }, [cartList])

    const [profile, setProfile] = useState([]);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState();
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [SelectedWard, setSelectedWard] = useState("");

    useEffect(() => {
        if (profile?.ward) {
            setSelectedProvince(profile.province);
            setSelectedDistrict(profile.district);
            setSelectedWard(profile.ward);
        }

    }, [profile?.ward])

    // Gọi API để lấy danh sách tỉnh
    useEffect(() => {
        axios
            .get("https://provinces.open-api.vn/api/p/")
            .then((response) => {
                const newList = response?.data?.map((item) => ({
                    label: item.name,
                    value: item.code,
                }))
                setProvinces(newList);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


    // Gọi API để lấy danh sách quận dựa trên tỉnh đã chọn
    useEffect(() => {
        if (selectedProvince) {
            axios
                .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then((response) => {
                    const newList = response?.data?.districts.map((item) => ({
                        label: item.name,
                        value: item.code,
                    }))
                    setDistricts(newList);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            setDistricts([]);
        }
    }, [selectedProvince]);
    // Gọi API để lấy danh sách huyện dựa trên quận đã chọn
    useEffect(() => {
        if (selectedDistrict) {
            axios
                .get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then((response) => {
                    const newList = response?.data?.wards.map((item) => ({
                        label: item.name,
                        value: item.code,
                    }))
                    setWards(newList);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);


    const onChangeCityHandler = (value) => {
        setSelectedProvince(value);
        setProfile((prevState) => {
            return {
                ...prevState,
                districts: null,
                province: value,
            };
        });
    };
    const onChangeInput = (name, value) => {
        setProfile((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };


    const onChangeDistricts = (value) => {
        setSelectedDistrict(value);
        setWards([]);
        setProfile((prevState) => {
            return {
                ...prevState,
                district: value,
            };
        });
    };

    const onChangeWard = (value) => {
        setSelectedWard(value);
        setProfile((prevState) => {
            return {
                ...prevState,
                ward: value,
            };
        });
    };
    const inputChangeHandler = (event, name) => {
        setProfile((prevState) => {
            return {
                ...prevState,
                [name]: event.target.value,
            };
        });
    };

    return (
        <section className="h-100" style={{ backgroundColor: "#eee" }}>
            <ToastContainer />
            <MDBContainer className="container-cart">
                <MDBRow className="form-cart">
                    <div className="form-cart-left" >
                        <div className="title-cart">
                            <MDBTypography tag="h1" >
                                Giỏ hàng
                            </MDBTypography>
                        </div>
                        <div className='list-product'>
                            {cartList?.length > 0 ? cartList?.map((item, index) =>
                                <Product key={index} product={item} />
                            ) : <>
                                Không có sản phẩm trong giỏ hàng
                            </>}
                        </div>
                    </div>
                    <div className="form-cart-right">
                        <div className="title-cart">
                            <MDBTypography tag="h1" >
                                Thanh toán
                            </MDBTypography>
                        </div>
                        <div className="payment-cart">
                            {step === 1 ? (<>
                                <div className="row-payment">
                                    <MDBTypography tag="h4"  >
                                        Số sản phẩm:
                                    </MDBTypography>
                                    <MDBTypography tag="h4"  >
                                        {cartList?.length}
                                    </MDBTypography>
                                </div>
                                <div className="row-payment">
                                    <MDBTypography tag="h4"  >
                                        Tổng tiền:
                                    </MDBTypography>
                                    <MDBTypography tag="h4"  >
                                        {convertStringToNumber(TotalPrice) ?? 0}
                                    </MDBTypography>
                                </div>
                                <div className="row-payment" style={{ flexDirection: 'column' }}>
                                    <MDBTypography tag="h4"  >
                                        Phương thức thanh toán:
                                    </MDBTypography>
                                    <FormControl style={{ padding: '5px 10px' }}>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue={0}
                                            value={paymentMethod}
                                            onChange={handlePaymentChange}
                                            name="radio-buttons-group"
                                        >
                                            <FormControlLabel value={0} control={<Radio />} label="Thanh toán qua trực tuyến" />
                                            <FormControlLabel value={1} control={<Radio />} label="Thanh toán khi nhận hàng" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </>) : (<>
                                <Row className={"form_control"}>
                                    <Col span={16}>Tên người nhận *</Col>
                                    <Input
                                        onChange={(e) => onChangeInput('nameReceiver', e.target.value)}
                                        style={{ width: '100%' }}
                                        placeholder='Nhập tên người nhận'
                                    />
                                </Row>
                                <Row className={"form_control"}>
                                    <Col span={16}>Số điện thoại người nhận'*</Col>
                                    <Input
                                        onChange={(e) => onChangeInput('phone', e.target.value)}
                                        style={{ width: '100%' }}
                                        type='phone'
                                        format='number'
                                        placeholder='Nhập số điện thoại người nhận'
                                    />
                                </Row>
                                <Row className={"form_control"}>
                                    <Col span={16}>Tỉnh/Thành phố *</Col>
                                    <Select
                                        options={provinces ?? []}
                                        onChange={onChangeCityHandler}
                                        style={{ width: '100%' }}
                                        placeholder='Chọn tỉnh/thành phố'
                                        value={profile?.province}
                                    />
                                </Row>
                                <Row className={"form_control"}>
                                    <Col span={16}>Quận/Huyện *</Col>
                                    <Select
                                        style={{ width: '100%' }}
                                        options={districts ?? []}
                                        onChange={onChangeDistricts}
                                        placeholder='Chọn quận/huyện'
                                        value={profile?.district}
                                    />
                                </Row>
                                <Row className={"form_control"}>
                                    <Row span={10}>Phường/Xã *</Row>
                                    <Select
                                        options={wards ?? []}
                                        style={{ width: '100%' }}
                                        onChange={onChangeWard}
                                        value={profile?.ward}
                                        placeholder='Chọn phường/xã'
                                    />
                                </Row>

                                <Row className={"form_control"}>
                                    <Row span={10}>Địa chỉ cụ thể</Row>
                                    <Input
                                        s style={{ width: '100%' }}
                                        placeholder="Địa chỉ cụ thể"
                                        className={'input_profile'}
                                        onChange={(e) => inputChangeHandler(e, 'address')}
                                        value={profile?.address}
                                        name="address"
                                    />
                                </Row>

                                <div className="row-payment">
                                    <MDBTypography tag="h4"  >
                                        Tổng tiền:
                                    </MDBTypography>
                                    <MDBTypography tag="h4"  >
                                        {convertStringToNumber(TotalPrice) ?? 0}
                                    </MDBTypography>
                                </div>
                            </>)}


                        </div>
                        <div className="payment-btn">
                            <button disabled={loading} onClick={step === 1 ? handleAddAddress : handleSubmit} size='large'> {step === 1 ? 'Chọn địa chỉ' : 'Thanh toán'}</button>
                        </div>
                    </div>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}