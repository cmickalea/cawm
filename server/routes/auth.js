const express = require(`express`);
const router = express.Router();


const { signup, signin, signout, requireSignin } = require('../controllers/auth');
const { userSignupValidator } = require(`../validator`);

router.post("/signup", userSignupValidator, signup); // route and controller method
router.post("/signin", signin);
router.get("/signout", signout);

// router.get('/hello', requireSignin, (req,res) => {
//     res.send("hello there baddie");
// });


module.exports = router;
