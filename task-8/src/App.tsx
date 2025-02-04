import { useEffect, useState, useRef } from 'react';

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
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTczODY1MTY0NCwiZXhwIjoxNzM4NzM4MDQ0fQ.6gwcLVi2MR8Ys3SsJxrQeGYRUhU5ZBS7MUPBpGbUpmY',
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

  const observerRef = useRef<HTMLDivElement | null>(null);

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
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, loading]);

  return (
    <div className='wrap'>
      {posts.map((post) => (
        <div key={post.id} className='post'>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <div>
            {post.tags.map((tag, i) => (
              <span key={i} className='tag'>
                {typeof tag === 'string' ? tag : tag.tag}
              </span>
            ))}
          </div>
        </div>
      ))}
      <div ref={observerRef} style={{ height: '1px' }} />
      {loading && <p>Loading more posts...</p>}
      {!hasMore && !loading && <p>No more posts to load.</p>}
    </div>
  );
}

export default App;
