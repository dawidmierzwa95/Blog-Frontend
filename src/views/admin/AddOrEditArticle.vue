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
							<a href="#">
								{{article.author}}
							</a>
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

							<vue-ckeditor type="classic"
							              v-model="article.content"
							              :disabled="busy"
							              :editors="editors"
							              :upload-adapter="uploadAdapter">
							</vue-ckeditor>
							<p class="help-block text-danger"></p>
						</div>
					</div>
					<div class="control-group">
						<div class="form-group floating-label-form-group controls">
							<label>Photo</label>
							<input @change="onFileChanged($event)"
							       type="file"
							       :disabled="busy"
							       class="form-control"
							       accept="image/png, image/jpeg">
							<div>
								<img :src="article.image" width="200" height="200">
							</div>
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
    import { UploadAdapter } from '../../utils/UploadAdapter'
    import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
    import VueCkeditor from 'vue-ckeditor5'

    export default {
        name: 'AddOrEditArticle',
        components: {
            'vue-ckeditor': VueCkeditor.component
        },
        data() {
            return {
                editing: false,
	            lastAutosave: null,
                editors: {
                    classic: ClassicEditor
                },
                uploadAdapter: function(loader)
                {
                    this.loader = loader;

                    this.upload = async () =>
                    {
                        const result = await new Promise((resolve, reject) =>
                        {
                            this.loader.file.then(data =>
                            {
                                resolve(data);
                            })
                        });

                        let formData = new FormData();
                        formData.append('file', result);

                        return await new UploadAdapter().uploadImage(formData);
                    }

                    this.abort = () => {}
                },
                article: {
                    id: 0,
                    title: "",
                    image: '',
                    content: "",
                    tags: [],
                    slug: "",
	                author: ""
                },
	            imageInstance: null,
	            timer: null,
	            busy: false
            }
        },
        methods: {
            onFileChanged: function(event)
            {
				this.imageInstance = event.target.files[0];
                this.article.image = URL.createObjectURL(this.imageInstance);
            },
            saveArticle: async function()
            {
	            this.doAutoSave();

                let formData = new FormData(),
                    form = this.article;

                formData.append('file', this.imageInstance);

                this.busy = true;

                if(0 === form.id)
                {
                    await API.post('articles', form).then(({data} = response) =>
                    {
                        this.article = {
                            id: data.id,
                            title: data.title,
                            image: data.image,
                            content: data.content,
                            tags: data.tags,
                            slug: data.slug,
                            author: data.author.name
                        };

						this.$router.push('/admin/article/' + data.slug);
	                }).catch(function (error)
	                {
	                    console.log(error);
	                });
                }else{
                    await API.put('articles', form).then(({data} = response) =>
                    {

                    }).catch(function (error)
                    {
                        console.log(error);
                    });
                }

                if(this.imageInstance)
                {
                    const {url} = await new UploadAdapter().uploadImage(formData, this.article.id);

                    this.article.image = url;
                }

                this.busy = false;
            },
            doAutoSave: function()
            {
                this.lastAutosave = new Date();
                this.lastAutosave = this.lastAutosave.getHours() + ":" + this.lastAutosave.getMinutes();

                this.$store.commit('updateLastArticle', {updatedAt: this.lastAutosave, ...this.article});
	        }
        },
        created()
        {
			const {slug} = this.$route.params;

            if(slug) {
                this.busy = true;

                API.get('articles/' + slug).then(({data} = response) =>
                {
                    this.article = {
                        id: data.id,
                        title: data.title,
                        image: data.image,
                        content: data.content,
                        tags: data.tags,
                        slug: data.slug,
	                    author: data.author.name
                    };

                    this.busy = false;
                }).catch(function (error)
                {
                    console.log(error);
                });
            }else{
                this.article.author = this.$store.getters.getLogin
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

