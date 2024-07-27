import * as dao from "./dao.js";

export default function UserRoutes(app) {
  const createUser = async (req, res) => { 
    console.log("user_111: ", req.body);
    const user = await dao.createUser(req.body);
    console.log("user_routes: ", user);
    res.json(user);
  };
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.uid)
    res.json(status)
   };
  const findAllUsers = async (req, res) => { 
    const {role, name} = req.query;
    if(role){
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    console.log("users from route: ", users);
    res.json(users);
  };
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.uid);
    res.json(user);
  };
  const updateUser = async (req, res) => {
    console.log("updating: ", req.params)
    const { uid } = req.params;
    const status = await dao.updateUser(uid, req.body);
    res.json(status);
   };
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json(
        { message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
   };
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
   };
  const signout = (req, res) => { 
    req.session.destroy();
    res.sendStatus(200);
  };
  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser)
   };
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:uid", findUserById);
  app.put("/api/users/:uid", updateUser);
  app.delete("/api/users/:uid", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
