<template>
  <div>
    <!-- 顶部导航栏 -->
    <nav class="navbar navbar-light">
      <div class="container">
        <nuxt-link
          class="navbar-brand"
          to="/"
        >conduit</nuxt-link>
        <!-- <a class="navbar-brand" href="index.html">conduit</a> -->
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <nuxt-link
              class="nav-link"
              to="/"
              exact
            >Home</nuxt-link>
            <!-- <a class="nav-link active" href="">Home</a> -->
          </li>
          <template v-if="user">
            <li class="nav-item">
              <nuxt-link
                class="nav-link"
                to="/editor"
              ><i class="ion-compose"></i>&nbsp;New Post</nuxt-link>
              <!-- <a class="nav-link" href="">
                <i class="ion-compose"></i>&nbsp;New Post
              </a> -->
            </li>
            <li class="nav-item">
              <nuxt-link
                class="nav-link"
                to="/settings"
              ><i class="ion-gear-a"></i>&nbsp;Settings</nuxt-link>
              <!-- <a class="nav-link" href="">
                <i class="ion-gear-a"></i>&nbsp;Settings
              </a> -->
            </li>
            <li class="nav-item">
              <nuxt-link
                class="nav-link"
                :to="`/profile/${user.username}`"
              ><img class="user-pic" :src="user.image">
                {{user.username}}
              </nuxt-link>
              <!-- <a class="nav-link ng-binding active" ui-sref-active="active" ui-sref="app.profile.main({ username: $ctrl.currentUser.username })" href="#/@patientlink">
                <img ng-src="https://ss1.baidu.com/6ON1bjeh1BF3odCf/it/u=2080484535,4142250847&amp;fm=27&amp;gp=0.jpg" class="user-pic" src="https://ss1.baidu.com/6ON1bjeh1BF3odCf/it/u=2080484535,4142250847&amp;fm=27&amp;gp=0.jpg">
                patientlink
              </a> -->
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <nuxt-link
                class="nav-link"
                to="/login"
              >Sign in</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link
                class="nav-link"
                to="/register"
              >Sign up</nuxt-link>
              <!-- <a class="nav-link" href="">Sign up</a> -->
            </li>
          </template>
          
          
        </ul>
      </div>
    </nav>

    <!-- 子路由 -->
    <nuxt-child></nuxt-child>

    <!-- 底部导航栏 -->
    <footer>
      <div class="container">
        <a href="/" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'LayoutIndex',
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style>

</style>