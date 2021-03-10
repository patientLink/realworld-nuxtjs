<template>
  <div>
    <form class="card comment-form" v-if="user">
      <div class="card-block">
        <textarea 
          class="form-control" 
          placeholder="Write a comment..." 
          rows="3"
          v-model="inputComment"
          ></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button 
          class="btn btn-sm btn-primary"
          @click.prevent="postComment"
          >
          Post Comment
        </button>
      </div>
    </form>
    <p style="display: inherit;" v-else>
      <nuxt-link :to="{
        name: 'Login'
      }">Sign in</nuxt-link> or <nuxt-link :to="{
        name: 'Register'
      }">sign up</nuxt-link> to add comments on this article.
    </p>
    <div 
      class="card" 
      v-for="comment in comments" 
      :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">{{comment.body}}</p>
      </div>
      <div class="card-footer">
        <nuxt-link :to="{
          name: 'Profile',
          params: {
            username: comment.author.username
          }
        }" class="comment-author">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link :to="{
          name: 'Profile',
          params: {
            username: comment.author.username
          }
        }" class="comment-author">{{comment.author.username}}</nuxt-link>
        <span class="date-posted">{{comment.createdAt | date('MMM DD, YYYY')}}</span>
        <span class="mod-options" v-if="user && comment.author.username === user.username" >
          <i class="ion-trash-a" @click="deleteMyComment(comment.id)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getComments, 
  addComments, 
  deleteComment
} from '@/api/article'
import {mapState} from 'vuex'

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      inputComment: ''
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async getCommentsList() {
      const {data} = await getComments(this.article.slug)
      this.comments = data.comments
    },
    async postComment() {
      if(!this.user) {
        this.$router.push({
          name: 'Login'
        })
        return
      }
      if(this.inputComment === '') return
      let comment = {
        comment: {
          body: this.inputComment
        }
      }
      await addComments(this.article.slug, comment)
      this.inputComment = ''
      this.getCommentsList()
    },
    async deleteMyComment(commentId) {
      if(!this.user) {
        this.$router.push({
          name: 'Login'
        })
        return
      }
      await deleteComment(this.article.slug, commentId)
      this.getCommentsList()
    }
  },
  mounted() {
    this.getCommentsList()
  }
}
</script>

<style>

</style>