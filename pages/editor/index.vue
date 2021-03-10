<template>
  <div class="editor-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-10 offset-md-1 col-xs-12">
        <form @submit.prevent="onSubmit">
          <fieldset>
            <fieldset class="form-group">
                <input 
                  type="text" 
                  class="form-control form-control-lg" 
                  placeholder="Article Title"
                  v-model="article.title"
                  >
            </fieldset>
            <fieldset class="form-group">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="What's this article about?"
                  v-model="article.description"
                  >
            </fieldset>
            <fieldset class="form-group">
                <textarea 
                  class="form-control" 
                  rows="8" 
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                  ></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Enter tags"
                  
                  ><div class="tag-list"></div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary">
                Publish Article
            </button>
          </fieldset>
        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import {createArticle, getArticle, updateArticle} from '@/api/article'

export default {
  middleware: 'authenticated',
  name: 'EditorIndex',
  data() {
    return {
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      }
    }
  },
  async mounted() {
    if(this.$route.query && this.$route.query.slug) {
      let {data} = await getArticle(this.$route.query.slug)
      this.article = data && data.article
    }
  },
  methods: {
    async onSubmit() {
      if(this.article.slug && this.article.createdAt) {
        let {data} = await updateArticle(this.article.slug, {
          article: this.article
        })

        this.$router.push({
          name: 'Article',
          params: {
            slug: data.article.slug
          }
        })
      } else {
        let {data} = await createArticle({
          article: this.article
        })

        this.$router.push({
          name: 'Article',
          params: {
            slug: data.article.slug
          }
        })
      }
    }
  }
}
</script>

<style>

</style>