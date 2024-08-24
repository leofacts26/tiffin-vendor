import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { datavalidationerror } from '../utils';
import { api, BASE_URL } from '../api/apiConfig';
import toast from 'react-hot-toast';

const initialState = {
  isLoading: false,
  activeSubscriptionList: null,
}


// fetchActiveSubscription  
export const fetchActiveSubscription = createAsyncThunk(
  "homepage/fetchActiveSubscription",
  async (user, thunkAPI) => {
    const { vendor_id } = thunkAPI.getState().user.vendorId;
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




export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {

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
  },
})

export const { } = subscriptionSlice.actions;
export default subscriptionSlice.reducer