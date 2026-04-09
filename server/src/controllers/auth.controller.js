const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const authService = require("../services/auth.service");
const { setTokenCookie, clearTokenCookie } = require("../utils/generateToken");

exports.register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  setTokenCookie(res, token);
  ApiResponse.created(res, { user, token }, "Registration successful");
});

exports.login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  setTokenCookie(res, token);
  ApiResponse.ok(res, { user, token }, "Login successful");
});

exports.logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  ApiResponse.ok(res, null, "Logged out successfully");
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  ApiResponse.ok(res, user);
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  ApiResponse.ok(res, user, "Profile updated");
});

exports.changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  ApiResponse.ok(res, null, "Password changed successfully");
});
