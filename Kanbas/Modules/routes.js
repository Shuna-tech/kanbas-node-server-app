import * as dao from "./dao.js";

export default function ModuleRoutes(app) {
  const updateModule = async (req, res) => {
    const { mid } = req.params;
    const module = req.body;
    const updatedModule = await dao.updateModule(mid, module);
    res.sendStatus(204);
  };

  const deleteModule = async (req, res) => {
    const { mid } = req.params;
    console.log("module id: ", mid);
    const status = await dao.deleteModule(mid);
    console.log("delete status: ", status);
    res.sendStatus(200);
  };

  const createModule = async (req, res) => {
    const { cid } = req.params;
    console.log("course id: ", cid);
    console.log("request body: ", req.body)
    const module = { ...req.body, cid};
    console.log("module: ", module)
    const createdModule = await dao.createModule(module);
    console.log("created module: ", createdModule)
    res.send(createdModule);
  };

  const findModulesForCourse = async (req, res) => {
    const { cid } = req.params;
    console.log("find modules: ", cid)
    const modules = await dao.findModulesForCourse(cid);
    console.log("module: ", modules);
    res.json(modules);
  };

  app.put("/api/modules/:mid", updateModule);
  app.delete("/api/modules/:mid", deleteModule);
  app.post("/api/courses/:cid/modules", createModule);
  app.get("/api/courses/:cid/modules", findModulesForCourse);
}
