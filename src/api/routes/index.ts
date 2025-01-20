import { Elysia, t } from "elysia";
import { noteRouter } from "./note/note.route";
import { attachmentRouter } from "./note/attachments/attachment.route";

export const router = new Elysia().use(noteRouter).use(attachmentRouter);
