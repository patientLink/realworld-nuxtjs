<template>
  <div class="settings-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>
        
        <ul class="error-messages">
          <template v-for="(messages, field) in errors">
            <li 
              v-for="(message, index) in messages"
              :key="message + index"
              >{{ field }} {{ message }}</li>
          </template>
        </ul>

        <form @submit.prevent="submit">
          <fieldset>
              <fieldset class="form-group">
                <input 
                  class="form-control" 
                  type="text" 
                  placeholder="URL of profile picture"
                  v-model="userInfo.image"
                  >
              </fieldset>
              <fieldset class="form-group">
                <input 
                  class="form-control form-control-lg" 
                  type="text" 
                  placeholder="Your Name"
                  v-model="userInfo.username"
                  >
              </fieldset>
              <fieldset class="form-group">
                <textarea 
                  class="form-control form-control-lg" 
                  rows="8" 
                  placeholder="Short bio about you"
                  v-model="userInfo.bio"
                  ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input 
                  class="form-control form-control-lg" 
                  type="email" 
                  placeholder="Email"
                  v-model="userInfo.email"
                  >
              </fieldset>
              <fieldset class="form-group">
                <input 
                  class="form-control form-control-lg" 
                  type="password" 
                  placeholder="Password"
                  v-model="userInfo.password"
                  >
              </fieldset>
              <button 
                class="btn btn-lg btn-primary pull-xs-right"
                >
                Update Settings
              </button>
          </fieldset>
        </form>

        <hr>
        <button 
          class="btn btn-outline-danger"
          @click="logout">
          Or click here to logout.
        </button>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import {updateUser} from '@/api/user'
import {mapState} from 'vuex'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'authenticated',
  name: 'SettingsIndex',
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      userInfo: {
        email: '',
        bio: '',
        image: '',
        username: '',
        password: ''
      },
      errors: {}
    }
  },
  mounted() {
    this.userInfo.email = this.user.email
    this.userInfo.bio = this.user.bio
    this.userInfo.image = this.user.image
    this.userInfo.username = this.user.username
  },
  methods: {
    async submit() {
      let info = Object.assign({}, this.userInfo)
      if(info.password === '') {
        delete(info.password)
      }
      try {
        const {data} = await updateUser({
          user: info
        })
        this.$store.commit('setUser', data.user)
        Cookie.set('user', data.user)
        this.$router.push({
          name: 'Profile',
          params: {
            username: this.user.username
          }
        })
      } catch(err) {
        this.errors = err.response.data.errors
      }
      
    },
    logout() {
      this.$store.commit('setUser', null)
      Cookie.remove('user')
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>