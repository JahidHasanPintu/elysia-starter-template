import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../../db";
import { attachment, note } from "../../../../db/schema/note";
import { CreateAttachmentType } from "./attachment.model";
import { NoteController } from "../note.controller";
import { createId } from "@paralleldrive/cuid2";
import { getSignedUrl, uploadFileAndGetUrl } from "../../../../lib/storage/storage";
import { error } from "elysia";

export class AttachmentController {
  async createAttachment(new_attachment: CreateAttachmentType, ownerId:string) {
    const note = new NoteController();

    const existingNote = await note.getNoteById(new_attachment.noteId, ownerId);
    if (existingNote.data.length===0){
      throw error(403, {
        success: false,
        data: [],
        message: "User do not have access",
        error: "FORBIDDEN",
      });
    }
    const filePath = "attachments/"+existingNote.data[0].id+"/file_"+createId()+"-"+new_attachment.file.name;
    const attachmentUrl = await uploadFileAndGetUrl(filePath, new_attachment.file)
    const new_attachment_data = { ...new_attachment, noteId: new_attachment.noteId, filePath:filePath };
    const result = await db
      .insert(attachment)
      .values(new_attachment_data)
      .returning({  
        id: attachment.id,
        title: attachment.title,
        noteId: attachment.noteId,
        createdAt: attachment.createdAt
      })
      .execute();

    const resultWithAttachment = {
      attachmentUrl:attachmentUrl,
      ...result[0]
    }
    return {
      success: true,
      data: [resultWithAttachment],
      message: "Attachment created successfully",
      error: null,
    };
  }

  async getAttachmentsByNoteId(noteId: string, ownerId: string, limit: number = 10, offset: number = 0) {
    const result = await db
      .select({
        id: attachment.id,
        title: attachment.title,
        filePath: attachment.filePath,
        noteId: attachment.noteId,
        createdAt: attachment.createdAt,
      })
      .from(attachment)
      .leftJoin(note, eq(note.id, attachment.noteId))
      .where(and(eq(attachment.noteId, noteId), isNull(attachment.deletedAt), eq(note.ownerId, ownerId)))
      .limit(limit)
      .offset(offset)
      .execute();
    
    const allAttachments = [];
    for (let i = 0; i<result.length; i++){
      if (!result[0].filePath){
        continue;
      }
      const attachmentUrl = await getSignedUrl(result[i].filePath as string)
      const resultWithAttachment = {
        attachmentUrl:attachmentUrl,
        ...result[i]
      }
      allAttachments.push(resultWithAttachment)
    }
    return {
      success: true,
      data: allAttachments,
      message: "",
      error: null,
    };
  }

  async getAttachmentById(attachmentId: string, ownerId: string) {
    const result = await db
      .select({
        id: attachment.id,
        title: attachment.title,
        filePath: attachment.filePath,
        noteId: attachment.noteId,
        createdAt: attachment.createdAt,
      })
      .from(attachment)
      .leftJoin(note, eq(note.id, attachment.noteId))
      .where(
        and(
          eq(attachment.id, attachmentId),
          eq(note.ownerId, ownerId),
          isNull(attachment.deletedAt),
        ),
      )
      .execute();
    if (result.length === 0 || !result[0].filePath) {
      return {
        success: false,
        data: [],
        message: "No Attachment found",
        error: null,
      };
    }
    const attachmentUrl = await getSignedUrl(result[0].filePath)
    const resultWithAttachment = {
      attachmentUrl:attachmentUrl,
      ...result[0]
    }
    return {
      success: true,
      data: [resultWithAttachment],
      message: "",
      error: null,
    };
  }

  async deleteAttachmentById(attachmentId: string, ownerId: string) {
    const existingAttachment = await this.getAttachmentById(attachmentId, ownerId)
    if (existingAttachment.data.length===0){
      throw error(403);
    }
    await db
      .update(attachment)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(attachment.id, attachmentId),
          isNull(attachment.deletedAt),
        ),
      )
      .execute();
    return {
      success: true,
      data: null,
      message: "Attachment deleted successfully",
      error: null,
    };
  }

  async deleteAllAttachmentsByNoteId(noteId: string, ownerId: string) {

    const note = new NoteController()
    const existingNote = await note.getNoteById(noteId, ownerId);

    if (existingNote.data.length===0){
      throw error(403);
    }

    await db
      .update(attachment)
      .set({ deletedAt: new Date() })
      .where(and(eq(attachment.noteId, noteId), isNull(attachment.deletedAt)))
      .execute();
    return {
      success: true,
      data: null,
      message: "Attachments deleted successfully",
      error: null,
    };
  }
}
