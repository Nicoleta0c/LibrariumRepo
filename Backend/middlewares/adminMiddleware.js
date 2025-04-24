const isAdmin = (req, res, next) => {
  if (!req.user || req.user.admin_user !== true) {
    return res.status(403).json({ message: "Acceso restringido a bibliotecarios" });
  }
  next();
};

export default isAdmin;
