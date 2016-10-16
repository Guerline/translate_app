describe('index page', function(){
  it('should be reunning',function(){
    superagent
      .get('http://localhost:3000')
      .end(function(res){
        expect(res.status).to.equal(200);
    })
  })