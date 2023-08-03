const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;

let db;

MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.gr6juzz.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
  // 연결되면 할 일
  if(에러) return console.log(에러)

  db = client.db('todoapp')

  db.collection('post').insertOne({이름:'john',나이:20},function(에러,결과){
    console.log('저장완료')
  });

  app.listen(8080, function() {
    // console.log('listening on 8080')
  }); 

  // 어떤 사람이 /add 경로로 post 요청 -> req로 전달
  app.post('/add',function(req,res){
    console.log(req.body)
    let 저장할거 = { 제목 : req.body.title, 날짜 : req.body.date }
    db.collection('post').insertOne(저장할거,function(에러,결과){
      console.log('저장완')
    })
    res.send('전송완료')
    // DB저장
  })

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