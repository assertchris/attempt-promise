const attempt = async promise => {
  let error = undefined;
  let result = undefined;

  try {
    result = await promise;
  } catch (e) {
    error = e;
  }

  return [error, result];
};

attempt.all = async promises => {
  const ret = await Promise.all(promises.map(attempt, promises));
  let errors = [], results = [];
  ret.forEach(([error, result]) => {
    error && errors.push(error)
    results.push(result)
  });
  return [(errors.length === 0) ? undefined : errors, results];
}

module.exports = attempt;
