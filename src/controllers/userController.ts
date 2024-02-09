import { User } from "../models/User";
import { Request, Response } from "express";
import Wishlist from "../models/Wishlist";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import Movies from "../models/Movies";
import { RequestWithUser } from "../middleware/cutomType";
import updateCounter from "./counterFun";
const singUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const getUser = await User.findOne({ email });
    if (getUser) {
      res.status(400).send({ error: "User Already Exists" });
    } else {
      const newUser = new User({
        email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(200).send({ message: "User Successfully Registerd" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const checkUserEmail = await User.findOne({ email });

    if (!checkUserEmail) {
      //invalid email
      res.status(404).send({ error: "Invalid User name" });
    } else {
      //check password
      const isValidatePassword = await bcrypt.compare(
        password,
        checkUserEmail.password
      );

      if (isValidatePassword) {
        //create jwt
        const payload = { email: email };
        const jwtToken = await Jwt.sign(payload, "secret_key", {
          expiresIn: "30d",
        });
        res.status(200).send({ jwtToken: jwtToken });
      } else {
        //invalid password
        res.status(401).send({ error: "Invalid Password" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const moviesList = async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://freetestapi.com/api/v1/movies");
    const data = await response.json();
    for (let movie of data) {
      console.log(movie);
      const { title, year, poster, director, language } = movie;
      const newMovieListData = new Movies({
        title,
        year,
        poster,
        director,
        language,
      });

      await newMovieListData.save();
    }
    res.status(200).send({ message: "data Successfully inserted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const addWishlist = async (req: RequestWithUser, res: Response) => {
  try {
    const userEmail = req.email;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).send({ error: "Invalid Data" });
    }
    const user = await User.findOne({ email: userEmail }).populate("watchlist");

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (user?.watchlist && user.watchlist.length !== 0) {
      for (let i = 0; i < user.watchlist.length; i++) {
        if (user.watchlist[i].name === name) {
          return res.status(404).send({ error: "watchlist Already Exists" });
        }
      }
    }
    const count = await updateCounter();
    console.log(count);

    const newWishlist = new Wishlist({
      name,
      description,
      sequenceId: count,
      movies: [],
    });

    await newWishlist.save();
    await user.updateOne({ $push: { watchlist: newWishlist._id } });

    return res.status(200).send({ message: "wishlist added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

const addMovie = async (req: RequestWithUser, res: Response) => {
  try {
    const { movieId, wishListId } = req.body;
    if (!movieId || !wishListId) return res.send("Invalid data");

    const user = req.email;
    const wishList = await Wishlist.findOne({ _id: wishListId });

    if (!wishList) return res.send("Wishlist not found");

    const movieExists = wishList.movies.some((movie) =>
      (movie._id as any).equals(movieId)
    );

    if (movieExists) return res.send("Movie already exists in wishlist");

    await wishList.updateOne({
      $push: { movies: { _id: movieId } },
    });

    return res.send("Movie added to wishlist");
  } catch (err) {
    return res.json(err);
  }
};

const getWishlist = async (req: RequestWithUser, res: Response) => {
  try {
    const userEmail = req.email;
    const wishList = await User.findOne({ email: userEmail });
    return res.status(200).send(wishList);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getWishlistMovies = async (req: RequestWithUser, res: Response) => {
  try {
    const { wishlistId } = req.params;
    const user = req.email;

    const userWishlist = await Wishlist.findOne({
      _id: wishlistId,
    }).populate("movies");

    if (!userWishlist) {
      return res.status(404).json({ error: "Wishlist not found for user" });
    }

    const movies = userWishlist.movies.map((movie) => movie);

    return res.status(200).json({ movies });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  singUp,
  login,
  moviesList,
  addWishlist,
  addMovie,
  getWishlist,
  getWishlistMovies,
};
