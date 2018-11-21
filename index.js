module.exports = async promise => {
  let error = undefined;
  let result = undefined;

  try {
    result = await promise;
  } catch (e) {
    error = e;
  }

  return [error, result];
};
