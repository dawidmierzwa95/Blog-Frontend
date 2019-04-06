<template>
	<div>
		<div class="container">
			<div class="row">
				<div class="col-lg-8 col-md-10 mx-auto">
					<div class="post-preview">
						<a href="#">
							<h2 class="post-title">
								{{ article.title ? article.title : 'No title' }}
							</h2>
						</a>
						<p class="post-meta">
							Author
							<a href="#">dawid</a>
						</p>
					</div>
					<hr>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-8 col-md-10 mx-auto">
					<div class="control-group">
						<div class="form-group floating-label-form-group controls">
							<label>Title</label>
							<input v-model="article.title"
							       :disabled="busy"
							       type="text"
							       class="form-control"
							       placeholder="Title"
							       id="name"
							       required>
							<p class="help-block text-danger"></p>
						</div>
					</div>
					<div class="control-group">
						<div class="form-group floating-label-form-group controls">
							<label>Content</label>
							<textarea v-model="article.content"
							          :disabled="busy"
							          rows="5"
							          class="form-control"
							          placeholder="Content"
							          id="message"
							          required></textarea>
							<p class="help-block text-danger"></p>
						</div>
					</div>
					<div class="control-group">
						<div class="form-group floating-label-form-group controls">
							<label>Photo</label>
							<input type="file"
							       :disabled="busy"
							       class="form-control"
							       ref="photo"
							       accept="image/png, image/jpeg">
						</div>
					</div>
					<br/>
					<div class="clearfix">
						<div class="modal-tip" v-if="lastAutosave">
							Last autosave: {{lastAutosave}}
						</div>
						<span class="btn btn-primary float-right"
						      @click="saveArticle"
						      v-if="!busy">
							Save
						</span>
						<span class="btn btn-primary float-right"
						      v-else-if="busy">
							<i class="fas fa-spinner fa-spin"></i>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import Vue from 'vue'
    import API from '../../utils/API'

    export default {
        name: 'AddOrEditArticle',
        components: {},
        data() {
            return {
                editing: false,
	            lastAutosave: null,
                article: {
                    uuid: "",
                    title: "",
		            content: "",
                    photo: "",
	                id: 0
	            },
	            timer: null,
	            busy: false
            }
        },
        methods: {
            saveArticle: function() {
                let photo = this.$refs.photo,
	                file = new FormData();

                file.append('file', photo);

                this.article.photo = file;
                this.busy = true;

                API.post('article/add', this.article).then((response) =>
                {
                    this.$store.commit('updateLastArticle', null);
                    this.lastAutosave = null;
                    this.busy = false;

                    this.$router.push({ path: 'article', params: {slug:'test'} })
                }).catch(function (error)
                {
	                console.log(error);
                });
            },
            doAutoSave: function() {
                this.lastAutosave = new Date();
                this.lastAutosave = this.lastAutosave.getHours() + ":" + this.lastAutosave.getMinutes();

                this.$store.commit('updateLastArticle', {
                    title: this.article.title,
                    content: this.article.content,
	                updatedAt: this.lastAutosave
                });
	        }
        },
        created() {
			const {slug} = this.$route.params;

            if(slug) {
                this.busy = true;

                API.get('articles/' + slug).then(({data} = response) =>
                {
                    this.article = {
                        id: data.id,
                        title: data.title,
                        image: '/img/post-bg.jpg',
                        content: data.content,
                        tags: data.tags,
                        slug: data.slug
                    };

                    this.busy = false;
                }).catch(function (error)
                {
                    console.log(error);
                });
            }

            this.editing = !!(slug);

            this.$store.commit('setHeader', {
                title: "Admin",
                image: "/img/home-bg.jpg",
                description: (this.editing ? "Edit article" : "New article"),
                meta: ""
            });

            this.lastAutosave = this.$store.getters.getLastSavedArticle;

	        if(this.lastAutosave) {
                this.doAutoSave();
	        }

            this.timer = setInterval(() => this.doAutoSave(), 5000);
        },
	    beforeDestroyed() {
            clearInterval(this.timer);
	    }
    }
</script>

