import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopHeader from "../components/global/TopHeader";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Checkbox } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { calculateOrderTotal, createOneTimePayment, createRecurringTimePayment, setCouponCode, setDiscountedData } from "../features/subscriptionSlice";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const SubscriptionPlanDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subscribeData, discoundedData, couponCode, isLoading } = useSelector((state) => state.subscription);
  const [loading, setLoading] = useState(false);
  const [recurringPayments, setRecurringPayments] = useState(true);


  // console.log(subscribeData, "subscribeData");
  // console.log(discoundedData, "discoundedData");
  // console.log(couponCode, "couponCode");

  useEffect(() => {
    if (discoundedData === null) {
      navigate('/dashboard/subscription-plan');
    }
  }, [discoundedData])

  const onCouponCodeSubmit = async (e) => {
    e.preventDefault()
    await dispatch(setCouponCode(couponCode));
    const subscriptionDuration = "monthly";
    const newItem = {
      ...subscribeData,
      subscriptionDuration
    }
    const response = await dispatch(calculateOrderTotal(newItem));
    if (response.payload.status === "success") {
      await dispatch(setDiscountedData(response?.payload));
    }
  }


  // loadScript 
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }


  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const { plans = [] } = subscribeData || {};

    const recurringMonthlydata = {
      subscription_type_id: plans[1]?.subscriptionTypeId || null,
      subscription_duration: plans[1]?.durations?.[0] || null,
      plan_id: plans[1]?.id || null
    };

    const onetimePaymentData = {
      subscriptionDuration: "monthly",
      couponCode: couponCode,
      subscriptionTypeId: Number(subscribeData?.subscriptionTypeId)
    }

    // Declare result variable
    let result;

    // Determine whether to create a one-time payment or recurring payment
    if (recurringPayments) {
      result = await dispatch(createRecurringTimePayment(recurringMonthlydata));
    } else {
      result = await dispatch(createOneTimePayment(onetimePaymentData));
    }

    console.log(result, "result");

    let options;
    console.log(options, "options top");

    if (recurringPayments) {
      // subscription payment case 
      const {
        id: subscriptionId,
        short_url
      } = result.payload;

      options = {
        key: "rzp_test_2M5D9mQwHZp8iP",
        subscription_id: subscriptionId,
        amount: '1000',
        currency: "INR",
        name: "Caterings And Tiffins",
        description: "Subscription Payment",
        // order_id: subscriptionId, // Using subscription ID for the order_id
        handler: async function (response) {
          console.log(response, "response response");
          const data = {
            subscriptionId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };
          await dispatch(setCouponCode(""));
          // Handle the post-payment logic for subscription
        },
        prefill: {
          name: "Caterings And Tiffins",
          email: "cateringsandtiffin@example.com",
          contact: "9879879879",
        },
        notes: {
          address: "Caterings And Tiffins Corporate Office",
          subscriptionId: subscriptionId,
          short_url: short_url
        },
        options: {
          label: "Pay Now"
        },
        theme: {
          color: "#a81e1e",
        },
      };
    } else {
      // One-time payment case
      const { amount, id, currency } = result?.payload?.data?.order;
      options = {
        key: "rzp_test_2M5D9mQwHZp8iP",
        amount: amount.toString(),
        currency: currency,
        name: "Caterings And Tiffins",
        description: "Test Transaction",
        // image: { logo },
        order_id: id,
        handler: async function (response) {
          console.log(response, "response response");
          const data = {
            orderCreationId: id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };
          // console.log(data);
          await dispatch(setCouponCode(""));
        },
        prefill: {
          name: "Caterings And Tiffins",
          email: "cateringsandtiffin@example.com",
          contact: "9879879879",
        },
        notes: {
          address: "Caterings And Tiffins Corporate Office",
        },
        theme: {
          color: "#a81e1e",
        },
      };
    }
    // console.log(options, "options");
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }




  return (
    <>
      <TopHeader
        title="Subscription Profile Details"
        description="Below is a Subscription Profile Details"
      />

      <Container maxWidth="lg">
        <div className="card-box-shadow px-5 py-4 mb-4">
          <p className="sub-plan-title text-center">SELECTED SUBSCRIPTION PLAN</p>
          {/* <p className="branches-desc text-center">
          Choose your subscription types
        </p> */}

          <Grid container spacing={2} sx={{ display: 'flex', justifyContent: "center" }}>
            <Grid item xs={12} sm={8} md={6} lg={5} xl={5} className='mb-3 mt-5' style={{ display: 'flex', justifyContent: 'center', padding: '0px 5px' }}>
              <Stack className="subscription-plans-shadow" sx={{ display: 'flex', justifyContent: "center" }}>
                <div className="sub-box-violet">
                  <div className={`sub-box-violet-title popular-color`}>
                    <h3 className="sub-box-name"> {discoundedData?.subPlan} Caterer</h3>
                  </div>
                  <div className="sub-body px-2 pt-2">
                    <div className="sub-price mb-3">
                      <h3 className="text-center"> {discoundedData?.subAmount} / <sub className="sub-plan-month">month</sub></h3>
                    </div>
                    {/* <p className="sub-plan-brand mb-3 mt-3">List as {subscribeData?.subscriptionType} Caterer</p> */}

                    <div className="mb-3 mt-3">
                      <p className="sub-plan-para mb-3 mt-3">Coupon Details:</p>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className="mb-3 mt-3">
                        <p>code:</p> <p> {discoundedData?.couponDetails?.code ? discoundedData?.couponDetails?.code : 'N/A'}</p>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className="mb-3 mt-3">
                        <p>Discount Percent:</p> <p> {discoundedData?.couponDetails?.discountPercent ? discoundedData?.couponDetails?.discountPercent : 'N/A'}</p>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className="mb-3 mt-3">
                        <p>Discount Price:</p> <p> {discoundedData?.couponDetails?.discountPrice ? discoundedData?.couponDetails?.discountPrice : 'N/A'}</p>
                      </Stack>

                      <hr />

                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className="mb-3 mt-3">
                        <p>Status:</p> <p> {discoundedData?.status ? discoundedData?.status : 'N/A'}</p>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className="mb-3 mt-3">
                        <p>Coupon Code:</p> <p className="text-success"> {discoundedData?.couponCode ? discoundedData?.couponCode : 'N/A'}</p>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className="mb-3 mt-3">
                        <p>Discount Amount:</p> <p> {discoundedData?.discountAmount ? discoundedData?.discountAmount : 'N/A'}</p>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className="mb-3 mt-3">
                        <p>Expiry Date:</p> <p> {discoundedData?.expiryDate ? discoundedData?.expiryDate : 'N/A'}</p>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className="mb-3 mt-3">
                        <p>StartDate:</p> <p> {discoundedData?.startDate ? discoundedData?.startDate.slice(0, 10) : 'N/A'}</p>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className="mb-3 mt-3">
                        <p>Sub Amount:</p> <p> {discoundedData?.subAmount ? discoundedData?.subAmount : 'N/A'}</p>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className="mb-3 mt-3">
                        <p>Payment Terms:</p> <p> {discoundedData?.paymentTerms ? discoundedData?.paymentTerms : 'N/A'}</p>
                      </Stack>
                      <hr />
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className="mb-3 mt-3">
                        <p>Final Amount:</p> <p style={{ display: 'flex', alignItems: 'center' }}> {discoundedData?.finalAmount ? <>
                          <CurrencyRupeeIcon className="text-success" style={{ fontSize: '16px' }} /> {discoundedData?.finalAmount}
                        </> : 'N/A'}</p>
                      </Stack>
                      {/* <hr /> */}
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="coupon-flex">
                    <span className='coupon-text'>
                      {recurringPayments ? 'Subscription Activated' : 'Subscription DeActivated'}
                    </span>
                    <Checkbox size="small" {...label}
                      checked={recurringPayments}
                      onChange={(e) => setRecurringPayments(e.target.checked)} />
                  </div>

                  <form className="search-wrapper cf" onSubmit={onCouponCodeSubmit}>
                    <input name="couponCode" value={couponCode} onChange={(e) => dispatch(setCouponCode(e.target.value))}
                      type="text" placeholder="Enter Coupon Code" required style={{ boxShadow: 'none' }} />
                    <button type="submit">Apply</button>
                  </form>
                  <p className={`mb-4 ms-2 mt-2 ${discoundedData?.couponStatus === 'Applied' ? 'text-success' : 'text-danger'} `}>{discoundedData?.couponStatus ? `Coupon ${discoundedData?.couponStatus}` : null}</p>

                  <Button disabled={isLoading} variant="contained" className={`sub-plan-btn mx-auto taxt-center `}
                    onClick={() => displayRazorpay()}
                  > {isLoading ? 'Loading...' : 'Make Payment'} </Button>
                  <br />
                </div>
              </Stack>
            </Grid>
          </Grid>

        </div>
      </Container>
    </>
  )
}

export default SubscriptionPlanDetails