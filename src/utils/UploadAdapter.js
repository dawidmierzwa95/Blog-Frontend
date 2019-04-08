import RepositoryFactory from '@/repository/RepositoryFactory';

export class UploadAdapter
{
    uploadImage(formData, articleId = 0)
    {
        return new Promise((resolve, reject) => {
            RepositoryFactory.get('articles').upload(formData, articleId)
                .then(({data} = response) => resolve(data))
                .catch((error) => reject(error));
        });
    }
}