import userController from "../controllers/userController";
import express from "express";
import middleware from "../middleware/middleware";
const router = express.Router();

router.post("/singUp", userController.singUp);
router.post("/login", userController.login);
router.get("/movies", userController.moviesList);
router.post("/addWishlist", middleware, userController.addWishlist);
router.post("/addMovie", middleware, userController.addMovie);
router.get("/getWishlist", middleware, userController.getWishlist);
router.get(
  "/getWishlistMovies/:wishlistId",
  middleware,
  userController.getWishlistMovies
);

export default router;
