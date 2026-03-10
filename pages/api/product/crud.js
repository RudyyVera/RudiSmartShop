import connectDB from "../../../middleware/db/mongodb";
import errorController from "../../../controller/errorController";
//controllers
import {authMiddleware} from "../../../middleware/auth/authMiddleware";
import createProduct from "../../../controller/productsController/createProduct";
import readProduct from "../../../controller/productsController/readProducts";
import updateProduct from "../../../controller/productsController/updateProduct";
import deleteProduct from "../../../controller/productsController/deleteProduct";

const reqHandler = async (req, res) => {
  /* **************************************************************
    before req proccesing check security credentials like JWT token 
  ************************************************************** */
  const method = req.method;
  switch (method) {
    case "GET":
      return await readProduct(req, res);
    case "POST":
      return authMiddleware(req, res, true, createProduct);
    case "PATCH":
      return authMiddleware(req, res, true, updateProduct);
    case "DELETE":
      return authMiddleware(req, res, true, deleteProduct);
    default:
      return errorController(422, "request method not supported", res);
  }
};
export default connectDB(reqHandler);
