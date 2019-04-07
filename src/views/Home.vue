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
						<div class="post-preview" v-for="item in articles">
							<router-link :to="{ name: 'article', params: {'slug': item.slug}}">
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
    import API from '../utils/API'

    export default {
        name: 'Home',
        components: {},
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

                API.get('articles/all' + (this.currentTag ? "/" + this.currentTag : "")).then(({data} = response) =>
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

                this.$store.commit('setHeader', {
                    title: (this.currentTag ? "#" + this.currentTag : "Clean Blog"),
                    image: "/img/home-bg.jpg",
                    description: "A Blog Theme by Start Bootstrap",
                    meta: ""
                });
		    }
	    },
	    created() {
            API.get('tags/all').then(({data} = response) =>
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

