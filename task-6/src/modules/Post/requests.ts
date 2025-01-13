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

export const addPost = async (post: {
  title: string;
  description: string;
  tags: string[];
}) => {
  const response = await axios.post('/posts', post);
  return response.data;
};

export const editPost = async (
  id: string,
  post: { title: string; description: string; tags: string[] }
) => {
  const response = await axios.patch(`/posts/${id}`, post);
  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await axios.delete(`/posts/${id}`);
  return response.data;
};
