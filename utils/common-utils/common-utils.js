const isValidMobileNumber = (mobileNumber = '') => {
  return /^[0-9]{10}$/.test(mobileNumber);
};

module.exports = {
  isValidMobileNumber,
};
