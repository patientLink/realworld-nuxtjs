<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">Conduit </h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link 
                  class="nav-link" 
                  :class="{
                    active: tab === 'your_feed'
                  }"
                  exact
                  :to="{
                    name: 'Home',
                    query: {
                      tab: 'your_feed'
                    }
                  }">Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link" 
                  :class="{
                    active: tab === 'global_feed'
                  }"
                  exact
                  :to="{
                    name: 'Home',
                    query: {
                      tab: 'global_feed'
                    }
                  }">Global Feed</nuxt-link>
              </li>
              <li 
                class="nav-item" 
                v-if="tag"
                >
                <nuxt-link 
                  class="nav-link" 
                  :class="{
                    active: tab === 'tag'
                  }"
                  exact
                  :to="{
                    name: 'Home',
                    query: {
                      tab: 'tag',
                      tag: tag
                    }
                  }">#{{tag}}</nuxt-link>
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'Profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img 
                  :src="article.author.image" 
                  :onerror="errorImg"
                  />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'Profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM D, YYYY')}}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                :disabled="article.favoriteDisable"
                @click="onFavorite(article)"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'Article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{
                  active: item === page,
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'Home',
                    query: {
                      page: item,
                      tag: $route.query.tag,
                      tab: tab
                    },
                  }"
                  >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="item in tags" 
                :key="item"
                :to="{
                  name: 'Home',
                  query: {
                    tag: item,
                    tab: 'tag'
                  }
                }" 
                class="tag-pill tag-default"
                >{{item}}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getFeedArticles, addFavorite, deleteFavorite} from "@/api/article";
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'

export default {
  name: "HomeIndex",
  watchQuery: ["page", "tag", "tab"],
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    }
  },
  async asyncData({ query, store }) {
    const nullImage = require('@/static/temp.jpg')
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const {tag, tab='global_feed'} = query
    const loadArticles = store.state.user && tab === 'your_feed' ? getFeedArticles : getArticles
    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ])

    const {articles, articlesCount} = articleRes.data
    const {tags} = tagRes.data

    articles.forEach(article => article.favoriteDisable = false)

    return {
      articles,
      articlesCount,
      tags,
      limit,
      page,
      tag,
      tab,
      errorImg: `this.src="${nullImage}"`
    };
  },
  methods: {
    async onFavorite(article) {
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
    }
  }
};
</script>

<style>
</style>