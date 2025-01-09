import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { Service } from '../types/service';

interface EditServiceModalProps {
  visible: boolean;
  onCancel: () => void;
  onEdit: (service: Service) => void; // Callback khi bấm Save
  service?: Service;
}

const { Option } = Select;

const EditServiceModal: React.FC<EditServiceModalProps> = ({
  visible,
  onCancel,
  onEdit,
  service,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && service) {
      form.setFieldsValue({
        service_name: service.service_name,
        duration: service.duration,
        price_type: service.price_type,
        fixed_price: service.fixed_price,
        from_price: service.from_price,
        to_price: service.to_price,
      });
    }
  }, [visible, service, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!service) return;
      const updatedService: Service = {
        ...service,
        service_name: values.service_name,
        duration: Number(values.duration),
        price_type: values.price_type,
        ...(values.price_type === 'FIXED'
          ? { fixed_price: Number(values.fixed_price) || 0 }
          : {
              from_price: Number(values.from_price) || 0,
              to_price: Number(values.to_price) || 0,
            }),
      };
      onEdit(updatedService);
      form.resetFields();
    } catch (err) {
      console.log('Validate Failed:', err);
    }
  };

  return (
    <Modal
      title='Edit Service'
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
      bodyStyle={{ padding: '1rem' }}
      className='rounded-md'
    >
      <Form form={form} layout='vertical' className='space-y-4'>
        <Form.Item
          label='Service Name'
          name='service_name'
          rules={[{ required: true, message: 'Please enter service name!' }]}
        >
          <Input placeholder='Enter service name' />
        </Form.Item>

        <Form.Item
          label='Duration'
          name='duration'
          rules={[{ required: true, message: 'Please enter duration!' }]}
        >
          <Input type='number' placeholder='Enter duration' />
        </Form.Item>

        <Form.Item
          label='Price Type'
          name='price_type'
          rules={[{ required: true, message: 'Please select price type!' }]}
        >
          <Select>
            <Option value='FIXED'>Fixed</Option>
            <Option value='VARIES'>Varies</Option>
          </Select>
        </Form.Item>

        <Form.Item shouldUpdate>
          {({ getFieldValue }) => {
            const priceType = getFieldValue('price_type');
            if (priceType === 'FIXED') {
              return (
                <Form.Item
                  label='Fixed Price'
                  name='fixed_price'
                  rules={[
                    { required: true, message: 'Please enter fixed price!' },
                  ]}
                >
                  <Input type='number' placeholder='Enter fixed price' />
                </Form.Item>
              );
            }

            return (
              <div className='grid grid-cols-2 gap-4'>
                <Form.Item
                  label='From Price'
                  name='from_price'
                  rules={[
                    { required: true, message: 'Please enter from price!' },
                  ]}
                >
                  <Input type='number' placeholder='Enter from price' />
                </Form.Item>

                <Form.Item
                  label='To Price'
                  name='to_price'
                  rules={[
                    { required: true, message: 'Please enter to price!' },
                  ]}
                >
                  <Input type='number' placeholder='Enter to price' />
                </Form.Item>
              </div>
            );
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditServiceModal;
