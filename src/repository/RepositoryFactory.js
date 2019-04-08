import ArticlesRepository from './ArticlesRepository'
import TagsRepository from './TagsRepository'
import CommentsRepository from './CommentsRepository'
import AuthRepository from './AuthRepository'

const repositories = {
    articles: ArticlesRepository,
    tags: TagsRepository,
    comments: CommentsRepository,
    auth: AuthRepository
};

export default {
    get: repositoryName => repositories[repositoryName]
}