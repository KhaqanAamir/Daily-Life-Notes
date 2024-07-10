import express, { Router } from "express";
import Notes from "../models/Notes.js";
import fetchuser from "../middlewares/fetchusers.js";
import { body, validationResult } from "express-validator";

const notesRouter = express.Router();

// This route is to fetch all notes from a specific user
notesRouter.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});

// This route would be using to add a note in the route
notesRouter.post(
  "/addnote",
  fetchuser,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { title, description, tag } = req.body;
    try {
      const note = await Notes.create({
        user: req.user.id,
        title: title,
        description: description,
        tag: tag,
      });

      if (note) {
        return res
          .status(200)
          .json({ note, message: "Note added Successfully" });
      }
    } catch (err) {
      return res.status(500).send("Internal server error");
    }
  }
);

// This route will be used to update an existing note

notesRouter.put(
  "/updatenote/:id",
  fetchuser,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const {title, description, tag}= req.body

    const findNote= await Notes.findById(req.params.id)
    if(!findNote){
        return res.status(400).send("Unable to find the note")
    }

    if(findNote.user.toString() !== req.user.id){
        return res.status(404).send("User is not allowed")
    }

    const newNote= {}
    if(title)newNote.title=title
    if(description)newNote.description=description
    if(tag)newNote.tag=tag

    const noteUpdated= await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({noteUpdated})
    })


// This route would be used to delete a note

notesRouter.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    const findNote= await Notes.findById(req.params.id)
    if(!findNote){
        return res.status(400).send("Note not found")
    }
    if(findNote.user.toString() !== req.user.id){
        return res.status(404).send("User not authorized")
    }

    const deleteNote= await Notes.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted", deleteNote})
})

export default notesRouter;
