export default (error, req, res, next) => {
  res.send(error?.message || error);
};
