import axios from './../../utils/axios';

export const fetchPosts = async (page: number) => {
  const response = await axios.get(`/posts?page=${page}`);
  const data = response.data;
  if (Array.isArray(data.posts)) {
    return {
      posts: data.posts,
      total: data.total,
    };
  }

  return { posts: [], total: 0 };
};
