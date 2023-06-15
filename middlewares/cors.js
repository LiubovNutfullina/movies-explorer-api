const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://fr.domainlyubov.students.nomoredomains.rocks',
  'https://fr.domainlyubov.students.nomoredomains.rocks',
  'http://domainnutfullina.students.nomoredomains.rocks',
  'https://domainnutfullina.students.nomoredomains.rocks',
  'http://51.250.74.50',
  'https://51.250.74.50',
];

const corsProcess = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }
  return next();
};

module.exports = {
  corsProcess,
};
