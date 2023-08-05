const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }));
// ejs관련 코드
app.set('view engine','ejs')

const MongoClient = require('mongodb').MongoClient;

let db;

MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.gr6juzz.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
  // 연결되면 할 일
  if(에러) return console.log(에러)

  db = client.db('todoapp')

  // db.collection('post').insertOne({이름:'john',나이:20},function(에러,결과){
  //   console.log('저장완료')
  // });

  app.listen(8080, function() {
    // console.log('listening on 8080')
  }); 

  // 어떤 사람이 /add 경로로 post 요청 -> req로 전달
  app.post('/add',function(req,res){
    res.send('완료')
    // console.log(req.body)
    // 카운터라는 콜렉션에서 게시물갯수라는 name을 찾아옴
    db.collection('counter')
    .findOne({name : '게시물갯수'},function(에러,결과){
      // 개시물갯수를 변수에 담아줌 id값으로 쓰기위해
      let 총게시물개수 = 결과.totalPost;
      // 저장할 내용을 담을 틀을 만들어주었음
      let 저장할거 = {
        _id : 총게시물개수 + 1,
        제목 : req.body.title, 
        날짜 : req.body.date
      }
      // post라는 콜렉션에 저장할거 라는 데이터를 저장
      db.collection('post').insertOne(저장할거,function(에러,결과){
        // counter라는 콜렉션에서 name이 게시물갯수인 데이터의 값을 1씩 증가시켜준다.
        db.collection('counter')
        .updateOne({name : '게시물갯수'},{ $inc : {totalPost:1} },function(){

        })
      })
    });
  })
})

// list 로 GET요청
app.get('/list',function(요청,응답){

  // DB에 post라는 콜렉션에서 모든데이터를 꺼내오기
  db.collection('post').find().toArray(function(에러,결과){
    console.log('결과는',결과) 
    응답.render('list.ejs',{posts : 결과})
  });
})

























// 누군가가 /pet 으로 방문을 하면 pet 관련된 안내문을 띄워주자
// .get(경로, 함수(요청,응답){});
// http://localhost:8080/pet 으로 접속하면 '펫용품을...' 보여준다!
app.get('/pet',function(req,res){
  res.send('펫용품을 쇼핑할 수 있는 페이지입니다.')
});

app.get('/beauty',function(req,res){
  res.send('뷰티용품을 쇼핑할 수 있는 페이지입니다.')
});

// .sendFile(보낼파일경로) 홈페이지 접속했을떄 파일 보내주세요
app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html')
});

app.get('/write', function(req,res) { 
  res.sendFile(__dirname +'/write.html')
});

// 어떤 사람이 /add 경로로 post 요청 -> req로 전달
// app.post('/add',function(req,res){
//   res.send('전송완료')
//   console.log(req.body.title);
//   // DB저장
// })