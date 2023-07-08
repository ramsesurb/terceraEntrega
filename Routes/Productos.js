import { Router } from "express";
import { productsService } from "../Repository/index.js";

const adminAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol === "admin") {
    next();
  } else {
    res.redirect("/"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
  }
};

const userAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol === "user") {
    next();
  } else {
    res.redirect("/"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
  }}

const routerProd = Router();

//getAll productos
routerProd.get("/", async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const prodsRaw = await productsService.getProducts(limit);
  const prods = prodsRaw.map(item=>item.toObject())
  res.send(prods);
});
//get by id
routerProd.get("/:id", async (req, res) => {
  const id = parseFloat(req.params.id);
  const prodById = await productsService.getByid(id);
  res.send(prodById);
});
//save new product
routerProd.post("/",adminAccess, async (req, res) => {
  const prod = req.body;
  const saveProd = await productsService.addProduct(prod);
  res.status(201).json(saveProd);
  res.send(saveProd);
});
//delete by id
routerProd.delete("/:id",adminAccess, async (req, res) => {
  const id = parseInt(req.params.id);
  const deleteProd = await productsService.deleteById(id);
  res.send(deleteProd);
});


export default routerProd;
