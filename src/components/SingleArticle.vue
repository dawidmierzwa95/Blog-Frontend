<template>
	<div>
		<div class="post-preview">
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
		<div v-if="editable">
			<span class="icon" @click="$router.push('/admin/article/' + item.slug)">
				<i class="far fa-edit"></i>
			</span>
			<span class="icon"
			      v-if="!isCopywriter"
			      @click="_deleteArticle">
				<i class="far fa-trash-alt"></i>
			</span>
		</div>
	</div>
</template>

<script>
    export default {
        props: {
            item: {},
	        editable: false,
	        isCopywriter: false
        },
        name: 'single-article',
	    methods: {
            _deleteArticle: function () {
                this.$emit('onDelete', this.item);
            }
	    }
    }
</script>