import { Form, Input, Modal, Select } from 'antd';
import { Service } from '../types/service';
import { useEffect } from 'react';

const AddEditServiceModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSave: (service: Service) => void;
  editingService?: Service;
}> = ({ visible, onClose, onSave, editingService }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (editingService) {
        form.setFieldsValue({
          service_name: editingService.service_name,
          duration: editingService.duration,
          price_type: editingService.price_type,
          fixed_price: editingService.fixed_price,
          from_price: editingService.from_price,
          to_price: editingService.to_price,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ price_type: 'FIXED' });
      }
    }
  }, [visible, editingService, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newService: Service = {
        key: editingService ? editingService.key : Date.now(),
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
      onSave(newService);
      form.resetFields();
    } catch (err) {
      console.log('Validate Failed:', err);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      onOk={handleSave}
      destroyOnClose
      title={editingService ? 'Edit Service' : 'Add Service'}
    >
      <div className='py-2'>
        <Form form={form} layout='vertical' className='space-y-4'>
          <div className='grid grid-cols-2 gap-2'>
            <Form.Item
              label={<span className='text-sm font-medium'>Service name</span>}
              name='service_name'
              rules={[{ required: true, message: 'Enter service name!' }]}
            >
              <Input
                className='h-[31px] w-[229px] text-sm'
                placeholder='Service Name'
              />
            </Form.Item>

            <Form.Item
              label={<span className='text-sm font-medium'>Duration</span>}
              name='duration'
              rules={[{ required: true, message: 'Enter duration!' }]}
            >
              <Input
                className='h-[31px] w-[229px] text-sm'
                type='number'
                placeholder='Duration'
              />
            </Form.Item>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <Form.Item
              label={<span className='text-sm font-medium'>Price type</span>}
              name='price_type'
              rules={[{ required: true, message: 'Select price type!' }]}
            >
              <Select className='h-[31px] w-[229px] text-sm'>
                <Select.Option value='FIXED'>Fixed</Select.Option>
                <Select.Option value='VARIES'>Varies</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item shouldUpdate>
              {({ getFieldValue }) => {
                const priceType = getFieldValue('price_type');
                if (priceType === 'VARIES') {
                  return (
                    <div className='grid grid-cols-2 gap-2 h-[90px]'>
                      <Form.Item
                        label={
                          <span className='text-sm font-medium'>From</span>
                        }
                        name='from_price'
                        rules={[
                          { required: true, message: 'Enter from price!' },
                        ]}
                      >
                        <Input
                          className='h-[31px] w-[111px] text-sm'
                          type='number'
                          placeholder='From'
                        />
                      </Form.Item>
                      <Form.Item
                        label={<span className='text-sm font-medium'>To</span>}
                        name='to_price'
                        rules={[{ required: true, message: 'Enter to price!' }]}
                      >
                        <Input
                          className='h-[31px] w-[111px] text-sm'
                          type='number'
                          placeholder='To'
                        />
                      </Form.Item>
                    </div>
                  );
                }
                return (
                  <Form.Item
                    label={
                      <span className='text-sm font-medium'>Service Price</span>
                    }
                    name='fixed_price'
                    rules={[{ required: true, message: 'Enter fixed price!' }]}
                  >
                    <Input
                      className='h-[31px] w-[229px] text-sm'
                      type='number'
                      placeholder='Fixed Price'
                    />
                  </Form.Item>
                );
              }}
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  );
};
export default AddEditServiceModal;
