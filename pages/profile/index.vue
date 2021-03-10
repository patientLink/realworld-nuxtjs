<template>
  <div class="profile-page">

  <div class="user-info">
    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="profile.image" class="user-img" :onerror="errorImg" />
          <h4>{{username}}</h4>
          
          <p>
            {{profile.bio}}
          </p>
          
          <button 
            class="btn btn-sm btn-outline-secondary action-btn"
            v-if="user && user.username === username"
            @click="jumpToSettings"
            >
            <i class="ion-gear-a"></i>
            &nbsp;
            Edit Profile Settings
          </button>

          <button 
            class="btn btn-sm action-btn"
            :class="profile.following ? 'btn-secondary' : 'btn-outline-secondary'"
            v-else
            @click="onFollow"
            >
            <i class="ion-plus-round"></i>
            &nbsp;
            {{profile.following ? `Unfollow ${username}` : `Follow ${username}`}}
          </button>
          
        </div>

      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">

      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <a
                class="nav-link" 
                :class="{
                  active: type === 1
                }"
                @click.prevent="switchArticleList(1)"
                >My Articles</a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{
                  active: type === 2
                }"
                @click.prevent="switchArticleList(2)"
                >Favorited Articles</a>
            </li>
          </ul>
        </div>

        <div class="article-preview" v-show="loading">
          Loading articles...
        </div>

        <template v-if="!totalCount">
          <div class="article-preview" v-show="!loading">
            No articles are here... yet.
          </div>
        </template>
        
        <div v-show="!loading">
          <div v-show="type === 1">
            <div class="article-preview" v-for="item in articlesList" :key="item.slug">
              <div class="article-meta">
                <nuxt-link :to="{
                  name: 'Profile',
                  params: {
                    username: item.author.username
                  }
                }"><img :src="item.author.image" :onerror="errorImg" /></nuxt-link>
                <div class="info">
                  <nuxt-link :to="{
                    name: 'Profile',
                    params: {
                      username: item.author.username
                    }
                  }" class="author">{{item.author.username}}</nuxt-link>
                  <span class="date">{{item.createdAt | date('MMM DD, YYYY')}}</span>
                </div>
                <button 
                  @click="onFavorite(item)" 
                  :disabled="item.favoriteDisable" 
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{active: item.favorited}">
                  <i class="ion-heart"></i> {{item.favoritesCount}}
                </button>
              </div>
              <nuxt-link :to="{
                name: 'Article',
                params: {
                  slug: item.slug
                }
              }" class="preview-link">
                <h1>{{item.title}}</h1>
                <p>{{item.description}}</p>
                <span @click="readMore(item.slug)">Read more...</span>
              </nuxt-link>
            </div>
          </div>
          <div v-show="type === 2">
            <div class="article-preview" v-for="item in favoritedArticlesList" :key="item.slug">
              <div class="article-meta">
                <nuxt-link :to="{
                  name: 'Profile',
                  params: {
                    username: item.author.username
                  }
                }"><img :src="item.author.image" :onerror="errorImg" /></nuxt-link>
                <div class="info">
                  <nuxt-link :to="{
                    name: 'Profile',
                    params: {
                      username: item.author.username
                    }
                  }" class="author">{{item.author.username}}</nuxt-link>
                  <span class="date">{{item.createdAt | date('MMM DD, YYYY')}}</span>
                </div>
                <button 
                  @click="onFavorite(item)" 
                  :disabled="item.favoriteDisable" 
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{active: item.favorited}"
                  >
                  <i class="ion-heart"></i> {{item.favoritesCount}}
                </button>
              </div>
              <nuxt-link :to="{
                name: 'Article',
                params: {
                  slug: item.slug
                }
              }" class="preview-link">
                <h1>{{item.title}}</h1>
                <p>{{item.description}}</p>
                <span @click="readMore(item.slug)">Read more...</span>
              </nuxt-link>
            </div>
          </div>
        </div>
        <nav v-if="totalPage > 1">
          <ul class="pagination">
            <li
              class="page-item"
              :class="{
                active: item === page,
              }"
              v-for="item in totalPage"
              :key="item"
            >
              <a
                class="page-link"
                @click.prevent="loadArticleList(type, item)"
                >{{ item }}</a>
            </li>
          </ul>
        </nav>
        
      </div>

    </div>
  </div>

</div>
</template>

<script>
import {getProfile, followUser, unfollowUser} from '@/api/user'
import {getArticles, addFavorite, deleteFavorite} from '@/api/article'
import {mapState} from 'vuex'

export default {
  // middleware: 'authenticated',
  name: 'UserProfile',
  computed: {
    totalPage() {
      return Math.ceil(this.totalCount / this.limit)
    },
    ...mapState(['user'])
  },
  async asyncData({params}) {
    const nullImage = require('@/static/temp.jpg')
    const limit = 5
    let page = 1 
    const {username} = params
    let [profileRes, myArticlesRes] = await Promise.all([
      getProfile(username),
      getArticles({
        author: username,
        limit,
        offset: (page - 1) * limit
      })
    ])
    let profile = profileRes.data.profile
    let articlesList = myArticlesRes.data.articles
    let totalCount = myArticlesRes.data.articlesCount
    // let favoritedArticlesList = favoritedArticlesRes.data.articles
    return {
      username,
      profile,
      articlesList,
      favoritedArticlesList: [],
      type: 1,
      loading: false,
      limit,
      page,
      totalCount,
      followDisable: false,
      errorImg: `this.src="${nullImage}"`
    }
  },
  methods: {
    switchArticleList(type) {
      if(this.loading) return
      this.type = type
      this.loadArticleList(type)
    },
    async loadArticleList(type, page=1) {
      this.loading = true
      if(type === 1) {
        let {data} = await getArticles({
          author: this.username,
          limit: this.limit,
          offset: (page - 1) * this.limit
        })
        this.articlesList = data.articles
        this.totalCount = data.articlesCount
        this.page = page
      } else {
        let {data} = await getArticles({
          favorited: this.username,
          limit: this.limit,
          offset: (page - 1) * this.limit
        })
        this.favoritedArticlesList = data.articles
        this.totalCount = data.articlesCount
        this.page = page
      }
      this.loading = false
    },
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
    readMore(slug) {
      this.$router.push({
        name: 'Article',
        params: {
          slug
        }
      })
    },
    async onFollow() {
      if(!this.user) {
        this.$router.push({
          name: 'Login'
        })
        return
      }
      if(this.followDisable) return 
      this.followDisable = true
      if(this.profile.following) {
        await unfollowUser(this.username)
      } else {
        await followUser(this.username)
      }
      this.followDisable = false
    },
    jumpToSettings() {
      this.$router.push({
        name: 'Settings'
      })
    }
  }
}
</script>

<style scoped>
  .nav-link, .page-link {
    cursor: pointer;
  }
</style>