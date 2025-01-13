import { useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import { Form, Input, Modal, Checkbox, message } from 'antd';
import axios from 'axios';

interface Post {
  id?: string;
  title: string;
  description: string;
  tags: string[];
}

interface PostModalProps {
  onSave: (post: Post) => void;
  onClose?: () => void;
}

const PostModal = forwardRef((props: PostModalProps, ref) => {
  const { onSave, onClose } = props;

  const [visible, setVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>();
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    open: (post?: Post) => {
      if (post) {
        setEditingPost(post);
        form.setFieldsValue({
          title: post.title,
          description: post.description,
          tags: post.tags || [],
        });
      } else {
        setEditingPost(undefined);
        form.resetFields();
      }
      setVisible(true);
    },
    close: () => {
      setVisible(false);
      setEditingPost(undefined);
      form.resetFields();
      onClose?.();
    },
  }));

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/posts/tags');
        console.log('Tags API Response:', response.data);
        if (
          Array.isArray(response.data) &&
          response.data.every((tag) => typeof tag === 'string')
        ) {
          setAvailableTags(response.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        message.error('Failed to fetch tags');
      }
    };

    fetchTags();
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const post: Post = {
        id: editingPost?.id,
        title: values.title,
        description: values.description,
        tags: values.tags || [],
      };

      onSave(post);
      setVisible(false);
      setEditingPost(undefined);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save post');
    }
  };

  return (
    <Modal
      title={editingPost ? 'Edit Post' : 'Add Post'}
      open={visible}
      onCancel={() => {
        setVisible(false);
        setEditingPost(undefined);
        form.resetFields();
        onClose?.();
      }}
      onOk={handleSave}
      destroyOnClose
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          name='title'
          label='Title'
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder='Enter title' />
        </Form.Item>

        <Form.Item
          name='description'
          label='Description'
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <Input.TextArea rows={4} placeholder='Enter description' />
        </Form.Item>

        <Form.Item name='tags' label='Tags'>
          <Checkbox.Group
            options={availableTags.map((tag) => ({ label: tag, value: tag }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default PostModal;
