# 게시판 API 요구 명세서

## 게시물 관련 API 요구 명세서

### 게시물 작성

- URL: /post
- Method: POST
- Request
  - Header
    - Authorization: Bearer {token}
  - Body
    - title: string
    - content: string
    - category: string
    - tags: string[]
- Response
  - Body
    - id: number
    - title: string
    - content: string
    - category: string
    - tags: string[]
    - createdAt: string
    - updatedAt: string
    - user: User
    - comments: Comment[]
    - likes: Like[]
    - views: number

### 게시물 수정

- URL: /post/{id}
- Method: PUT
- Request
  - Header
    - Authorization: Bearer {token}
  - Body
    - title: string
    - content: string
    - category: string
    - tags: string[]
- Response
  - Body
    - id: number
    - title: string
    - content: string
    - category: string
    - tags: string[]
    - createdAt: string
    - updatedAt: string
    - user: User
    - comments: Comment[]
    - likes: Like[]
    - views: number

### 게시물 삭제

- URL: /post/{id}
- Method: DELETE
- Request
  - Header
    - Authorization: Bearer {token}
- Response

### 게시물 조회

- URL: /post/{id}
- Method: GET
- Request
  - Header
    - Authorization: Bearer {token}
- Response
  - Body
    - id: number
    - title: string
    - content: string
    - category: string
    - tags: string[]
    - createdAt: string
    - updatedAt: string
    - user: User
    - comments: Comment[]
    - likes: Like[]
    - views: number

### 게시물 목록 조회

- URL: /post
- Method: GET
- Request
  - Header
    - Authorization: Bearer {token}
  - Query
    - category: string
    - tags: string[]
    - page: number
    - limit: number
- Response
  - Body
    - posts: Post[]
    - total: number
