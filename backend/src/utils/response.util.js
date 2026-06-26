// Utility untuk standardisasi response API
// Saya menggunakan ini untuk konsistensi format response

/**
 * Response sukses
 */
const responseSuccess = (res, data = null, message = 'Berhasil', statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

/**
 * Response error
 */
const responseError = (res, message = 'Terjadi kesalahan', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors && { errors })
  });
};

/**
 * Response paginated data
 */
const responsePaginated = (res, data, pagination, message = 'Berhasil') => {
  return res.status(200).json({
    status: 'success',
    message,
    data,
    pagination: {
      total: pagination.total,
      halaman: pagination.halaman,
      batas: pagination.batas,
      total_halaman: Math.ceil(pagination.total / pagination.batas)
    }
  });
};

module.exports = {
  responseSuccess,
  responseError,
  responsePaginated
};
