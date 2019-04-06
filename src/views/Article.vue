<template>
	<div>
		<article>
			<div class="container">
				<div class="row">
					<div class="col-lg-8 col-md-10 mx-auto">
						<p v-html="post.content"></p>
					</div>
				</div>
			</div>
		</article>
		<div class="container">
			<div class="row">
				<div class="col-lg-8 col-md-10 mx-auto">
					<div v-if="!busy" class="post-preview" v-for="item in post.tags">
						<router-link :to="{ name: 'home', params: {'tag': item.name}}">
							#{{item.name}}
						</router-link>
						<p class="post-meta" v-if="item.author">
							Posted by
							<a href="#">{{item.author.full_name}}</a>,
							{{item.created_at}}
						</p>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-8 col-md-10 mx-auto">
					<div class="post-preview" v-if="!commentsBusy">
						<a href="#">
							<h2 class="post-title">
								Comments ({{comments.length}})
							</h2>
						</a>
					</div>
					<div class="post-preview" v-if="commentsBusy">
						<a href="#">
							<h2 class="post-title">
								Loading comments...
							</h2>
						</a>
					</div>
					<hr>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-8 col-md-10 mx-auto" v-for="item in comments">
					<div>
						<div class="post-preview">
							<a href="#">
								<h3 class="post-subtitle">
									{{item.content}}
								</h3>
							</a>
							<p class="post-meta">
								Posted by
								<a href="#">{{item.author.full_name}}</a>,
								{{item.created_at}} —
								<span class="icon">
									<i class="far fa-edit"></i>
								</span>
								<span class="icon">
									<i class="far fa-trash-alt"></i>
								</span>
								<span class="icon">
									<i class="fas fa-redo"></i>
								</span>
							</p>
						</div>
						<hr>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-8 col-md-10 mx-auto">
					<div class="clearfix">
						<span class="btn btn-primary float-right" @click="addComment">
						Add comment
						</span>
					</div>
				</div>
			</div>
		</div>
		<modal name="new-comment">
			<div class="modal-container">
				<div class="control-group">
					<div class="form-group floating-label-form-group controls">
						<label>Content</label>
						<textarea rows="5" class="form-control" placeholder="Content" id="message" required data-validation-required-message="Please enter a message."></textarea>
						<p class="help-block text-danger"></p>
					</div>
				</div>
				<br/>
				<div class="clearfix">
					<span class="btn btn-primary float-right" @click="sendNewComment">
					Send
					</span>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
	import Vue from 'vue'
    import VModal from 'vue-js-modal'
    import API from '../utils/API'

    Vue.use(VModal, {})

    export default {
        name: 'Post',
        components: {},
	    data() {
            return {
	            post: {
                    title: '',
		            image: '',
                    content: '',
		            meta: '',
		            tags: []
	            },
                comments: [],
	            newComment: {
	                content: ''
	            },
	            busy: false,
	            commentsBusy: false
            }
	    },
	    methods: {
            addComment: function()
            {
                this.$modal.show('new-comment');
            },
		    sendNewComment: function()
		    {
                this.$modal.hide('new-comment');
		    },
		    getComments: function(articleId)
		    {
                API.get('comments/' + articleId).then(({data} = response) =>
                {
                    this.comments = data;
                    this.commentsBusy = false;
                }).catch(function (error)
                {
                    console.log(error);
                });
		    }
	    },
	    created()
	    {
            const {slug} = this.$route.params;

            this.busy = true;
            this.commentsBusy = true;

            this.$store.commit('setHeader', {
                title: "Loading...",
                image: "/img/post-bg.jpg",
                description: "",
                meta: ""
            });

            API.get('articles/' + slug).then(({data} = response) =>
            {
                this.$store.commit('setHeader', {
                    title: data.title,
                    image: "/img/post-bg.jpg",
                    description: "Posted by "+ data.author.full_name +", " + data.created_at,
                });

                this.post = {
                    title: data.title,
                    image: '/img/post-bg.jpg',
                    content: data.content,
                    tags: data.tags
                };

                this.getComments(data.id);
                this.busy = false;
            }).catch(function (error)
            {
                console.log(error);
            });
	    }
    }
</script>

