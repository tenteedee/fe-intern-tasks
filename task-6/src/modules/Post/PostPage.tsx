import React, { useState, useRef } from 'react';
import { useRequest } from 'ahooks';
import { Table, Button, message } from 'antd';
import { fetchPosts, addPost, editPost, deletePost } from './requests';
import { Post } from '../../types/Post';
import { useTranslation } from 'react-i18next';
import PostModal from './PostModal';
import Header from '../../components/Header';

const PostPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const { t } = useTranslation();

  const modalRef = useRef<{
    open: (post?: Post) => void;
    close: () => void;
  } | null>(null);

  const {
    data,
    error,
    loading,
    run: reloadPosts,
  } = useRequest(() => fetchPosts(page), {
    refreshDeps: [page],
  });

  const handleSave = async (post: Post) => {
    try {
      if (post.id) {
        await editPost(post.id, post);
        message.success(t('post-updated-successfully'));
      } else {
        await addPost(post);
        message.success(t('post-added-successfully'));
      }
      reloadPosts();
    } catch (error) {
      message.error(t('failed-to-save-post'));
    }
  };

  const handleEdit = (record: Post) => {
    if (modalRef.current) {
      modalRef.current.open(record);
    }
  };

  const handleDelete = async (post: Post) => {
    try {
      if (!post.id) {
        return;
      }
      await deletePost(post.id);
      message.success(t('post-deleted-successfully'));
      reloadPosts();
    } catch (error) {
      message.error(t('failed-to-delete-post'));
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '15%',
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      width: '10%',
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
      width: '45%',
    },
    {
      title: t('tags'),
      dataIndex: 'tags',
      key: 'tags',
      width: '10%',
      render: (tags: string[]) => tags?.join(', '),
    },
    {
      title: t('action'),
      key: 'action',
      width: '20%',
      render: (_: any, record: Post) => (
        <div className='space-x-2'>
          <Button onClick={() => handleEdit(record)}>{t('edit')}</Button>
          <Button danger onClick={() => handleDelete(record)}>
            {t('delete')}
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className='w-full h-screen flex items-center justify-center p-4 text-red-500'>
        {t('error-loading-posts')}: {error.message || t('unknown-error')}
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 p-8 flex flex-col items-center'>
      <Header />
      <div className='w-full max-w-5xl bg-white p-4 shadow'>
        <div className='flex justify-between items-center mb-4'>
          <div className='text-xl font-bold'>{t('post-title')}</div>
          <Button type='primary' onClick={() => modalRef.current?.open()}>
            {t('add')}
          </Button>
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
      <PostModal ref={modalRef} onSave={handleSave} onClose={reloadPosts} />
    </div>
  );
};

export default PostPage;
