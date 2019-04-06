<template>
	<div>
		<div class="container">
			<div class="row">
				<div class="col-lg-8 col-md-10 mx-auto">
					<div class="post-preview" v-for="item in articles">
						<router-link :to="{ name: 'adminAddOrEditArticle', params: {'slug': item.slug}}">
							<h2 class="post-title">
								{{item.title}}
							</h2>
						</router-link>
						<p class="post-meta">
							Posted by
							<a href="#">{{item.author}}</a>,
							{{item.createdAt}} —
							<span class="icon">
								<i class="far fa-edit"></i>
							</span>
							<span class="icon">
								<i class="far fa-trash-alt"></i>
							</span>
						</p>
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

    Vue.use(VModal, {dialog: true})

    export default {
        name: 'Home',
        components: {},
        data() {
            return {
                articles: [
                    {
                        title: 'Man must explore, and this is exploration at its greatest',
                        author: 'dawid',
                        createdAt: '',
                        slug: 'test'
                    }
                ]
            }
        },
	    methods: {},
        created() {
            this.$store.commit('setHeader', {
                title: "Admin",
                image: "/img/home-bg.jpg",
                description: "Articles list",
                meta: ""
            });
        }
    }
</script>

