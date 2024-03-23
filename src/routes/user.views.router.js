import { Router } from "express";
import { authToken, authorization, passportCall } from "../utils.js";
import passport from "passport";
import UserDto from "../services/dto/user.dto.js";
import userModel from "../models/user.model.js";

const router = Router();

router.get("/login", (req, res) => {
    res.render("login.hbs");
});

router.get("/register", (req, res) => {
    res.render("register.hbs");
});

router.get("/send-email-to-recover", async (req, res) => {
    res.render("sendEmail.hbs");
});

router.get("/new-password/:token", async (req, res) => {
    const { token } = req.params;
  
    res.render("newPassword.hbs", {
      token
    });
});

// passport.authenticate('jwt', {session: false})
// authorization("admin")
router.get("/", passportCall('jwt'), (req,res)=>{
    res.render('profile.hbs', { user: new UserDto(req.user) })
});

router.get("/error", (req, res) => {
    res.render("error");
})

router.get("/premium/:uid", async (req,res)=>{
    try {
        const userId = req.params.uid;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();

        res.render('profile', { user: new UserDto(user) });
    } catch (error) {
        console.error("Error at changing user role:", error);
        res.status(500).send("Internal server error");
    }
})

export default router;