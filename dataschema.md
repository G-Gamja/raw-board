```sql
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL, // 얘는 유니크 값을 넣어주는게 좋다
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    deleted_at
);
```

2. **게시물 테이블 (Posts):**

```sql
CREATE TABLE Posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at
    deleted_at // 실무에서는 실제 데이터를 날리는 경우가 거의없고, 삭제 날짜를 확인해야되는케이스도 있기때문에
    flag // (실제 사용하는 데이터인지 확인하는 용도로 사용)삭제했는지 안했는지 확인하는 용도로 사용한다.

    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
```

3. **댓글 테이블 (Comments):**

```sql
CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY, // id값은 그냥 id로 넣어놓는게 맞고 user_id처럼 외래키는 앞에 테이블명을 붙여서 넣어주는게 좋다.
    user_id INT,
    post_id INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,// cacasde는 실무환경에서는 유동성이 떨어지기 때문에 사용하지 않는다.
    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE
);
```

// rest api -> 브라우저 환경에서는 get, delete 에서는 바디를 못받고
// get은 데이터를 가져오는 용도로, 옵션을 줄떄 쿼리스트링으로 주는데 이 쿼리스트링이 너무 많다 싶으면 post로 바꾸고 바디에 넣어서 보내면 된다.
// post는 데이터를 생성(중복일떄)하는 용도로, 바디에 데이터를 넣어서 보내면 된다.

nest js, mysql, knex  
// https://medium.com/@ichsanputr/using-knex-with-nest-js-to-communicate-mysql-database-55bfa32777bb

// AuthGuard 미들웨어를 둬서 로그인한 사용자만 접근할 수 있도록 한다.

https://blog.naver.com/gi_balja/223069730719

// JWT인증 : https://develop-const.tistory.com/23

최종: https://charming-kyu.tistory.com/39
