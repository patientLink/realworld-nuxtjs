<template>
  <div class="article-page">

  <div class="banner">
    <div class="container">

      <h1>{{article.title}}</h1>

      <article-meta 
        :username="(user && user.username) || ''" 
        :followDisable="followDisable" 
        @onFollow="onFollow" 
        @onFavorite="onFavorite(article)" 
        @onDeleteArticle="onDeleteArticle"
        :article="article"/>
    </div>
  </div>

  <div class="container page" >

    <div class="row article-content">
      <div class="col-md-12" v-html="article.body"></div>
    </div>

    <hr />

    <div class="article-actions">
      <article-meta 
        :username="(user && user.username) || ''" 
        :followDisable="followDisable" 
        @onFollow="onFollow" 
        @onFavorite="onFavorite(article)" 
        @onDeleteArticle="onDeleteArticle"
        :article="article" />
    </div>

    <div class="row">

      <div class="col-xs-12 col-md-8 offset-md-2">
        <article-comments :article="article" />
      </div>

    </div>

  </div>

</div>
</template>

<script>
import {
  getArticle, 
  addFavorite, 
  deleteFavorite,
  deleteArticle
  } from '@/api/article'
import {followUser, unfollowUser} from '@/api/user'
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/article-meta.vue'
import ArticleComments from './components/article-comments.vue'
import {mapState} from 'vuex'

export default {
  name: 'ArticleIndex',
  async asyncData({params}) {
    const {data} = await getArticle(params.slug)
    const {article} = data
    const {author} = article
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    article.favoriteDisable = false
    return {
      article,
      author,
      followDisable: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  components: {
    ArticleMeta,
    ArticleComments
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {hid: 'description', name: 'description', content: this.article.description}
      ]
    }
  },
  methods: {
    async onFavorite(article) {
      if(!this.user) {
        this.$router.push({
          name: 'Login'
        })
        return
      }
      article.favoriteDisable = true
      if(article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisable = false
    },
    async onFollow() {
      if(!this.user) {
        this.$router.push({
          name: 'Login'
        })
        return
      }
      this.followDisable = true
      if(this.author.following) {
        await unfollowUser(this.author.username)
        this.author.following = false
      } else {
        await followUser(this.author.username)
        this.author.following = true
      }
      this.followDisable = false
    },
    async onDeleteArticle() {
      if(!this.user) {
        this.$router.push({
          name: 'Login'
        })
        return
      }
      await deleteArticle(this.article.slug)
      this.$router.push({
        name: 'Home'
      })
    }
  }
}
</script>

<style>

</style>