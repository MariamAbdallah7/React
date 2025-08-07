// import { getNestedProperty } from '@/app/components/form-builder/helpers/functionsMap';
// import { errorToast, successToast } from "@/app/components/alert/AlertTimer";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import { closeTabHandler, transformedArchivedRequestsData, transformedData, transformedDataWithTotal, transformedRejectedRequestsData } from "../helper/main";
// import navData from "@/app/tasks/JSONS/TableNavigation.json";
// import { getNewToken } from "./authSlice";
// import { fetchHistory } from "./historySlice";
// import { ar } from 'date-fns/locale';
import { stat } from 'fs';

const apiUrl = process.env.NEXT_PUBLIC_BACK_END_API;
const BackofficeBAUrl = process.env.NEXT_PUBLIC_BACKOFFICE_BA;
const initialState: Record<any, any> = {
  tasks: [],
  subServices: [],
  serviceJson: {},
  uploadResult: [], 
    response: {},
    requests: [],

};

export const fetchServices = createAsyncThunk(
  "tasksSlice/fetchServices",
  async (lookupCode: number) => {

    try {
      // const response = await axios.get(`${apiUrl}/admin/lookups/${code && code}`, {
      const response = await axios.get(`${apiUrl}/lookups/${lookupCode}`, {
        // headers: {
        //   Authorization: `Bearer ${token.accessToken}`,
        //   "client-id": "employee"
        // },
      });
      return response.data.result;
    } catch (error: any) {
      console.log("Error fetching tasks:", error);
    }
  }
);


export const fetchSubServices = createAsyncThunk(
  "tasksSlice/fetchSubServices",
  async ({ nextLookupCode, code }: { nextLookupCode: number, code: string }) => {

    try {
      // const response = await axios.get(`${apiUrl}/admin/lookups/${code && code}`, {
      const response = await axios.get(`${apiUrl}/lookups/${nextLookupCode}/${code}`, {
        // headers: {
        //   Authorization: `Bearer ${token.accessToken}`,
        //   "client-id": "employee"
        // },
      });
      return response.data.result;
    } catch (error: any) {
      console.log("Error fetching tasks:", error);
    }
  }
);




export const fetchServiceJson = createAsyncThunk(
  "tasksSlice/fetchServiceJson",
  async ({ code, stepId }: { code: string, stepId: number }) => {

    try {
      // const response = await axios.get(`${apiUrl}/admin/lookups/${code && code}`, {
      const response = await axios.get(`${apiUrl}/jsons/${code}/0-0`, {
        // headers: {
        //   Authorization: `Bearer ${token.accessToken}`,
        //   "client-id": "employee"
        // },
      });
      return response.data;
    } catch (error: any) {
      console.log("Error fetching tasks:", error);
    }
  }
);

export const uploadFile = createAsyncThunk(
  "tasksSlice/uploadFile",
  async ({ attachmentName, attachmentValue }: { attachmentName: string; attachmentValue: string }) => {
    try {
      const response = await axios.post(`${apiUrl}/upload`, {
        attachmentName,
        attachmentValue,
      });
      return response.data;
    } catch (error: any) {
      console.log("Error uploading file:", error);
      throw error;
    }
  }
);

export const submitFormAction = createAsyncThunk(
  "submission/submitFormAction",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

export const fetchRequests = createAsyncThunk(
  "tasksSlice/fetchRequests",
  async () => {

    try {
      // const response = await axios.get(`${apiUrl}/admin/lookups/${code && code}`, {
      const response = await axios.get(`${apiUrl}/portal/customer-requests/30002290123456`, {
        // headers: {
        //   Authorization: `Bearer ${token.accessToken}`,
        //   "client-id": "employee"
        // },
      });
      return response;
    } catch (error: any) {
      console.log("Error fetching tasks:", error);
    }
  }
);



const tasksSlice = createSlice({
  name: "tasksSlice",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setCurrentParent: (state, action) => {
      state.currentParent = action.payload;
      state.currentChild = {};
    },
    setCurrentChild: (state, action) => {
      state.currentChild = action.payload;
    },
    showModal: (state, action) => {
      state.showPopup = action.payload;
    },
    setCurrentStage: (state, action) => {
      state.currentStage = action.payload;
    },
    clearCurrentData: (state) => {
      state.currentStage = null;
      state.currentChild = null;
      state.tasks = [];
      state.stages = [];
    },
    setDataNewTab: (state) => {
      state.currentStage = null;
      state.tasks = [];
      state.stages = [];
    },
    clearInquiredRequests: (state) => {
      state.inquiredRequests = [];
    },
    // Add action to clear upload results if needed
    clearUploadResults: (state) => {
      state.uploadResult = [];
    },
    // Add action to remove specific upload by index
    removeUpload: (state, action) => {
      state.uploadResult = state.uploadResult.filter((_: any, index: number) => index !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      })

      // get sub services
      .addCase(fetchSubServices.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchSubServices.fulfilled, (state, action) => {
        state.loading = false;
        state.subServices = action.payload;
      })
      .addCase(fetchSubServices.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      })

      // get sub service json
      .addCase(fetchServiceJson.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchServiceJson.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceJson = action.payload;
      })
      .addCase(fetchServiceJson.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      })
      
       // upload file
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        // Push the new upload to the array instead of replacing
        state.uploadResult.push(action.payload);
      })
      .addCase(uploadFile.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      // .submitFormAction
       .addCase(submitFormAction.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(submitFormAction.fulfilled, (state, action) => {
      state.loading = false;
        state.response = action.payload;
      })
      .addCase(submitFormAction.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      })

      // fetch requests
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      })


  },
});

export const {
  setActiveTab,
  setCurrentParent,
  setCurrentChild,
  showModal,
  setCurrentStage,
  clearCurrentData,
  setDataNewTab,
  clearInquiredRequests,
  clearUploadResults,
  removeUpload,
} = tasksSlice.actions;

export default tasksSlice.reducer;