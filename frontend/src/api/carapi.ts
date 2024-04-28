import {CarResponse} from "../types.ts";
import axios from "axios";

export const getCars = async(): Promise<CarResponse[]> => {
  const response = await axios.get<CarResponse[]>(`${import.meta.env.VITE_API_URL}/api/cars`);
  // @ts-ignore
  return response.data._embedded.cars;
}

export const deleteCar = async (link: string): Promise<CarResponse> => {
  const response = await axios.delete(link);
  return response.data;
}