import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { note } from "../../../db/schema/note";
import { CreateNoteType } from "./note.model";

export class NoteController {
  async createNote(new_note: CreateNoteType, ownerId: string) {
    const new_note_data = { ...new_note, ownerId: ownerId };
    const result = await db
      .insert(note)
      .values(new_note_data)
      .returning({
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      })
      .execute();
    return {
      success: true,
      data: result,
      message: "Note created successfully",
      error: null,
    };
  }

  async getOwnerNotes(ownerId: string, limit:number=10, offset:number=0) {
    const result = await db
      .select({
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      })
      .from(note)
      .where(and(eq(note.ownerId, ownerId), isNull(note.deletedAt)))
      .limit(limit).offset(offset)
      .execute();
    return {
      success: true,
      data: result,
      message: "",
      error: null,
    };
  }

  async getNoteById(noteId: string, ownerId: string) {
    const result = await db
      .select({
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      })
      .from(note)
      .where(
        and(
          eq(note.id, noteId),
          eq(note.ownerId, ownerId),
          isNull(note.deletedAt)
        )
      )
      .execute();
    let successStatus = true;
    if(result.length===0){
      successStatus = false
    };
    return {
      success: successStatus,
      data: result,
      message: "",
      error: null,
    };
  }

  async updateNoteById(
    noteId: string,
    updated_note: CreateNoteType,
    ownerId: string
  ) {
    const new_note_data = { ...updated_note, updatedAt: new Date() };
    const result = await db
      .update(note)
      .set(new_note_data)
      .where(
        and(
          eq(note.id, noteId),
          eq(note.ownerId, ownerId),
          isNull(note.deletedAt)
        )
      )
      .returning({
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      })
      .execute();

    return {
      success: true,
      data: result,
      message: "Note updated successfully",
      error: null,
    };
  }

  async deleteNoteById(noteId: string, ownerId: string) {
    await db
      .update(note)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(note.id, noteId),
          eq(note.ownerId, ownerId),
          isNull(note.deletedAt)
        )
      )
      .execute();
    return {
      success: true,
      data: null,
      message: "Note deleted successfully",
      error: null,
    };
  }

  async deleteAllNotes(ownerId: string) {
    await db
      .update(note)
      .set({ deletedAt: new Date() })
      .where(and(eq(note.ownerId, ownerId), isNull(note.deletedAt)))
      .execute();
    return {
      success: true,
      data: null,
      message: "Notes deleted successfully",
      error: null,
    };
  }
}
