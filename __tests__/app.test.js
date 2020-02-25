const { server } = require('../src/app.js');
const supergoose = require('./supergoose.js');
const mockRequest = supergoose(server);

let categoryData = {
  name: 'testcategory',
  description: 'a category for testing purposes',
  products: 'widgets',
  complete: false,
};

let productData = {
  name: 'a widget 1',
  description: 'a widget that does something cool',
  category: 'a new category',
  price: 45,
};

describe('CATEGORIES PATHS', () => {

  it('/api/v1/categories should GET all categories - object with count and results', () => {
    return mockRequest
      .get('/api/v1/categories')
      .then(response => {
        let obj = JSON.parse(response.res.text);
        expect(Object.keys(obj)).toEqual(['count', 'results']);
      });
  });

  it('/api/v1/categories should be able to POST and GET data', () => {
    return mockRequest
      .post('/api/v1/categories')
      .type('form')
      .send(categoryData)
      .then(response => {
        return mockRequest
          .get('/api/v1/categories')
          .then(response => {
            let obj = JSON.parse(response.res.text);
            for(let key in categoryData) {
              expect(Object.keys(obj.results[0])).toContain(key);
              expect(Object.values(obj.results[0])).toContain(categoryData[key]);
            }
          });
      });  
  });

  it('/api/v1/categories should GET one category', () => {
    return mockRequest
      .get('/api/v1/categories')
      .then(response => {
        let dataID = response.body.results[0].id;
        return mockRequest
          .get(`/api/v1/categories/${dataID}`)
          .then( response => {
            expect(dataID).toEqual(response.body[0].id);
          });
      });
  });

  it('/api/v1/categories should be able to DELETE data', () => {
    return mockRequest
      .post('/api/v1/categories')
      .type('form')
      .send(categoryData)
      .then(response => {
        return mockRequest
          .get('/api/v1/categories')
          .then( response => {
            let obj = JSON.parse(response.res.text);
            let resultID = obj.results[0].id;
            return mockRequest
              .delete(`/api/v1/categories/${resultID}`)
              .then(response => {
                return mockRequest
                  .get('/api/v1/categories')
                  .then(response => {
                    let resultID2 = JSON.parse(response.res.text).results[0].id;
                    expect(resultID).not.toEqual(resultID2);
                  });
              });
          });
      });
  });

  it('/api/v1/categories DELETE should respond 500 on invalid ID', () => {
    return mockRequest
      .delete('/api/v1/categories/notanID')
      .expect(500);
  });

  it('/api/v1/categories GET should respond 500 on invalid ID', () => {
    return mockRequest
      .get('/api/v1/categories/notanID')
      .expect(500);
  });
});



describe('products PATHS', () => {

  it('/api/v1/products should GET all products - object with count and results', () => {
    return mockRequest
      .get('/api/v1/products')
      .then(response => {
        let obj = JSON.parse(response.res.text);
        expect(Object.keys(obj)).toEqual(['count', 'results']);
      });
  });

  it('/api/v1/products should be able to POST and GET data', () => {
    return mockRequest
      .post('/api/v1/products')
      .type('form')
      .send(productData)
      .then(response => {
        return mockRequest
          .get('/api/v1/products')
          .then(response => {
            let obj = JSON.parse(response.res.text);
            for (let key in productData) {
              expect(Object.keys(obj.results[0])).toContain(key);
              expect(Object.values(obj.results[0])).toContain(productData[key]);
            }
          });
      });
  });

  it('/api/v1/products should GET one product', () => {
    return mockRequest
      .get('/api/v1/products')
      .then(response => {
        let dataID = response.body.results[0].id;
        return mockRequest
          .get(`/api/v1/products/${dataID}`)
          .then(response => {
            expect(dataID).toEqual(response.body[0].id);
          });
      });
  });

  it('/api/v1/products should be able to DELETE data', () => {
    return mockRequest
      .post('/api/v1/products')
      .type('form')
      .send(productData)
      .then(response => {
        return mockRequest
          .get('/api/v1/products')
          .then(response => {
            let obj = JSON.parse(response.res.text);
            let resultID = obj.results[0].id;
            return mockRequest
              .delete(`/api/v1/products/${resultID}`)
              .then(response => {
                return mockRequest
                  .get('/api/v1/products')
                  .then(response => {
                    let resultID2 = JSON.parse(response.res.text).results[0].id;
                    expect(resultID).not.toEqual(resultID2);
                  });
              });
          });
      });
  });

  it('/api/v1/products DELETE should respond 500 on invalid ID', () => {
    return mockRequest
      .delete('/api/v1/products/notanID')
      .expect(500);
  });

  it('/api/v1/products GET should respond 500 on invalid ID', () => {
    return mockRequest
      .get('/api/v1/products/notanID')
      .expect(500);
  });
});



describe('general PATH error testing', () => {
  it('should respond with a 200 on category routes', () => {
    return mockRequest
      .get('/api/v1/categories')
      .expect(200);
  });

  it('should respond with a 200 on product routes', () => {
    return mockRequest
      .get('/api/v1/products')
      .expect(200);
  });

  it('should respond with a 404 on an invalid POST method', () => {
    return mockRequest
      .post('/')
      .expect(404);
  });

  it('should respond with a 404 on an invalid PUT method', () => {
    return mockRequest
      .put('/')
      .expect(404);
  });

  it('should respond with a 404 on an invalid DELETE method', () => {
    return mockRequest
      .delete('/')
      .expect(404);
  });
});