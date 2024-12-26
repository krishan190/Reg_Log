import JWT from "jsonwebtoken";


export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        // console.log("Decode is", decode);
        req.user = decode;
        // console.log("requested User", req.user);
        next();
    } catch (error) {
        console.log(error);
    }
};