<template>
	<div>
		<div class="container">
			<div class="row">
				<div class="col-lg-8 col-md-10 mx-auto">
					<div v-if="tags.length>0">
						Search by tags:
						<router-link v-for="item in tags" :to="{ name: 'home', params: {'tag': item.name}}">
							#{{item.name}}
						</router-link>
					</div>
					<div v-if="!busy">
						<single-article v-for="item in articles" :item="item"></single-article>
					</div>
					<div v-else-if="busy">
						<i class="fas fa-spinner fa-spin"></i>
					</div>
					<hr>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import RepositoryFactory from '@/repository/RepositoryFactory';
	import SingleArticle from '@/components/SingleArticle'

    export default {
        name: 'Home',
        components: {SingleArticle},
	    data() {
            return {
                articles: [],
	            busy: true,
	            tags: [],
	            currentTag: ""
            }
	    },
	    watch: {
            '$route': function() {
                this.updateHeader();
                this.loadArticles();
            }
	    },
	    methods: {
            loadArticles() {
                this.busy = true;

                RepositoryFactory.get('articles').all(this.currentTag).then(({data} = response) =>
                {
                    this.articles = data;
                    this.busy = false;
                }).catch(function (error)
                {
                    console.log(error);
                });
            },
		    updateHeader() {
                const {tag} = this.$route.params;

                if(tag !== undefined) {
                    this.currentTag = tag;
                }else{
                    this.currentTag = "";
                }

                this.$store.commit('common/setHeader', {
                    title: (this.currentTag ? "#" + this.currentTag : "Clean Blog"),
                    image: "/img/home-bg.jpg",
                    description: "A Blog Theme by Start Bootstrap",
                    meta: ""
                });
		    }
	    },
	    created() {
            RepositoryFactory.get('tags').all().then(({data} = response) =>
            {
                this.tags = data;
            }).catch(function (error)
            {
                console.log(error);
            });

            this.updateHeader();
            this.loadArticles();
	    }
    }
</script>

