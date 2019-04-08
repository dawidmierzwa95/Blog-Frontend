<template>
	<div>
		<div class="container">
			<div class="row">
				<div class="col-lg-8 col-md-10 mx-auto">
					<div v-if="!busy">
						<single-article
								v-for="item in articles"
								:item="item"
								:editable="true"
								:is-copywriter="isCopywriter"
								v-on:onDelete="deleteArticle(item)">
						</single-article>
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
    import RepositoryFactory from '@/repository/RepositoryFactory';
    import SingleArticle from '@/components/SingleArticle'

    Vue.use(VModal, {dialog: true})

    export default {
        name: 'Home',
	    components: {SingleArticle},
        computed: {
            ...mapState(['user']),
	        isCopywriter () {
                return !this.$store.getters['auth/hasPermission']("ADMIN");
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

                RepositoryFactory.get('articles').all().then(({data} = response) =>
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
                                RepositoryFactory.get('articles').delete(item.slug).then(({data} = response) =>
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
            this.$store.commit('common/setHeader', {
                title: "Admin",
                image: "/img/home-bg.jpg",
                description: "Articles list",
                meta: ""
            });

            this.loadArticles();
        }
    }
</script>

