import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminApi from "../api/adminAPI";
import { jwtDecode } from "jwt-decode";
const initialState = {
  adminInfo: null,
  loading: false,
  success: false,
  successNotify: "",
  error: false,
};

export const setAdminInfo = createAsyncThunk(
  "admin/info",
  async (adminID) => {
    const token = window.localStorage.getItem("Admin_token");
    console.log(adminID);
    console.log("token in setAdminInfo: " + token);
    const response = await adminApi.findAdmin(adminID, token);
    return response;
  }
);

export const loginAdmin = createAsyncThunk(
  "admin/login",
  async (credentials) => {
    const token = await adminApi.loginAdmin(credentials);
    console.log(token);
    window.localStorage.setItem("admin_token", token);
    console.log("admin id: " + jwtDecode(token).sub);
    return jwtDecode(token).sub;
  }
);

export const registerAdmin = createAsyncThunk(
  "admin/register",
  async (userData) => {
    console.log(userData);
    const response = await adminApi.registerAdmin(userData);
    console.log("res" + response);
    return response;
  }
);

export const updateAdmin = createAsyncThunk(
  "admin/update",
  async ({ adminId, data }) => {
    console.log(adminId);
    console.log(data);
    const response = await adminApi.updateAdmin(adminId, data);
    return response;
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    logOutAdmin: (state) => {
      state.adminInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setAdminInfo.pending, (state) => {
        state.success = false;
        state.loading = true;
        state.error = false;
      })
      .addCase(setAdminInfo.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.error;
      })
      .addCase(setAdminInfo.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.adminInfo = action.payload;
        state.error = false;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.success = false;
        state.loading = true;
        state.error = false;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.error;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.adminInfo = action.payload;
        state.successNotify = 'Log in successfully! Welcome back';
        state.error = false;
      })
      .addCase(registerAdmin.pending, (state) => {
        state.success = false;
        state.loading = true;
        state.error = false;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.error;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.adminInfo = action.payload;
        state.error = false;
      });
  },
});

export const { setLoading, setError, setSuccess, logOutAdmin } = adminSlice.actions;

export const selectLoading = (state) => state.admin.loading;
export const selectError = (state) => state.admin.error;
export const selectSuccess = (state) => state.admin.success;
export const selectAdminDetail = (state) => state.admin.adminInfo; // "AdminInfo" corrected to "adminInfo"
export const selectSuccessNotify = (state) => state.admin.successNotify; // Corrected case of "Admin"
export default adminSlice.reducer;
