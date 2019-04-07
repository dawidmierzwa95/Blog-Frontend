import API from '../utils/API'

export class UploadAdapter
{
    uploadImage(formData, articleId = 0)
    {
        const config = {headers: { 'Content-Type': 'multipart/form-data' }};

        return new Promise((resolve, reject) => {
            API.post('articles/image' + (articleId ? '/' + articleId : ''), formData, config)
                .then(({data} = response) => resolve(data))
                .catch((error) => reject(error));
        });
    }
}