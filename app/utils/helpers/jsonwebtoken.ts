let jwt: any;

// Function to initialize jwt if it hasn't been initialized yet
const getJsonwebtoken = async () => {
  if (!jwt) {
    // Dynamically import jwt
    const jsonwebtoken = await import("jsonwebtoken");
    jwt = jsonwebtoken;
  }

  return jwt;
};

export default getJsonwebtoken;
