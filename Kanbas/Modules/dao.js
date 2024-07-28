import model from "./model.js";

export const createModule = (module) => {
  delete module._id
  return model.create(module);
} 

export const findModulesForCourse = async (courseId) => {
  try{
    const modules = await model.find({course: courseId});
    return modules;
  }catch (error) {
    console.error("Failed to retrieve modules:", error);
    throw error;
  }
};

export const updateModule = (moduleId, module) =>  model.updateOne({ _id: moduleId }, { $set: module });

export const deleteModule = (moduleId) => model.deleteOne({ _id: moduleId });