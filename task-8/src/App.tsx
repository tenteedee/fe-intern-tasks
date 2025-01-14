import { useEffect, useState } from 'react';

type Post = {
  id: string;
  title: string;
  description: string;
  tags: (string | { tag: string })[];
};

type ApiResponse = {
  posts: Post[];
  current_page: number;
  total_page: number;
};

const serviceGetPost = async (page: number): Promise<ApiResponse> => {
  const response = await fetch(
    `https://api-test-web.agiletech.vn/posts?page=${page}`,
    {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTczNjgzNzE2OCwiZXhwIjoxNzM2OTIzNTY4fQ.B9uwbJCd7dtPTKAMX1jdjZCT9WKo5V7gZgnR_5e2g5k',
      },
    }
  );
  return await response.json();
};

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await serviceGetPost(page);

        if (data.posts.length === 0 || data.current_page >= data.total_page) {
          setHasMore(false);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (hasMore) {
      fetchData();
    }
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    console.log(posts);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  return (
    <div className='wrap'>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <div>
            {post.tags.map((tag, i) => (
              <span key={i}>{typeof tag === 'string' ? tag : tag.tag}</span>
            ))}
          </div>
        </div>
      ))}
      {loading && <p>Loading more posts...</p>}
      {!hasMore && !loading && <p>No more posts to load.</p>}
    </div>
  );
}

export default App;
