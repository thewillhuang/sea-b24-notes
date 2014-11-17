/*jshint node:true*/
'use strict';

process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('basic user login crud', function() {
    var id;
    var jwttoken;
    it('should create a user', function(done) {
        chai.request('http://localhost:3000')
        .post('/api/users')
        .send({email: 'test@example.com', password: 'foobar123'})
        .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.body).to.have.property('jwt');
            jwttoken = res.body.jwt;
            done();
        });
    });

    it('should create a note, using a jwt', function(done) {
        chai.request('http://localhost:3000')
        .post('/v1/api/notes')
        .set({jwt: jwttoken})
        .send({noteTitle: 'firstTitle', noteBody: 'hello leeroy'})
        .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.body).to.have.property('_id');
            id = (res.body._id);
            expect(res.body.noteTitle).to.eql('firstTitle');
            expect(res.body.noteBody).to.eql('hello leeroy');
            done();
        });
    });

    it('should be able to get an index, using a jwt', function(done) {
        chai.request('http://localhost:3000')
        .get('/v1/api/notes')
        .set({jwt: jwttoken})
        .end(function(err, res) {
            expect(err).to.eql(null);
            expect(Array.isArray(res.body)).to.eql(true);
            done();
        });
    });

    it('should be able to get a single note, using a jwt', function(done) {
        chai.request('http://localhost:3000')
        .get('/v1/api/notes/' + id)
        .set({jwt: jwttoken})
        .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.body.noteBody).to.eql('hello leeroy');
            done();
        });
    });

    it('should be able to update a note, using a jwt', function(done) {
        chai.request('http://localhost:3000')
        .put('/v1/api/notes/' + id)
        .set({jwt: jwttoken})
        .send({noteBody: 'hi'})
        .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.body.noteBody).to.eql('hi');
            done();
        });
    });

    it('should be able to destroy a note, using a jwt', function(done) {
        chai.request('http://localhost:3000')
        .delete('/v1/api/notes/' + id)
        .set({jwt: jwttoken})
        .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.body.msg).to.eql('success!');
            done();
        });

    });
});
