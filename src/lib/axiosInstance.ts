import axios, { type AxiosInstance } from "axios";
import { getServiceBaseUrl } from "./apiConstant";
import { getBearerToken } from "@/utils/authSession";
import { MicroService } from "@/utils/enum";

const instances = new Map<string, AxiosInstance>();

function createInstance(service: MicroService): AxiosInstance {
  const instance = axios.create({
    baseURL: getServiceBaseUrl(service),
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const token = getBearerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}

/** Returns a cached axios client for the given backend service. */
export default function axiosInstance(service: MicroService): AxiosInstance {
  const cached = instances.get(service);
  if (cached) return cached;

  const instance = createInstance(service);
  instances.set(service, instance);
  return instance;
}
