// const Categories = require('../src/models/categories/categories');
let categories = require('../src/models/categories/categories');
let products = require('../src/models/products/products');
require('./supergoose.js');

let perfectCategory = {
  name: 'testcategory',
  description: 'a category for testing purposes',
  products: 'widgets',
  complete: false,
};

const perfectProduct = {
  name: 'a widget 1',
  description: 'a widget that does something cool',
  category: 'a new category',
  price: 45,
};

describe('Products Model (Modular)', () => {

  it('can create() a new product', () => {
    return products.create(perfectProduct)
      .then(record => {
        Object.keys(perfectProduct).forEach(key => {
          expect(record[key]).toEqual(perfectProduct[key]);
        });
      });
  });

  it('can get() a product', () => {
    let obj = perfectProduct;
    obj.name = 'another widget';
    return products.create(obj)
      .then(record => {
        return products.get(record.id)
          .then(product => {
            Object.keys(obj).forEach(key => {
              expect(product[0][key]).toEqual(obj[key]);
            });
          });
      });
  });

  it('can update() a product', () => {
    let obj = perfectProduct;
    let newObj;
    return products.create(obj)
      .then(record => {
        newObj = { name: 'a widget 4', description: 'a fourth widget that does something cool', price: 44, category: '4' };
        return products.update(record._id, newObj)
          .then(updated => {
            Object.keys(newObj).forEach(key => {
              expect(updated[key]).toEqual(newObj[key]);
            });
          });
      });
  });

  it('can delete() a product', () => {
    let obj = perfectProduct;
    return products.create(obj)
      .then(record => {
        return products.delete(record._id)
          .then(deleted => {
            expect(products.get(deleted._id).name).toBeFalsy();
            expect(products.get(deleted._id).description).toBeFalsy();
            expect(products.get(deleted._id)._id).toBeFalsy();
          });
      });
  });

  it('can get() all products', () => {
    return products.get()
      .then(result => {
        expect(result).toBeTruthy();
      });
  });

});

describe('Categories Model (Modular)', () => {

  it('can create() a new category', () => {
    let obj = perfectCategory;
    return categories.create(obj)
      .then(record => {
        Object.keys(obj).forEach(key => {
          expect(record[key]).toEqual(obj[key]);
        });
      });
  });

  it('can get() a category', () => {
    let obj = perfectCategory;
    return categories.create(obj)
      .then(record => {
        return categories.get(record._id)
          .then(category => {
            Object.keys(obj).forEach(key => {
              expect(category[0][key]).toEqual(obj[key]);
            });
          });
      });
  });

  it('can update() a category', () => {
    let obj = perfectCategory;
    return categories.create(obj)
      .then(record => {
        obj.name = 'testing #2';
        return categories.update(record._id, obj)
          .then(updated => {
            Object.keys(obj).forEach(key => {
              expect(updated[key]).toEqual(obj[key]);
            });
          });
      });
  });

  it('can delete() a category', () => {
    let obj = { name: 'categorytest5', description: 'a fifth test of the category model' };
    return categories.create(obj)
      .then(record => {
        return categories.delete(record._id)
          .then(deleted => {
            expect(categories.get(deleted._id).name).toBeFalsy();
            expect(categories.get(deleted._id).description).toBeFalsy();
            expect(categories.get(deleted._id)._id).toBeFalsy();
          });
      });
  });

  it('can get() all categories', () => {
    return categories.get()
      .then(result => {
        expect(result).toBeTruthy();
      });
  });

});
