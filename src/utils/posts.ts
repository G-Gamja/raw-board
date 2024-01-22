import { PaginationQueryDTO } from 'src/post/dto/pagination';
import { Post } from 'src/post/entities/post.entity';

export const applyQuery = (query: PaginationQueryDTO, posts: Post[]) => {
  const { page, isDesc = false, perPage = 10 } = query;

  const sortedPosts = isDesc
    ? posts.sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
    : posts;

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

  return paginatedPosts;
};
