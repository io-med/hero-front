import { client } from "../utils/fetchClient";

const path = 'images';
const BASE_URL = import.meta.env.VITE_API_URL;
type DeleteData = {
  image: string,
}

export const addImage = async (image: FormData, id: number) => {
  return client.postForm(`${path}/${id}`, image);
}

export const deleteImage = (image: DeleteData,id: number) => {
  return client.delete<DeleteData>(`${path}/${id}`, image);
};

export const getImageUrl = (name: string) => {
  return `${BASE_URL}/images/${name}`;
}
