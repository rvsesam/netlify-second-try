import { q, client } from "../helpers/init-db";

export function addPost(postData, journalID) {
  const me = q.Identity();

  return client
    .query(
      q.Create(q.Collection("posts"), {
        data: {
          ...postData,
          journal: q.Ref(q.Collection("journals"), journalID),
          owner: me
        },
        permissions: {
          read: me,
          write: me
        }
      })
    )
    .then(resp => resp)
    .catch(error => error);
}

export function addNote(noteData) {
  return client
    .query(
      q.Create(q.Collection("notes"), {
        data: {
          ...noteData
        }
      })
    )
    .then(resp => resp)
    .catch(error => error);
}

export function getPosts(journalID) {
  // Get the Current Journal reference object
  // TODO: Wonder if we could just store the current journal ID object into a vuex,
  // this could save an additonal request to get the journal ID

  return client
    .query(q.Get(q.Ref(`collections/journals/${journalID}`)))
    .then(journal => {
      return client
        .query(
          q.Map(
            q.Paginate(q.Match(q.Index("posts_by_journal"), journal.ref)),
            ref => q.Get(ref) // fauna lambda function , what does "Get()" do?
          )
        )
        .then(resp => resp);
    })
    .catch(err => err);
}

export function getAllNotes() {
  return client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("notes"))),
        q.Lambda("i", q.Get(q.Var("i")))
      )
    )
    .then(resp => resp)
    .catch(err => err);
}

export function deleteNote(refID) {
  return client
    .query(q.Delete(refID))
    .then(resp => resp)
    .catch(err => err);
}

export function updateNote(noteRefID, newNoteData) {
  return client
    .query(
      q.Update(q.Ref(q.Collection("notes"), noteRefID), {
        data: newNoteData
      })
    )
    .then(resp => resp)
    .catch(err => err);
}
