describe('BangularCollection', function() {
  var BangularCollection, collection;

  beforeEach(function() {
    module('Bangular');

    inject(function(_BangularCollection_) {
      BangularCollection = _BangularCollection_;
    });

    collection = new BangularCollection();
  });

  it('should have BangularCollection as the constructor name', function(){
    expect(collection.constructor.name).toBe('BangularCollection');
  });

  it('should create $models object', function() {
    expect(collection.$models).toBeDefined();
  });

  it('should be the same array as models', function() {
    var model;

    expect(collection.$models.length).toBe(0);

    model = new collection.model();

    collection.add(model);

    expect(collection.$models.length).toBe(1);
    expect(collection.$models[0]).toBe(model);
  });

  describe('$status', function() {
    var $httpBackend;

    beforeEach(inject(function(_$httpBackend_){
      $httpBackend = _$httpBackend_;
    }));

    it('should create $status object', function() {
      expect(collection.$status).toBeDefined();
    });

    it('should default all status to false', function() {
      expect(collection.$status.deleting).toBe(false);
      expect(collection.$status.loading).toBe(false);
      expect(collection.$status.saving).toBe(false);
      expect(collection.$status.syncing).toBe(false);
    });

    describe('syncing sould be updated', function(){
      it('should set on GET request', function() {
        $httpBackend.when('GET', '/get').respond({});

        collection.fetch({url: '/get'});

        expect(collection.$status.syncing).toBe(true);

        $httpBackend.flush();
      });

      it('should set on POST request', function() {
        $httpBackend.when('POST', '/post').respond({});

        collection.create({hello: 'world'}, {url: '/post'});

        expect(collection.$status.syncing).toBe(true);

        $httpBackend.flush();
      });

      it('should set when a model on the collection fetches', function() {
        var model = new collection.model();

        collection.add(model);

        $httpBackend.when('GET', '/get').respond({});

        model.fetch({url: '/get'});

        expect(collection.$status.syncing).toBe(true);

        $httpBackend.flush();
      });

      it('should set when a model on the collection POST', function() {
        var model = new collection.model();

        collection.url = '/post';

        collection.add(model);

        $httpBackend.when('POST', '/post').respond({});

        model.save();

        expect(collection.$status.syncing).toBe(true);

        $httpBackend.flush();
      });
    });

    describe('loading should be updated', function() {
      it('should set on GET request', function() {
        $httpBackend.when('GET', '/get').respond({});

        collection.fetch({url: '/get'});

        expect(collection.$status.loading).toBe(true);

        $httpBackend.flush();
      });

      it('should not set on POST request', function() {
        $httpBackend.when('POST', '/post').respond({});

        collection.create({}, {url: '/post'});

        expect(collection.$status.loading).toBe(false);

        $httpBackend.flush();
      });
    });

    describe('saving should be updated', function() {
      it('should set on POST request', function() {
        $httpBackend.when('POST', '/post').respond({});

        collection.create({}, {url: '/post'});

        expect(collection.$status.saving).toBe(true);

        $httpBackend.flush();
      });

      it('should not set on GET request', function() {
        $httpBackend.when('GET', '/get').respond({});

        collection.fetch({url: '/get'});

        expect(collection.$status.saving).toBe(false);

        $httpBackend.flush();
      });

      it('should set when a model on collection is saving', function(){
        var model = new collection.model({id: 'test-123'});

        collection.url = '/put';

        collection.add(model);

        $httpBackend.when('PUT', '/put/test-123').respond({});

        model.save({name: 'hello'});

        expect(collection.$status.saving).toBe(true);

        $httpBackend.flush();
      });
    });

    describe('deleting should be updated', function() {
      it('should set when a model on collection is destroyed', function() {
        var model = new collection.model({id: 'test-123'});

        collection.url = '/collection';

        collection.add(model);

        $httpBackend.when('DELETE', '/collection/test-123').respond({});

        model.destroy();

        expect(collection.$status.deleting).toBe(true);

        $httpBackend.flush();
      });
    });
  });
});
