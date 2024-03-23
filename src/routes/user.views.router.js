import { Router } from "express";
import { authToken, authorization, passportCall } from "../utils.js";
import passport from "passport";
import UserDto from "../services/dto/user.dto.js";

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

export default router;