```sql
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. **게시물 테이블 (Posts):**

```sql
CREATE TABLE Posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
```

3. **댓글 테이블 (Comments):**

```sql
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    post_id INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE
);
```

nest js, mysql, knex  
// https://medium.com/@ichsanputr/using-knex-with-nest-js-to-communicate-mysql-database-55bfa32777bb

// AuthGuard 미들웨어를 둬서 로그인한 사용자만 접근할 수 있도록 한다.

https://blog.naver.com/gi_balja/223069730719

// JWT인증 : https://develop-const.tistory.com/23

최종: https://charming-kyu.tistory.com/39
