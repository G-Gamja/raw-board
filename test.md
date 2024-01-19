```sql
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL, // 유니크
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    deleted_at // 삭제될 때 타임스탭프 생성
    is_active TINYINT(1) // 삭제됐는지 확인하는 용도로 사용 , 디폴트는 1
);
```

```sql
CREATE TABLE Posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at // 삭제될 때 타임스탭프 생성
    updated_at // 수정될 때 타임스탬프 생성
    is_active TINYINT(1) // 삭제됐는지 확인하는 용도로 사용 , 디폴트는 1
);
```

```sql
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    post_id INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at // 삭제될 때 타임스탭프 생성
    updated_at // 수정될 때 타임스탬프 생성
    is_active TINYINT(1) // 삭제됐는지 확인하는 용도로 사용 , 디폴트는 1
);
```

# 실제 쿼리문

```sql
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1
);
```

```sql
CREATE TABLE Posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1
);
```

```sql
CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    post_id INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1
);
```
