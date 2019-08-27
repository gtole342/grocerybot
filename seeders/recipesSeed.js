const axios = require('axios');
key = '&app_key=5397e2b3678d7d31055dd133c06aef44';
id = '&app_id=d19a147b';
query = 'q=chicken'
url = 'https://api.edamam.com/search?';

axios.get(url+query+id+key).then((response)=>{
  response.data.hits.forEach((each)=>{
    console.log(each.recipe.label)
    console.log(each.recipe.image)
    console.log(each.recipe.label)
    console.log(each.recipe.label)
    console.log(each.recipe.label)

  });
});