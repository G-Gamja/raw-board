import { PaginationQueryDTO } from 'src/post/dto/pagination.dto';
import { Post } from 'src/post/entities/post.entity';

export const applyQuery = (query: PaginationQueryDTO, posts: Post[]) => {
  const { page, isDesc = true, perPage = 10 } = query;

  const sortedPosts = sortByDate(posts, isDesc);

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

  return paginatedPosts;
};

const sortByDate = (posts: Post[], isDesc: boolean) => {
  return posts.sort((a, b) => {
    const aDate = a.updated_at ? a.updated_at : a.created_at;
    const bDate = b.updated_at ? b.updated_at : b.created_at;
    return isDesc
      ? bDate.getTime() - aDate.getTime()
      : aDate.getTime() - bDate.getTime();
  });
};
