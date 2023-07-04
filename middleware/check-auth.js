import jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {
  // check if the request has the authorization header

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Auth failed, No token provided.! please Login again.",
    });
  }

  // save the token from the authorization header

  const token = req.headers.authorization;

  // verify the token

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Auth failed, No token provided.! please Login again.",
    });
  }

  try {
    // decode the token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // save the decoded token in the request object
    req.userData = decoded;

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Auth failed, Inavlid token.! please Login again.",
    });
  }
};

export default checkAuth;
