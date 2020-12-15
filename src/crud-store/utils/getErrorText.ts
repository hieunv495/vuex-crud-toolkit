const getErrorText = (e: any) => {
  if (e.response && e.response.data && e.response.data.message) {
    return e.response.data.message as string;
  } else {
    return "Lỗi không xác định";
  }
};

export default getErrorText;
