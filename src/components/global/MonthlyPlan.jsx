import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { calculateOrderTotal, fetchSubscriptionTypes, setDiscountedData, setSubscribeData } from "../../features/subscriptionSlice";
import { useEffect } from "react";
import LoadingAnimation from '../LoadingAnimation';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";


const MonthlyPlan = () => {
  const navigate = useNavigate();
  const { subscriptionData, isLoading } = useSelector((state) => state.subscription);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSubscriptionTypes());
  }, []);

  // console.log(subscriptionData, "subscriptionData");

  const onHandleSubscribe = async (item) => {
    await dispatch(setSubscribeData(item))
    const subscriptionDuration = "monthly";
    const newItem = {
      ...item,
      subscriptionDuration
    }
    const response = await dispatch(calculateOrderTotal(newItem));
    if (response?.payload?.status === "success") {
      await dispatch(setDiscountedData(response?.payload))
      navigate('/dashboard/subscription-plan-details');
    }
  }


  if (isLoading) {
    return <LoadingAnimation center />
  }

  return (
    <Grid container spacing={2}>
      {subscriptionData?.length > 0 && subscriptionData?.map((item, index) => {
        let color = '';
        if (item?.subscriptionType === 'normal') {
          color = 'normal-color'
        } else if (item?.subscriptionType === 'popular') {
          color = 'popular-color'
        } else if (item?.subscriptionType === 'branded') {
          color = 'branded-color'
        }
        return (
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className='mb-3' style={{ display: 'flex', justifyContent: 'center', padding: '0px 5px' }} key={index}>
            <Stack className="subscription-plans-shadow" justifyContent="space-between">
              <div className="sub-box-violet">
                <div className={`sub-box-violet-title ${color}`}>
                  <h3 className="sub-box-name"> {item?.subscriptionType} Caterer</h3>
                </div>
                <div className="sub-body px-2 pt-2">
                  <div className="sub-price">
                    <h3 className="text-center"> {`₹ ${item?.monthlyCharges}`} / <sub className="sub-plan-month">month</sub></h3>
                  </div>
                  <p className="sub-plan-brand mb-3 mt-3">List as {item?.subscriptionType} Caterer</p>
                  <p className="sub-plan-para">Benifits:</p>
                  {item?.benefits.map((benefit, index) => (
                    <p className="sub-plan-para" key={index}>- {benefit}</p>
                  ))}
                  <br />
                </div>
              </div>
              <div className="">


                <Link to="javascript:void(0)" className="text-decoration-none mt-3">
                  <Button variant="contained" className={`sub-plan-btn mx-auto taxt-center ${color}`}
                    onClick={() => onHandleSubscribe(item)}
                  > Subscribe Now </Button>
                </Link>
                <br />
              </div>
            </Stack>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default MonthlyPlan