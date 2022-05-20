const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddlewares");
const userRoleMiddleware = require("../middlewares/userRoleMiddlewares");

router.post("/login", userController.handleLogin);
router.post("/register", userController.handleRegistration);
router.get("/logout", userController.handleLogout);

router.get(
  "/profile",
  authMiddleware.ensureAuthenticated,
  userController.userProfile
);
router.post(
  "/profile",
  authMiddleware.ensureAuthenticated,
  userController.handleUpdate
);

router.get(
  "/manage-cssa",
  userRoleMiddleware.ensureUserRole,
  authMiddleware.ensureAuthenticated,
  userController.viewCSSAList
);

router.post(
  "/manage-cssa",
  userRoleMiddleware.ensureUserRole,
  authMiddleware.ensureAuthenticated,
  userController.handleRegistration
);

router.post(
  "/delete-cssa",
  userRoleMiddleware.ensureUserRole,
  authMiddleware.ensureAuthenticated,
  userController.handleDelete
);

//REST Endpoints for React Chat Component
router.get(
  "/users/get",
  authMiddleware.ensureAuthenticated,
  userController.getCurrentUser
);

module.exports = router;
