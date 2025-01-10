import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { userAtom } from '../../atoms/userAtom';
import { useRequest } from 'ahooks';
import { Table, Button } from 'antd';
import { User } from 'lucide-react';
import { fetchPosts } from './requests';
import { Post } from '../../types/Post';

const PostPage: React.FC = () => {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [setUser, navigate]);

  const { data, error, loading } = useRequest(() => fetchPosts(page), {
    refreshDeps: [page],
  });

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleEdit = (record: Post) => {
    console.log('Edit:', record);
    // TODO: modal edit
  };

  const handleDelete = (record: Post) => {
    console.log('Delete:', record);
    // TODO: delete post
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '15%',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '10%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '45%',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: '10%',
      render: (tags: string[]) => tags?.join(', '),
    },
    {
      title: 'Action',
      key: 'action',
      width: '20%',
      render: (_: any, record: Post) => (
        <div className='space-x-2'>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className='w-full h-screen flex items-center justify-center p-4 text-red-500'>
        Error loading posts: {error.message || 'Unknown error'}
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 p-8 flex flex-col items-center'>
      <div className='w-full max-w-5xl flex justify-between items-center mb-4 bg-white p-4 shadow'>
        <div className='flex space-x-2'>
          <User /> {user?.username}
        </div>
        <Button danger onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className='w-full max-w-5xl bg-white p-4 shadow'>
        <div className='flex justify-between items-center mb-4'>
          <div className='text-xl font-bold'>Posts</div>
          <Button type='primary'>Add Post</Button>
        </div>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={data?.posts || []}
          loading={loading}
          pagination={{
            current: page,
            pageSize: 10,
            total: data?.total || 0,
            onChange: (p) => setPage(p),
          }}
        />
      </div>
    </div>
  );
};

export default PostPage;
