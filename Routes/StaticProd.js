import { Router } from "express";
import productoModel from "../Daos/Models/mongo.js";
import { productsService, userService } from "../Repository/index.js";
import { GetUserDto,CreateUserDto } from "../Daos/Dto/usersDto.js";

const staticProd = Router();

//middlewares

const privateAccess = (req,res,next)=>{
  if(!req.session.user) return res.redirect('/prods');
  next();
}
const adminAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol === "admin") {
    next();
  } else {
    res.redirect("/register"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
  }
};

const userAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol === "user") {
    next();
  } else {
    res.redirect("/denegado"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
  }}

//rutas

staticProd.get('/register', (req,res)=>{
  res.render('register') 
  
})

staticProd.get('/', (req,res)=>{
  res.render('login')
})

staticProd.get('/current',userAccess, async (req,res)=>{

  let{ first_name,last_name,email,age} = req.session.user
  let user = new CreateUserDto({first_name,last_name,email,age})
  res.render('profile',{user})
})

staticProd.get("/prods",   async (req, res) => {
  const { page = 1, limit: queryLimit, sort, descripcion } = req.query;

  // Obtener los productos paginados de Mongoose
  const options = { limit: 6, page, lean: true };

  if (queryLimit) {
    options.limit = parseInt(queryLimit);
  }

  if (sort) {
    options.sort = sort;
  }

 
  const query = {};
  if (descripcion) {
    query.descripcion = descripcion;
  }

  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productoModel.paginate(query, options);

  const prodsRaw = await productsService.getProducts(queryLimit, sort);
  const prods = prodsRaw.map(item => item.toObject());

  res.render("home", {
    productos: docs,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    user: req.session.user,
    
  });
});


export default staticProd;