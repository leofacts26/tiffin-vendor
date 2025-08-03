import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { datavalidationerror, successToast } from '../utils';
import { api, BASE_URL } from '../api/apiConfig';
import toast from 'react-hot-toast';

const initialState = {
  isLoading: false,
  activeSubscriptionList: null,
  subscriptionData: [],
  discoundedData: null,
  subscribeData: null,
  couponCode: '',
  calculaterOrderData: {},
  cancelSubData: {},
  listVendorQuickCreateData: []
}


// fetchSubscriptionTypes 
export const fetchSubscriptionTypes = createAsyncThunk(
  "homepage/fetchSubscriptionTypes",
  async (user, thunkAPI) => {
    try {
      const response = await api.get(
        `${BASE_URL}/rz-get-razorpay-plans?vendor_type=Tiffin`,
        {
          headers: {
            authorization: `Bearer ${thunkAPI.getState()?.user?.accessToken}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);


// fetchActiveSubscription  
export const fetchActiveSubscription = createAsyncThunk(
  "homepage/fetchActiveSubscription",
  async (user, thunkAPI) => {
    const { vendor_id } = thunkAPI.getState().user.vendorId;
    // console.log(vendor_id, "vendor_id GTT");
    try {
      const response = await api.get(
        `${BASE_URL}/rz-get-current-active-and-queued-subscriptions?vendorId=${vendor_id}`,
        {
          headers: {
            authorization: `Bearer ${thunkAPI.getState()?.user?.accessToken}`,
          },
        }
      );
      return response?.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

// calculateOrderTotal 
export const calculateOrderTotal = createAsyncThunk(
  "homepage/calculateOrderTotal",
  async (data, thunkAPI) => {
    const { couponCode } = thunkAPI.getState().subscription;
    const { subscriptionTypeId, subscriptionDuration } = data;
    const updatedData = {
      subscriptionTypeId,
      subscriptionDuration,
      couponCode
    }
    try {
      const response = await api.post(`/rz-calculate-order-total`, updatedData, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState()?.user?.accessToken}`,
        },
      });
      // console.log(response, "response SLice");
      toast.success(response.data.status, { duration: 5000 })
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(datavalidationerror(error), { duration: 5000 })
    }
  }
);

export const createOneTimePayment = createAsyncThunk(
  "homepage/createOneTimePayment",
  async (data, thunkAPI) => {
    const couponCode  = thunkAPI.getState().subscription.couponCode;
    const { subscriptionTypeId } = thunkAPI.getState().subscription.subscribeData;

    const id = Number(subscriptionTypeId)
    const subscriptionDuration = data?.subType;
    const updatedData = {
      subscriptionTypeId: id,
      subscriptionDuration,
      couponCode: couponCode
    }
    try {
      const response = await api.post(`/rz-create-one-time-payment`, updatedData, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState()?.user?.accessToken}`,
        },
      });
      toast.success(`${response.data.status ? response.data.status : response.data.couponCode !== null && 'Coupon Code Applied'} `, { duration: 5000 })
      // console.log(response, "responseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponse");
      return response;
    } catch (error) {
      console.log(error);
      toast.error(datavalidationerror(error), { duration: 5000 })
    }
  }
);


export const cancelRecurringTimePayment = createAsyncThunk(
  "homepage/cancelRecurringTimePayment",
  async (data, thunkAPI) => {
    console.log("Payload to API:", data);
    try {
      const response = await api.post(`/vendor-rz-cancel-subscription`, data, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState()?.user?.accessToken}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error creating subscription:", error.response?.data || error.message);

      // Improved error message
      toast.error(error.response?.data?.message || "Failed to create subscription");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);


export const createRecurringTimePayment = createAsyncThunk(
  "homepage/createRecurringTimePayment",
  async (data, thunkAPI) => {
    try {
      const response = await api.post(`/rz-create-subscription`, data, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState()?.user?.accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating subscription:", error.response?.data || error.message);
      // Improved error message
      toast.error(error.response?.data?.message || "Failed to create subscription");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);


export const cancelRecurringPayment = createAsyncThunk(
  "homepage/cancelRecurringPayment",
  async (data, thunkAPI) => {
    console.log(data, "Sub data slice");
    try {
      const response = await api.post(`/rz-cancel-local-recurring-payment`, data, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState()?.user?.accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating cancel subscription:", error.response?.data || error.message);
      // Improved error message
      toast.error(error.response?.data?.message || "Failed to create subscription");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const cancelOneTimePayment = createAsyncThunk(
  "homepage/cancelOneTimePayment",
  async (data, thunkAPI) => {
    console.log(data, "Sub data slice");
    try {
      const response = await api.post(`/rz-cancel-local-one-time-payment`, data, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState()?.user?.accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating Cancel onetime:", error.response?.data || error.message);
      // Improved error message
      toast.error(error.response?.data?.message || "Failed to create onetime");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const createQuickOneTimePayment = createAsyncThunk(
  "homepage/createQuickOneTimePayment",
  async (data, thunkAPI) => {
    const couponCode = thunkAPI.getState().subscription.couponCode;
    // const { subscriptionTypeId } = thunkAPI.getState().subscription.subscribeData;

    const id = Number(data.subscription_type_id)
    const subscriptionDuration = data?.subType;
    const updatedData = {
      quickLinkId: data.id,
      subscriptionTypeId: id,
      subscriptionDuration,
      couponCode: data.couponCode
    }
    // console.log(updatedData, "updatedDataupdatedDataupdatedData"); 

    try {
      const response = await api.post(`/rz-create-one-time-payment`, updatedData, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState()?.user?.accessToken}`,
        },
      });
      toast.success(`${response.data.status ? response.data.status : response.data.couponCode !== null && 'Coupon Code Applied'} `, { duration: 5000 })
      // console.log(response, "responseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponse");
      return response;
    } catch (error) {
      console.log(error);
      toast.error(datavalidationerror(error), { duration: 5000 })
    }
  }
);


export const listVendorQuickCreate = createAsyncThunk(
  "homepage/listVendorQuickCreate",
  async (data, thunkAPI) => {
    try {
      const response = await api.get(
        `${BASE_URL}/list-vendor-quick-create`,
        {
          headers: {
            authorization: `Bearer ${thunkAPI.getState()?.user?.accessToken}`,
          },
        }
      );
      return response?.data.data[0];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);


export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setCouponCode: (state, action) => {
      state.couponCode = action.payload;
    },
    setSubscribeData: (state, action) => {
      state.subscribeData = action.payload;
    },
    setDiscountedData: (state, action) => {
      state.discoundedData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchActiveSubscription 
      .addCase(fetchActiveSubscription.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActiveSubscription.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.activeSubscriptionList = payload;
      })
      .addCase(fetchActiveSubscription.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
      // fetchSubscriptionTypes
      .addCase(fetchSubscriptionTypes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubscriptionTypes.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.subscriptionData = payload;
      })
      .addCase(fetchSubscriptionTypes.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload), { duration: 5000 });
      })
      // createOneTimePayment 
      .addCase(createOneTimePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOneTimePayment.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        toast.success(successToast(payload), { duration: 5000 });
      })
      .addCase(createOneTimePayment.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload), { duration: 5000 });
      })
      // calculateOrderTotal 
      .addCase(calculateOrderTotal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(calculateOrderTotal.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.calculaterOrderData = payload;
      })
      .addCase(calculateOrderTotal.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload));
      })
       // listVendorQuickCreate 
       .addCase(listVendorQuickCreate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(listVendorQuickCreate.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.listVendorQuickCreateData = payload;
      })
      .addCase(listVendorQuickCreate.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload), { duration: 5000 });
      })
      // createRecurringTimePayment 
      .addCase(createRecurringTimePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRecurringTimePayment.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        toast.success(successToast(payload), { duration: 5000 });
      })
      .addCase(createRecurringTimePayment.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload), { duration: 5000 });
      })
      // cancelRecurringTimePayment 
      .addCase(cancelRecurringTimePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelRecurringTimePayment.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.cancelSubData = payload;
      })
      .addCase(cancelRecurringTimePayment.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(datavalidationerror(payload), { duration: 5000 });
      });
  },
})

export const { setSubscribeData, setDiscountedData, setCouponCode } = subscriptionSlice.actions;
export default subscriptionSlice.reducer