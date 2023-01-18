import express from "express";
import fs from "fs";
import uniqid from "uniqid";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { parseFile } from "../utils/upload/index.js";
import { signupSchema, checkValidationResult } from "./validation.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const usersFilePath = path.join(__dirname, "users.json");

const router = express.Router();

// get all users
router.get("/", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(usersFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSON = JSON.parse(fileAsString);
    res.send(fileAsJSON);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// create  user
router.post("/", signupSchema, async (req, res, next) => {
  try {
    const user = {
      id: uniqid(),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fileAsBuffer = fs.readFileSync(usersFilePath);

    const fileAsString = fileAsBuffer.toString();

    const fileAsJSONArray = JSON.parse(fileAsString);

    fileAsJSONArray.push(user);

    fs.writeFileSync(usersFilePath, JSON.stringify(fileAsJSONArray));

    res.send(user);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// get single user
router.get("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(usersFilePath);

    const fileAsString = fileAsBuffer.toString();

    const fileAsJSONArray = JSON.parse(fileAsString);

    const user = fileAsJSONArray.find((user) => user.id === req.params.id);
    if (!user) {
      res
        .status(404)
        .send({ message: `user with ${req.params.id} is not found!` });
    }
    res.send(user);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// delete  user
router.delete("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(usersFilePath);

    const fileAsString = fileAsBuffer.toString();

    let fileAsJSONArray = JSON.parse(fileAsString);

    const user = fileAsJSONArray.find((user) => user.id === req.params.id);
    if (!user) {
      res
        .status(404)
        .send({ message: `user with ${req.params.id} is not found!` });
    }
    fileAsJSONArray = fileAsJSONArray.filter(
      (user) => user.id !== req.params.id
    );
    fs.writeFileSync(usersFilePath, JSON.stringify(fileAsJSONArray));
    res.status(204).send();
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

//  update user
router.put("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(usersFilePath);

    const fileAsString = fileAsBuffer.toString();

    let fileAsJSONArray = JSON.parse(fileAsString);

    const userIndex = fileAsJSONArray.findIndex(
      (user) => user.id === req.params.id
    );
    if (!userIndex == -1) {
      res
        .status(404)
        .send({ message: `user with ${req.params.id} is not found!` });
    }
    const previoususerData = fileAsJSONArray[userIndex];
    const changeduser = {
      ...previoususerData,
      ...req.body,
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[userIndex] = changeduser;

    fs.writeFileSync(usersFilePath, JSON.stringify(fileAsJSONArray));
    res.send(changeduser);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

router.put("/:id/pfp", parseFile.single("pfp"), async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(usersFilePath);
    const fileAsString = fileAsBuffer.toString();
    let fileAsJSONArray = JSON.parse(fileAsString);

    const userIndex = fileAsJSONArray.findIndex(
      (user) => user.id === req.params.id
    );
    if (!userIndex == -1) {
      res
        .status(404)
        .send({ message: `user with ${req.params.id} is not found!` });
    }
    const previousUserData = fileAsJSONArray[userIndex];
    const changedUser = {
      ...previousUserData,
      pfp: req.file.path,
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[userIndex] = changedUser;

    fs.writeFileSync(usersFilePath, JSON.stringify(fileAsJSONArray));
    res.send(changedUser);
  } catch (error) {
    console.log(error);
    res.send(500).send({ message: error.message });
  }
});
router.put(
  "/:id/background",
  parseFile.single("background"),
  async (req, res, next) => {
    try {
      const fileAsBuffer = fs.readFileSync(usersFilePath);
      const fileAsString = fileAsBuffer.toString();
      let fileAsJSONArray = JSON.parse(fileAsString);

      const userIndex = fileAsJSONArray.findIndex(
        (user) => user.id === req.params.id
      );
      if (!userIndex == -1) {
        res
          .status(404)
          .send({ message: `user with ${req.params.id} is not found!` });
      }
      const previousUserData = fileAsJSONArray[userIndex];
      const changedUser = {
        ...previousUserData,
        background: req.file.path,
        updatedAt: new Date(),
        id: req.params.id,
      };
      fileAsJSONArray[userIndex] = changedUser;

      fs.writeFileSync(usersFilePath, JSON.stringify(fileAsJSONArray));
      res.send(changedUser);
    } catch (error) {
      console.log(error);
      res.send(500).send({ message: error.message });
    }
  }
);
//

//
export default router;
