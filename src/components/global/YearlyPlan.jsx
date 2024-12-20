import * as React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { calculateOrderTotal, fetchSubscriptionTypes, setDiscountedData, setSubscribeData } from '../../features/subscriptionSlice';
import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../LoadingAnimation';


const YearlyPlan = () => {
    const navigate = useNavigate();
    const { subscriptionData, isLoading } = useSelector((state) => state.subscription);
    const dispatch = useDispatch();

    console.log(subscriptionData, "subscriptionDatasubscriptionData");


    useEffect(() => {
        dispatch(fetchSubscriptionTypes());
    }, []);

    // onHandleSubscribe 
    const onHandleSubscribe = async (item) => {
        await dispatch(setSubscribeData(item))
        const subscriptionDuration = "yearly";
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
        <>
            {subscriptionData?.filter(item => item.plans?.length > 0).length > 0 ? (
                <Grid container spacing={2}>
                    {subscriptionData
                        .filter(item => item.plans?.length > 0) // Filter subscriptions with plans
                        .map((item, index) => {
                            let color = '';
                            const subscriptionType = item?.subscriptionType?.toLowerCase();
    
                            if (subscriptionType === 'normal') {
                                color = 'normal-color';
                            } else if (subscriptionType === 'popular') {
                                color = 'popular-color';
                            } else if (subscriptionType === 'branded') {
                                color = 'branded-color';
                            }
    
                            return (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={4}
                                    xl={4}
                                    className="mb-3"
                                    style={{ display: 'flex', justifyContent: 'center', padding: '0px 15px' }}
                                    key={index}
                                >
                                    <Stack className="subscription-plans-shadow" justifyContent="space-between">
                                        <div className="sub-box-violet">
                                            <div
                                                className={`sub-box-violet-title`}
                                                style={{ backgroundColor: `${item.subscriptionTypeDisplayColor}` }}
                                            >
                                                <h3 className="sub-box-name">
                                                    <span style={{ textTransform: 'capitalize' }}>
                                                        {item?.subscriptionType}
                                                    </span>{' '}
                                                    Tiffin
                                                </h3>
                                            </div>
                                            <div className="sub-body px-2 pt-2">
                                                <div className="sub-price">
                                                    <h3 className="text-center">
                                                        {`₹ ${item?.yearlyCharges}`} /{' '}
                                                        <sub className="sub-plan-month">Yearly</sub>
                                                    </h3>
                                                </div>
                                                <p className="sub-plan-brand mb-3 mt-3">
                                                    List as {item?.subscriptionType} Tiffin
                                                </p>
                                                <p className="sub-plan-para">Benefits:</p>
                                                {item?.benefits &&
                                                    Object.entries(item.benefits).map(([key, benefit], index) => (
                                                        <p className="sub-plan-para" key={key}>
                                                            - {benefit}
                                                        </p>
                                                    ))}
                                                <br />
                                            </div>
                                        </div>
                                        <div>
                                            <Link to="javascript:void(0)" className="text-decoration-none mt-3">
                                                <Button
                                                    variant="contained"
                                                    className={`sub-plan-btn mx-auto taxt-center`}
                                                    style={{ backgroundColor: `${item.subscriptionTypeDisplayColor}` }}
                                                    onClick={() => onHandleSubscribe(item)}
                                                >
                                                    Subscribe Now
                                                </Button>
                                            </Link>
                                            <br />
                                        </div>
                                    </Stack>
                                </Grid>
                            );
                        })}
                </Grid>
            ) : (
                <p>No yearly subscription plans available at the moment.</p>
            )}
        </>
    );
    
}

export default YearlyPlan