const server = require('../../app');
const db = require('../../database/db-config');
const request = require('supertest');

describe('items-router.js', function () {
  beforeEach(async () => {
    await db.seed.run();
  });

  describe('GET /items/keyword_search', function () {
    it('should return json with a 200 http status code', async function () {
      const res = await request(server).get('/items/keyword_search?q=silk');
      expect(res.type).toMatch(/json/i);
      expect(res.status).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return all 14 items that match silk', async function () {
      const res = await request(server).get('/items/keyword_search?q=silk');
      expect(res.body.data.length).toBe(14);
      expect(res.body.pagination.total).toBe(14);
    });

    it('should return only the 2 items that match gigot', async function () {
      const res = await request(server).get('/items/keyword_search?q=gigot');
      const collection_nos = res.body.data.map(
        (item) => item.item_collection_no
      );
      expect(collection_nos.length).toBe(2);
      expect(collection_nos).toContain('T.151 to B-1968');
      expect(collection_nos).toContain('AC3887 82-25-3AB');
    });

    it('should return only the 3 items that match both wedding and dress', async function () {
      const res = await request(server).get(
        '/items/keyword_search?q=wedding%20dress'
      );
      const collection_nos = res.body.data.map(
        (item) => item.item_collection_no
      );
      expect(collection_nos.length).toBe(3);
      expect(collection_nos).toContain('1986.1220a-b');
      expect(collection_nos).toContain('1988.222');
      expect(collection_nos).toContain('2003.127');
    });

    it('should return the 1 item that matches paisley with its colors, materials and image_urls', async function () {
      const res = await request(server).get('/items/keyword_search?q=paisley');
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].item_collection_no).toBe('1963-94-1a,b');
      expect(res.body.data[0].colors).toContain('grey');
      expect(res.body.data[0].colors).toContain('blue');
      expect(res.body.data[0].materials).toContain('silk');
      expect(res.body.data[0].materials).toContain('satin');
      expect(res.body.data[0].image_urls).toBe(null);
    });

    it('should return an empty array with a 200 http status code when no items match', async function () {
      const res = await request(server).get(
        '/items/keyword_search?q=zeppelin'
      );
      expect(res.status).toEqual(200);
      expect(res.body.data.length).toBe(0);
      expect(res.body.pagination.total).toBe(0);
    });

    it('should return items ordered by id descending', async function () {
      const res = await request(server).get(
        '/items/keyword_search?q=Cincinnati'
      );
      const ids = res.body.data.map((item) => item.id);
      expect(ids.length).toBe(5);
      expect(ids[0]).toBeGreaterThan(ids[1]);
      expect(ids[1]).toBeGreaterThan(ids[2]);
      expect(ids[2]).toBeGreaterThan(ids[3]);
      expect(ids[3]).toBeGreaterThan(ids[4]);
    });

    it('should return the first page of 2 items with correct pagination', async function () {
      const res = await request(server).get(
        '/items/keyword_search?q=Cincinnati&limit=2&page=1'
      );
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination).toMatchObject({
        total: 5,
        lastPage: 3,
        prevPage: null,
        nextPage: 2,
        perPage: 2,
        currentPage: 1
      });
    });

    it('should return the last page of 1 item with correct pagination', async function () {
      const res = await request(server).get(
        '/items/keyword_search?q=Cincinnati&limit=2&page=3'
      );
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination).toMatchObject({
        total: 5,
        lastPage: 3,
        prevPage: 2,
        nextPage: null,
        perPage: 2,
        currentPage: 3
      });
    });
  });

  describe('GET /items/:item_id', function () {
    it('should return an object with correct data with a 200 http status code', async function () {
      const item = await db('items')
        .where({ item_collection_no: 'AC3887 82-25-3AB' })
        .first();
      const res = await request(server).get(`/items/${item.id}`);
      expect(res.type).toMatch(/json/i);
      expect(res.status).toEqual(200);
      expect(res.body.garment_title).toBe('Day Dress');
      expect(res.body.begin_year).toBe('1895');
      expect(res.body.colors).toContain('brown');
      expect(res.body.materials).toContain('wool');
    });

    it('should return a 404 http status code when no item has that id', async function () {
      const res = await request(server).get('/items/999999');
      expect(res.status).toEqual(404);
    });
  });
});
