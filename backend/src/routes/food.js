import Router from '@koa/router';
import axios from 'axios';
import authentication from "../middelwares/authentication";

const router = new Router();

router.use(authentication);

const extractImage = imageObject => {
    if (!imageObject || !imageObject.display) return null;

    if (imageObject.display.de) {
        return imageObject.display.de;
    }

    const div = Object.values(imageObject.display);

    if (div.length) {
        return div[0];
    }
}

router.get('/search', async ctx => {
    const data = await axios.get(
        'https://de.openfoodfacts.org/cgi/search.pl?search_terms='+ ctx.request.query.search +'&search_simple=1&action=process&json=1',
        {headers: {'accept-language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7'}}
    );

    const response = data.data.products.map(e => ({
        title: e.product_name_de ?? e.product_name_fr ?? e.product_name_en,
        code: e.code,
        link: 'https://de.openfoodfacts.org/produkt/'+ e.code,
        carbs: e.nutriments.carbohydrates_100g,
        energy: e.nutriments['energy-kcal_100g'],
        image: {
            ingredients: extractImage(e.selected_images?.ingredients),
            front: extractImage(e.selected_images?.front),
            nutrition: extractImage(e.selected_images?.nutrition),
        },
        nutriScore: e.nutrition_grades,
    }));

    ctx.body = response;
});

export default mainRouter => {
    mainRouter.use('/food', router.routes({throw: true}), router.allowedMethods({throw: true}));
}