import pprint
import json
import sys
import unicodedata

from robobrowser import RoboBrowser


class TastyScraper():
    def __init__(self):
        self.recipes_list = []
        self.browser = RoboBrowser(user_agent='a python robot')
        self.pp = pprint.PrettyPrinter()

    def extract_recipe(self, url):
        ingredient_dict = {}
        instructions_list = []
        self.browser.open(url)
        recipe_name = self.browser.find(class_='recipe-name')
        if recipe_name:
            ingredients = self.browser.find(class_='ingredients__section')
            if ingredients:
                ingredients = ingredients.find_all('li')
                for each in ingredients:
                    if each.find('section'):
                        amount = ' '.join(each.find('section').string.split())
                        item = ' '.join(each.contents[2].split())
                        ingredient_dict[item] = amount
                    else:
                        ingredient = each.string.split()
                        amount = ingredient[0]
                        item = ' '.join(ingredient[1:])
                        ingredient_dict[item] = amount
                instructions = self.browser.find(class_='prep-steps').find_all('li')
                for each in instructions:
                    instructions_list.append(each.string)
                recipe = {"name": recipe_name.string,
                        "ingredients": ingredient_dict,
                        "instructions": instructions_list}
                self.recipes_list.append(recipe)

    def save_recipes(self, recipes):
        with open('recipes.txt',  'w') as outfile:
            json.dump(recipes, outfile)


if __name__ == "__main__":
    list = ['https://tasty.co/recipe/banh-mi-bowl-with-crispy-tofu',
            'https://tasty.co/recipe/one-pan-parchment-teriyaki-tofu',
            'https://tasty.co/recipe/tofu-egg-breakfast-sandwich',
            'https://tasty.co/recipe/tofu-vegetable-skewers',
            'https://tasty.co/recipe/tofu-tikka-masala',
            'https://tasty.co/recipe/nourishing-rainbow-protein-pot',
            'https://tasty.co/recipe/classic-pad-thai',
            'https://tasty.co/recipe/curry-noodle-soup',
            'https://tasty.co/recipe/protein-packed-buddha-bowl',
            'https://tasty.co/recipe/strawberry-poppy-seed-salad-with-grilled-chicken',
            'https://tasty.co/recipe/greek-chicken-gyro-salad',
            'https://tasty.co/recipe/chicken-cranberry-and-pear-spinach-salad',
            'https://tasty.co/recipe/hot-chicken-chopped-salad',
            'https://tasty.co/recipe/turkey-bacon-guacamole-cucumber-sub',
            'https://tasty.co/recipe/triple-decker-sub',
            'https://tasty.co/recipe/smoked-salmon-cucumber-sub',
            'https://tasty.co/recipe/tomato-mozzarella-cucumber-sub',
            'https://tasty.co/recipe/fajita-parchment-baked-chicken',
            'https://tasty.co/recipe/tomato-pesto-parchment-baked-chicken',
            'https://tasty.co/recipe/garlic-parmesan-parchment-baked-chicken',
            'https://tasty.co/recipe/barbecue-parchment-baked-chicken',
            'https://tasty.co/recipe/rainbow-veggie-salad',
            'https://tasty.co/recipe/zucchini-linguini-with-roasted-shrimp',
            'https://tasty.co/recipe/chicken-pesto-and-zucchini-pasta',
            'https://tasty.co/recipe/zucchini-shrimp-scampi',
            'https://tasty.co/recipe/sheet-pan-steak-fajitas',
            'https://tasty.co/recipe/sheet-pan-jambalaya',
            'https://tasty.co/recipe/tuscan-white-beans',
            'https://tasty.co/recipe/sweet-potato-pizza-bites',
            'https://tasty.co/recipe/sweet-potato-pizza-bites',]
    app = TastyScraper()
    for each in list:
        app.extract_recipe(each)
    app.save_recipes(app.recipes_list)
