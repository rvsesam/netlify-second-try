<template>
  <main>
    <div class="space">
      <h1>📝 Your Notes</h1>
      <div id="create-post-container" class="shadow">
        <form class="new-post">
          <input v-model="post.title" type="text" placeholder="Title" />
          <textarea
            v-model="post.contents"
            type="text"
            placeholder="What's on your mind?"
          />
          <input
            type="button"
            name="create"
            value="Créer une note"
            @click="submit()"
          />
        </form>
      </div>
    </div>

    <div id="posts-container">
      <PostCard
        v-for="(item, index) in allPosts"
        :key="index"
        :post="{ item, index }"
        @delete-post="deleteNote"
        @update-post="updateNote"
      />
    </div>
  </main>
</template>

<script>
import {
  getAllNotes,
  addNote,
  deleteNote,
  updateNote
} from "../models/PostsModel";
import PostCard from "../components/PostCard.vue";

export default {
  components: {
    PostCard
  },

  data: function() {
    return {
      post: {
        title: "",
        contents: ""
      },
      allPosts: []
    };
  },
  
  beforeMount() {
   getAllNotes()        
        .then(resp => {
          this.allPosts = Array.from(resp.data)
        })
  },

  methods: {
    getNotes() {
      getAllNotes()        
        .then(resp => {
          this.allPosts = Array.from(resp.data)
          if (resp.msg) {
            alert(resp.message);
          }
        })
        .catch(err => {
          alert("there was a problem adding post");
          console.error(err);
        });
    },

    submit() {
      addNote(this.post)
        .then(resp => {
          this.allPosts.push(resp);      
          this.post.title = "";
          this.post.contents = "";
          if (resp.msg) {
            alert(resp.message);
          }
        })
        .catch(err => {
          alert("there was a problem adding note");
          console.error(err);
        });
    },
    
    deleteNote(post) {
      deleteNote(post.item.ref).then(resp => {
        this.getNotes();
        console.log("Deleted post", resp);
      });
    },
    
    updateNote({ postRefID, updatedPost }) {
      updateNote(postRefID, updatedPost)
        .then(resp => {
          console.log("Post Updated", resp);
        })
        .catch(err => {
          console.error("problem updating post", err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#create-post-container {
  background: var(--app-secondary-background-color);
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 10px;
  border-radius: 15px;

  input[type="text"] {
    background: var(--app-secondary-background-color);
  }
  textarea {
    background: var(--app-secondary-background-color);
    resize: vertical;
  }
}

.new-post {
  display: flex;
  flex-direction: column;
}

.post-card {
  margin: 20px;
}

#posts-container {
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: center;
}

input[type="button"] {
  border: none;
  padding: 15px;
  cursor: pointer;
  border-radius: 0 0px 15px 15px;
  background: #a7a7a7;
}
input[type="button"]:hover {
  background: rgb(158, 158, 158);
}

input[type="button"]:active {
  background: rgb(112, 112, 112);
  box-shadow: 0px 0px 0px -4px rgba(0, 0, 0, 0.75);
}
</style>
