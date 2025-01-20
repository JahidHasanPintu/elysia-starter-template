import { describe, expect, it } from 'bun:test'
import { testClientApp } from '../../../../test/client';

let noteId: string;

describe('Note', () => {
  // Create a note before tests
  it('Create Note', async () => {
    const { data } = await testClientApp.api.note.post({
      "title": "test note",
      "content": "description",
    })
    if (!data?.data) {
      throw new Error('create note api did not return data');
    }
    noteId = data.data[0].id
    expect(data.data[0].title).toBe('test note')
  })

  // Get all notes
  it('Get All Notes', async () => {
    const { data } = await testClientApp.api.note.get({
      query: { limit: 1, offset: 0 }
    })
    expect(data?.data[0].id).toBe(noteId)
  })

  // Get single note
  it('Get Created Note', async () => {
    const { data, error } = await testClientApp.api.note({ id: noteId }).get()
    expect(data?.data[0].id).toBe(noteId)
  })

  // Update note
  it('Update Note', async () => {
    const updatedTitle = "updated test note"
    const updatedContent = "updated description"
    
    const { data } = await testClientApp.api.note({ id: noteId }).patch({
      title: updatedTitle,
      content: updatedContent,
    })

    expect(data?.success).toBe(true)
    expect(data?.data[0].title).toBe(updatedTitle)
    expect(data?.data[0].content).toBe(updatedContent)
  })

  // Delete single note
  it('Delete Single Note', async () => {
    // First create a new note to delete
    const { data: createData } = await testClientApp.api.note.post({
      "title": "note to delete",
      "content": "this note will be deleted",
    })
    const deleteNoteId = createData?.data[0].id


    if (!deleteNoteId) {
      throw new Error('Failed to receive noteId in delete note test');
    }

    // Delete the note
    const { data: deleteData } = await testClientApp.api.note({ id: deleteNoteId }).delete()
    expect(deleteData?.success).toBe(true)

    // Verify note is deleted by trying to fetch it
    const { data: verifyData } = await testClientApp.api.note({ id: deleteNoteId }).get()
    expect(verifyData?.data).toHaveLength(0)
  })

  // Delete all notes
  it('Delete All Notes', async () => {
    // First create multiple notes
    await testClientApp.api.note.post({
      "title": "note 1",
      "content": "content 1",
    })
    await testClientApp.api.note.post({
      "title": "note 2",
      "content": "content 2",
    })

    // Delete all notes
    const { data: deleteData } = await testClientApp.api.note.delete()
    expect(deleteData?.success).toBe(true)

    // Verify all notes are deleted
    const { data: verifyData } = await testClientApp.api.note.get({
      query: { limit: 10, offset: 0 }
    })
    expect(verifyData?.data).toHaveLength(0)
  })

  // Error cases
  it('Should handle invalid note ID', async () => {
    const invalidId = 'invalid-id'
    const { data } = await testClientApp.api.note({ id: invalidId }).get()
    expect(data?.success).toBe(false)
    expect(data?.data).toHaveLength(0)
  })
})