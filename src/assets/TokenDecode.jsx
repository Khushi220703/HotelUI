import jwt_decode from 'jwt-decode';

export const decodeToken = (token) => {
    const decodedToken = jwt_decode(token);
    return decodedToken;
};

