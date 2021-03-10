<template>
  <div class="article-meta">
    <nuxt-link :to="{
      name: 'Profile',
      params: {
        username: article.author.username
      }
    }">
      <img :src="article.author.image" :onerror="errorImg"/>
    </nuxt-link>
    <div class="info">
      <nuxt-link :to="{
        name: 'Profile',
        params: {
          username: article.author.username
        }
      }" class="author">{{article.author.username}}</nuxt-link>
      <span class="date">{{article.createdAt | date('MMM D, YYYY')}}</span>
    </div>
    <template v-if="article.author.username !== username">
      <button 
        class="btn btn-sm"
        :class="article.author.following ? 'btn-secondary' : 'btn-outline-secondary'"
        @click="()=>{$emit('onFollow')}"
        :disabled="followDisable"
        >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{article.author.following ? `Unfollow ${article.author.username}` : `Follow ${article.author.username}`}}
        <!-- Follow {{article.author.username}}  -->
        <!-- <span class="counter">(10)</span> -->
      </button>
      &nbsp;&nbsp;
      <button 
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited
        }"
        @click="()=>{$emit('onFavorite')}"
        :disabled="article.favoriteDisable"
        >
        <i class="ion-heart"></i>
        &nbsp;
        {{article.favorited ? 'Unfavorite Article' : 'Favorite Article'}} <span class="counter">({{article.favoritesCount}})</span>
      </button>
    </template>
    <template v-else>
      <nuxt-link class="btn btn-outline-secondary btn-sm"  :to="{
        name: 'Editor',
        query: {
          slug: article.slug
        }
      }">
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>
      <button class="btn btn-outline-danger btn-sm" @click="()=>{$emit('onDeleteArticle')}">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
  </div>
</template>

<script>
// import {addFavorite, deleteFavorite} from '@/api/article'
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    },
    followDisable: {
      type: Boolean,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  data() {
    const nullImage = require('@/static/temp.jpg')
    return {
      errorImg: `this.src="${nullImage}"`
    }
  }
}
</script>

<style>

</style>