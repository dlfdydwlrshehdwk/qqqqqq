const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }));
// ejs관련 코드
app.set('view engine','ejs')

// HTML에서 PUT/DELETE 요청하려면 이거 서버에 복붙함 2줄 - npm 깔았음 npm install method-override
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

// CSS파일넣기
// - public/main.css 생성 - server.js에 코드추가
// 나는 static파일을 보관하기 위해 public폴더를 쓸거다
app.use('/public', express.static('public'))
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
    // ejs파일을 보내주고 { 이런이름으로 : 이런데이터를} 전달해준다
    응답.render('list.ejs',{posts : 결과})
  });
})

// delete 요청
app.delete('/delete',function(요청,응답){
  console.log(요청.body)
  // 숫자로 치환해주는 함수 parseInt()
  요청.body._id = parseInt(요청.body._id) 
  // 요청.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제하기
  db.collection('post').deleteOne(요청.body,function(에러,결과){
    console.log('삭제완료')
    응답.status(200).send({message : '성공했습니다'})
  })
})


// detail로 접속하면 detail.ejs 보여주기
// /:id 를붙여서 detail/어쩌구 로 접속하면 
app.get('/detail/:id',function(요청,응답){
  // 요청.params.id = detail/:id 에서 :id 값  파라미터중 id라는 이름인애!
  db.collection('post').findOne({_id : parseInt(요청.params.id)},function(에러,결과){
    console.log('detail결과',결과)
    응답.render('detail.ejs',{data : 결과})
  })
})

// edit으로 접속하면 미리 글채워지게 해놓기 (수정하기)
// 디비에서 데이터가져와서 미리채워놓았음 파라미터 이용
app.get('/edit/:id',function(요청,응답){

  db.collection('post').findOne({_id : parseInt(요청.params.id)},function(에러,결과){
    console.log(결과)
    응답.render('edit.ejs',{ post : 결과 })
  })
})


// 서버로 PUT요청 들어오면 게시물 수정 처리하기
app.put('/edit',function(요청,응답){
  // updateOne(어떤게시물수정,수정값,콜백함수)
  db.collection('post').updateOne({_id: parseInt(요청.body.id)},{$set:{제목:요청.body.title, 날짜:요청.body.date}},function(에러,결과){
    console.log('수정완료')
    응답.redirect('/list')
  })
})



















// .sendFile(보낼파일경로) 홈페이지 접속했을떄 파일 보내주세요
app.get('/',function(요청,응답){
  응답.render('index.ejs')
});

app.get('/write', function(요청,응답) { 
  응답.render('write.ejs')
});

// 어떤 사람이 /add 경로로 post 요청 -> req로 전달
// app.post('/add',function(req,res){
//   res.send('전송완료')
//   console.log(req.body.title);
//   // DB저장
// })