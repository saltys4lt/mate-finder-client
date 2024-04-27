import axios from 'axios';
const imageUrl = import.meta.env.VITE_IMAGE_STORAGE_URL;
export default async (formData: FormData) => {
  const response = await axios
    .post(`${imageUrl}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      return `${imageUrl}/${res.data}`;
    })
    .catch((e) => {
      console.log(e);
    });
  return response;
};
