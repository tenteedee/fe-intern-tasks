import { useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';

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
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTczNjgyNTI1MCwiZXhwIjoxNzM2OTExNjUwfQ.XnEOYb3hKg1vz2sg8QIHH3kZSYVhnKgzgkGUofhU_s4   ',
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
          setTimeout(() => {
            setPosts((prevPosts) => [...prevPosts, ...data.posts]);
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (hasMore && !loading) {
      fetchData();
    }
  }, [page, hasMore]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const post = posts[index];
    if (!post) {
      return <div style={style}>Loading...</div>;
    }

    return (
      <div style={style}>
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        <div>
          {post.tags.map((tag, i) => (
            <span key={i}>{typeof tag === 'string' ? tag : tag.tag}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='wrap'>
      <List
        height={600}
        itemCount={hasMore ? posts.length + 1 : posts.length}
        itemSize={150}
        width={800}
        onScroll={({ scrollOffset, scrollUpdateWasRequested }) => {
          if (
            !scrollUpdateWasRequested &&
            scrollOffset > (posts.length - 5) * 150
          ) {
            loadMore();
          }
        }}
      >
        {Row}
      </List>
      {loading && <p>Loading more posts...</p>}
      {!hasMore && !loading && <p>No more posts to load.</p>}
    </div>
  );
}

export default App;
