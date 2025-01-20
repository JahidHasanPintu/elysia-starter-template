import { describe, expect, it, beforeAll } from "bun:test";
import { testClientApp } from "../../../../../test/client";

let attachmentId: string;
let noteId: string;

// Helper function to create a test file
const createTestFile = (content: string, filename: string = "test.txt") => {
  return new File([content], filename, { type: "text/plain" });
};

describe("Attachment", () => {
  // Create a note first since attachments need a noteId
  beforeAll(async () => {
    const { data } = await testClientApp.api.note.post({
      title: "test note for attachments",
      content: "description",
    });
    if (!data?.data) {
      throw new Error("create note api did not return data");
    }
    noteId = data.data[0].id;
  });

  // Create an attachment
  it("Create Attachment", async () => {
    const testFile = createTestFile("Hello, World!", "test.txt");
    const { data } = await testClientApp.api.attachment.post({
      title: "test attachment",
      file: testFile,
      noteId: noteId,
    });
    
    if (!data?.data) {
      throw new Error("create attachment api did not return data");
    }
    
    attachmentId = data.data[0].id;
    expect(data.data[0].title).toBe("test attachment");
    expect(data.data[0].noteId).toBe(noteId);
    expect(data.data[0].attachmentUrl).toBeDefined();
  });

  // Get all attachments for a note
  it("Get All Attachments for a Note", async () => {
    const { data } = await testClientApp.api.attachment.get({
      query: { 
        noteId: noteId,
        limit: 10, 
        offset: 0 
      },
    });
    expect(data?.success).toBe(true);
    expect(data?.data).toHaveLength(1);
    expect(data?.data[0].id).toBe(attachmentId);
  });

  // Get single attachment
  it("Get Created Attachment", async () => {
    const { data } = await testClientApp.api.attachment({ id: attachmentId }).get();
    expect(data?.success).toBe(true);
    expect(data?.data[0].id).toBe(attachmentId);
    expect(data?.data[0].noteId).toBe(noteId);
    expect(data?.data[0].attachmentUrl).toBeDefined();
  });

  // Delete single attachment
  it("Delete Single Attachment", async () => {
    // First create a new attachment to delete
    const testFile = createTestFile("Delete me!", "delete.txt");
    const { data: createData } = await testClientApp.api.attachment.post({
      title: "attachment to delete",
      file: testFile,
      noteId: noteId,
    });
    
    if (!createData?.data) {
        throw new Error("CreateData should not be null");
      }

    const deleteAttachmentId = createData?.data[0].id;
    if (!deleteAttachmentId) {
      throw new Error("Failed to receive attachmentId in delete attachment test");
    }

    // Delete the attachment
    const { data: deleteData } = await testClientApp.api
      .attachment({ id: deleteAttachmentId })
      .delete();
    expect(deleteData?.success).toBe(true);

    // Verify attachment is deleted by trying to fetch it
    const { data: verifyData } = await testClientApp.api
      .attachment({ id: deleteAttachmentId })
      .get();
    expect(verifyData?.data).toHaveLength(0);
  });

  // Delete all attachments for a note
  it("Delete All Attachments for a Note", async () => {
    // First create multiple attachments
    const file1 = createTestFile("Content 1", "file1.txt");
    const file2 = createTestFile("Content 2", "file2.txt");

    await testClientApp.api.attachment.post({
      title: "attachment 1",
      file: file1,
      noteId: noteId,
    });
    await testClientApp.api.attachment.post({
      title: "attachment 2",
      file: file2,
      noteId: noteId,
    });

    // Delete all attachments for the note
    const { data: deleteData } = await testClientApp.api.attachment.delete({},{
      query: { noteId: noteId }
    });
    expect(deleteData?.success).toBe(true);

    // Verify all attachments are deleted
    const { data: verifyData } = await testClientApp.api.attachment.get({
      query: { 
        noteId: noteId,
        limit: 10, 
        offset: 0 
      },
    });
    expect(verifyData?.data).toHaveLength(0);
  });



  // Error cases
  it("Should handle invalid attachment ID", async () => {
    const invalidId = "invalid-id";
    const { data, error } = await testClientApp.api.attachment({ id: invalidId }).get();
    expect(data?.data?.length).toBe(0);
  });

  it("Should handle invalid note ID when creating attachment", async () => {
    const invalidNoteId = "invalid-note-id";
    const testFile = createTestFile("Test content", "test.txt");
    const { data, error } = await testClientApp.api.attachment.post({
      title: "test attachment",
      file: testFile,
      noteId: invalidNoteId,
    });
    expect(error?.status).toBe(500);
  });

  // Clean up - delete the test note after all tests
  it("Clean up test note", async () => {
    const { data } = await testClientApp.api.note({ id: noteId }).delete();
    expect(data?.success).toBe(true);
  });
});