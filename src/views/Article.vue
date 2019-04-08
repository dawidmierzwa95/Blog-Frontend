<template>
	<div>
		<article>
			<div class="container">
				<div class="row">
					<div class="col-lg-8 col-md-10 mx-auto">
						<p v-html="article.content"></p>
					</div>
				</div>
			</div>
		</article>
		<div class="container">
			<div class="row">
				<div class="col-lg-8 col-md-10 mx-auto">
					<div v-if="!busy" class="post-preview" v-for="item in article.tags">
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
						<div class="post-preview" :style="{'opacity': 2 === item.status ? 0.3 : 1.0}">
							<a href="#">
								<h3 class="post-subtitle">
									{{item.content}}
								</h3>
							</a>
							<p class="post-meta">
								Posted by
								<a href="#">{{item.author.full_name}}</a>,
								{{item.created_at}}
							</p>
							<div>
								<span class="icon"
								      v-if="1 === item.status && user.id === item.creator_id"
								      @click="editComment(item)">
									<i class="far fa-edit"></i>
								</span>
								<span class="icon"
								      v-if="1 === item.status && user.id === item.creator_id"
								      @click="setCommentStatus(item, 2)">
									<i class="far fa-trash-alt"></i>
								</span>
								<span class="icon"
								      v-if="2 === item.status && $store.getters['auth/hasPermission']('ADMIN')"
								      @click="setCommentStatus(item, 1)">
									<i class="fas fa-redo"></i>
								</span>
							</div>
						</div>
						<hr>
					</div>
				</div>
			</div>
			<div class="row" v-if="$store.getters['auth/hasPermission']('USER')">
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
						<textarea v-model="newComment.content"
						          :disabled="commentBusy"
						          rows="5"
						          class="form-control"
						          placeholder="Content"
						          id="message"
						          required></textarea>
						<p class="help-block text-danger"></p>
					</div>
				</div>
				<br/>
				<div class="clearfix">
					<span class="btn btn-primary float-right" v-if="!commentBusy" @click="saveComment">
						Save
					</span>
					<span class="btn btn-primary float-right" v-if="commentBusy">
						<i class="fas fa-spinner fa-spin"></i>
					</span>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
	import Vue from 'vue'
    import VModal from 'vue-js-modal'
	import { mapState } from 'vuex'
    import RepositoryFactory from '@/repository/RepositoryFactory';

    Vue.use(VModal)

    export default {
        name: 'Article',
        components: {},
	    computed: {
            ...mapState('auth', {
                user: state => state.user
            })
	    },
	    data() {
            return {
	            article: {
                    title: '',
		            image: '',
                    content: '',
		            meta: '',
		            tags: []
	            },
                comments: [],
	            newComment: {
	                content: '',
		            id: 0
	            },
	            busy: false,
	            commentsBusy: false,
	            commentBusy: false
            }
	    },
	    methods: {
            addComment: function()
            {
                this.newComment = {
                    content: "",
                    id: 0
                };

                this.$modal.show('new-comment');
            },
            editComment: function({content, id} = comment)
            {
                this.newComment = {
                    content: content,
	                id: id
                };

                this.$modal.show('new-comment');
            },
            saveComment: async function()
            {
                const form = this.newComment;

                this.commentBusy = true;

		        if(0 === form.id)
		        {
                    await RepositoryFactory.get('comments').create(this.article.id, form).then(({data} = response) =>
                    {
                        this.comments.push(data);
                    }).catch(function (error)
                    {
                        console.log(error);
                    });
		        }else{
                    await RepositoryFactory.get('comments').update(form).then(({data} = response) =>
                    {
                        if(data.content) {
                            this.comments.find(comment => comment.id === form.id).content = data.content;
                        }
                    }).catch(function (error)
                    {
                        console.log(error);
                    });
		        }

                this.commentBusy = false;
                this.$modal.hide('new-comment');
		    },
		    getComments: function(articleId)
		    {
                RepositoryFactory.get('comments').all(articleId).then(({data} = response) =>
                {
                    this.comments = data;
                    this.commentsBusy = false;
                }).catch(function (error)
                {
                    console.log(error);
                });
		    },
		    setCommentStatus: function(comment, status)
		    {
                this.$modal.show('dialog', {
                    title: (2 === status ? 'Delete' : 'Restore') + ' comment',
                    text: 'Are you sure to ' + (2 === status ? 'delete' : 'restore') + '?',
                    buttons: [
                        {
                            title: 'NO'
                        },
                        {
                            title: 'Yes',
                            handler: () => {
                                RepositoryFactory.get('comments').setStatus(comment.id, {status: status}).then(({data} = response) =>
                                {
									comment.status = status;

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
	    created()
	    {
            const {slug} = this.$route.params;

            this.busy = true;
            this.commentsBusy = true;

            this.$store.commit('common/setHeader', {
                title: "Loading...",
                image: "/img/post-bg.jpg",
                description: "",
                meta: ""
            });

            RepositoryFactory.get('articles').get(slug).then(({data} = response) =>
            {
                this.$store.commit('common/setHeader', {
                    title: data.title,
                    image: data.image,
                    description: "Posted by "+ data.author.full_name +", " + data.created_at,
                });

                this.article = {
                    id: data.id,
                    title: data.title,
                    image: data.image,
                    content: data.content,
                    tags: data.tags,
	                slug: data.slug
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

