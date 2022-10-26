import axios from "axios";

export const Api = axios.create({
  baseURL: `${process.env.SYNC_HOST}`
  
});