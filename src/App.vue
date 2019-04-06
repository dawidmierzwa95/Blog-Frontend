<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
      <div class="container">
        <router-link class="navbar-brand" :to="{ name: 'home'}">
          Blog
        </router-link>
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          Menu
          <i class="fas fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'home'}">
                Home
              </router-link>
            </li>
            <li class="nav-item" v-if="!isLogged">
              <a class="nav-link" href="#" @click="$modal.show('login-form');">
                Login
              </a>
            </li>
            <li class="nav-item" v-if="!isLogged">
              <a class="nav-link" href="#" @click="$modal.show('register-form');">
                Register
              </a>
            </li>
            <li class="nav-item" v-if="isLogged">
              <a class="nav-link" href="#">
                Logged as @{{user.name}}
              </a>
            </li>
            <li class="nav-item" v-if="$store.getters.hasPermission('ADMIN|COPYWRITER')">
              <router-link class="nav-link" :to="{ name: 'adminHome'}">
                Admin
              </router-link>
            </li>
            <li class="nav-item" v-if="isLogged">
              <a href="#" class="nav-link" @click="logOut">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Page Header -->
    <header class="masthead" :style="{'background-image': 'url('+ header.image +')'}">
      <div class="overlay"></div>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">
            <div class="site-heading">
              <h1>
                {{header.title}}
              </h1>
              <span class="subheading">
                {{header.description}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <router-view/>
    <hr>

    <!-- Footer -->
    <footer>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">
            <ul class="list-inline text-center">
              <li class="list-inline-item">
                <a href="#">
                <span class="fa-stack fa-lg">
                  <i class="fas fa-circle fa-stack-2x"></i>
                  <i class="fab fa-twitter fa-stack-1x fa-inverse"></i>
                </span>
                </a>
              </li>
              <li class="list-inline-item">
                <a href="#">
                <span class="fa-stack fa-lg">
                  <i class="fas fa-circle fa-stack-2x"></i>
                  <i class="fab fa-facebook-f fa-stack-1x fa-inverse"></i>
                </span>
                </a>
              </li>
              <li class="list-inline-item">
                <a href="#">
                <span class="fa-stack fa-lg">
                  <i class="fas fa-circle fa-stack-2x"></i>
                  <i class="fab fa-github fa-stack-1x fa-inverse"></i>
                </span>
                </a>
              </li>
            </ul>
            <p class="copyright text-muted">Copyright &copy; Your Website 2019</p>
          </div>
        </div>
      </div>
    </footer>
    <modal name="login-form">
      <div class="modal-container">
        <div class="control-group">
          <div class="form-group floating-label-form-group controls">
            <label>Email</label>
            <input v-model="loginForm.email"
                   :disabled="busy"
                   ref="email"
                   type="text"
                   class="form-control"
                   placeholder="Email"
                   id="email"
                   required>
            <p class="help-block text-danger" ref="emailErrors">

            </p>
          </div>
        </div>
        <div class="control-group">
          <div class="form-group floating-label-form-group controls">
            <label>Password</label>
            <input v-model="loginForm.password"
                       :disabled="busy"
                       ref="password"
                       type="password"
                       class="form-control"
                       placeholder="Password"
                       id="password"
                       required>
            <p class="help-block text-danger" ref="passwordErrors">
            </p>
          </div>
        </div>
        <br/>
        <div class="clearfix">
          <span class="btn btn-primary float-right" v-if="!busy" @click="logIn">
            Login
          </span>
          <span class="btn btn-primary float-right" v-else-if="busy">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
        </div>
      </div>
    </modal>
    <modal name="register-form" :height="'auto'" :scrollable="true">
      <div class="modal-container">
        <div class="control-group">
          <div class="form-group floating-label-form-group controls">
            <label>Name</label>
            <input v-model="registerForm.full_name"
                   :disabled="busy"
                   ref="email"
                   type="text"
                   class="form-control"
                   placeholder="Name"
                   required>
            <p class="help-block text-danger" ref="emailErrors">

            </p>
          </div>
        </div>
        <div class="control-group">
          <div class="form-group floating-label-form-group controls">
            <label>Login</label>
            <input v-model="registerForm.name"
                   :disabled="busy"
                   ref="email"
                   type="text"
                   class="form-control"
                   placeholder="Login"
                   required>
            <p class="help-block text-danger" ref="emailErrors">

            </p>
          </div>
        </div>
        <div class="control-group">
          <div class="form-group floating-label-form-group controls">
            <label>Email</label>
            <input v-model="registerForm.email"
                   :disabled="busy"
                   ref="email"
                   type="text"
                   class="form-control"
                   placeholder="Email"
                   required>
            <p class="help-block text-danger" ref="emailErrors">

            </p>
          </div>
        </div>
        <div class="control-group">
          <div class="form-group floating-label-form-group controls">
            <label>Password</label>
            <input v-model="registerForm.password"
                   :disabled="busy"
                   ref="password"
                   type="password"
                   class="form-control"
                   placeholder="Password"
                   required>
            <p class="help-block text-danger" ref="passwordErrors">
            </p>
          </div>
        </div>
        <br/>
        <div class="clearfix">
          <span class="btn btn-primary float-right" v-if="!busy" @click="register">
            Login
          </span>
          <span class="btn btn-primary float-right" v-else-if="busy">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
        </div>
      </div>
    </modal>
    <v-dialog/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import API from './utils/API'
  import Validator from './utils/API'
  import VModal from 'vue-js-modal'
  import { mapState } from 'vuex'

  Vue.use(VModal, { dialog: true })

  export default {
      name: 'app',
      computed: {
          ...mapState(['header', 'isLogged', 'user'])
      },
      data() {
          return {
              busy: false,
              loginForm: {
                  email: "",
                  password: ""
              },
              registerForm: {
                  name: "",
                  full_name: "",
                  email: "",
                  password: ""
              }
          }
      },
      methods: {
          logIn() {
              this.busy = true;

              API.post('/user/login', this.loginForm).then(({data} = response) =>
              {
                  if(data) {
                      this.busy = false;

                      this.$store.commit('setUser', data.user);
                      this.$modal.hide('login-form');
                  }
              }).catch(function (error)
              {
                  console.log(error);
              });
          },
          register() {
              this.busy = true;

              API.post('/user/register', this.registerForm).then(({data} = response) =>
              {
                  if(data) {
                      this.busy = false;

                      if(typeof data.errors !== undefined) {
                          this.$store.commit('setUser', data.user);
                          this.$modal.hide('register-form');
                      }
                  }
              }).catch(function (error)
              {
                  console.log(error);
              });
          },
          logOut() {
              this.$store.commit('clearSession');
              this.$router.push('/');
          }
      },
      created() {
          let js = [
                  '/vendor/jquery/jquery.min.js',
                  '/vendor/bootstrap/js/bootstrap.bundle.min.js',
                  '/js/clean-blog.min.js'
              ],
              css = [
                  '/vendor/bootstrap/css/bootstrap.min.css',
                  '/vendor/fontawesome-free/css/all.min.css',
                  'https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic',
                  'https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800',
                  '/css/clean-blog.min.css'
              ],
              i = 0,
              currentFile = null;

          for(; i < js.length; i++) {
              currentFile = document.createElement('script');

              currentFile.setAttribute('src', js[i]);
              document.head.appendChild(currentFile);
          }

          i = 0;

          for(; i < css.length; i++) {
              currentFile = document.createElement('link');

              currentFile.setAttribute('type', 'text/css');
              currentFile.setAttribute('rel', 'stylesheet');
              currentFile.setAttribute('href', css[i]);
              document.head.appendChild(currentFile);
          }
      }
  }
</script>
<style>
  span.icon {
    margin-right: 10px;
    cursor: pointer;
  }
  span.btn-primary {
    cursor: pointer;
  }
  .modal-container {
    padding: 0px 20px;
  }
  .modal-tip {
    position: absolute;
    font-size: 13px;
  }
</style>
