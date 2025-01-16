
import { Elysia, t } from "elysia";
import { noteRouter } from "./note/note.route";


export const router = new Elysia().use(noteRouter)