<template>
	<div>
		<div class="container">
			<div class="row">
				<div class="col-lg-8 col-md-10 mx-auto">
					<div v-if="!busy">
						<div class="post-preview" v-for="item in articles">
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
							<div>
								<span class="icon"
								      @click="$router.push('/admin/article/' + item.slug)">
									<i class="far fa-edit"></i>
								</span>
								<span class="icon"
								          v-if="!isCopywriter"
									      @click="deleteArticle(item)">
									<i class="far fa-trash-alt"></i>
								</span>
							</div>
						</div>
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
    import { mapState, mapGetters } from 'vuex'
    import API from '../../utils/API'

    Vue.use(VModal, {dialog: true})

    export default {
        name: 'Home',
        computed: {
            ...mapState(['user']),
	        isCopywriter () {
                return !this.$store.getters.hasPermission("ADMIN");
	        }
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
            deleteArticle(item)
            {
                this.$modal.show('dialog', {
                    title: 'Delete article',
                    text: 'Are you sure to delete?',
                    buttons: [
                        {
                            title: 'NO'
                        },
                        {
                            title: 'Yes',
                            handler: () => {
                                API.delete('articles/' + item.slug).then(({data} = response) =>
                                {
                                    const {articles} = this;

                                    for(let i = 0; i < articles.length; i++)
                                    {
	                                    if(articles[i].id === item.id)
	                                    {
                                            articles.splice(i, 1);
	                                    }
                                    }

                                    this.$modal.hide('dialog');
                                }).catch(function (error)
                                {
                                    console.log(error);
                                });
                            }
                        }
                    ]
                })
            }
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

