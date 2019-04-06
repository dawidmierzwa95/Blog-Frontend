<template>
	<div>
		<div class="container">
			<div class="row">
				<div class="col-lg-8 col-md-10 mx-auto">
					<div v-if="!busy" class="post-preview" v-for="item in articles">
						<router-link :to="{ name: 'adminAddOrEditArticle', params: {'slug': item.slug}}">
							<h2 class="post-title">
								{{item.title}}
							</h2>
						</router-link>
						<p class="post-meta" v-if="item.author">
							Posted by
							<a href="#">{{item.author.full_name}}</a>,
							{{item.created_at}}
						</p>
					</div>
					<div v-else-if="busy">
						<i class="fas fa-spinner fa-spin"></i>
					</div>
					<hr>
					<!-- Pager -->
					<router-link class="btn btn-primary float-right" :to="{ name: 'adminAddOrEditArticle'}">
						New article
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
    import axios from 'axios'
    import VModal from 'vue-js-modal'
    import { mapState } from 'vuex'
    import API from '../../utils/API'

    Vue.use(VModal, {dialog: true})

    export default {
        name: 'Home',
        computed: {
            ...mapState(['user'])
        },
        data() {
            return {
                articles: [],
                busy: true
            }
        },
	    methods: {
            loadArticles()
            {
                this.busy = true;

                API.get('articles/all').then(({data} = response) =>
                {
                    this.articles = data;
                    this.busy = false;
                }).catch(function (error)
                {
                    console.log(error);
                });
            },
	    },
        created() {
            this.$store.commit('setHeader', {
                title: "Admin",
                image: "/img/home-bg.jpg",
                description: "Articles list",
                meta: ""
            });

            this.loadArticles();
        }
    }
</script>

