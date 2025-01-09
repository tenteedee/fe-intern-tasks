import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { Service } from '../types/service';

const { Option } = Select;

interface ServiceBlockProps {
  service: Service;
  onEdit: (s: Service) => void;
  onRemove: (key: number) => void;
}

const ServiceBlock: React.FC<ServiceBlockProps> = ({
  service,
  onEdit,
  onRemove,
}) => {
  return (
    <div className='bg-gray-100 p-2 rounded-md shadow-sm mb-4'>
      <Form layout='vertical'>
        <div className='grid grid-cols-2 gap-2'>
          <Form.Item
            label={<span className='text-sm font-medium'>Service name</span>}
          >
            <Input
              value={service.service_name}
              className='h-[31px] w-[229px] text-sm text-black'
              readOnly
            />
          </Form.Item>

          <Form.Item
            label={<span className='text-sm font-medium'>Duration</span>}
          >
            <Input
              value={service.duration}
              className='h-[31px] w-[229px] text-sm'
              readOnly
            />
          </Form.Item>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Form.Item
            label={<span className='text-sm font-medium'>Price type</span>}
          >
            <Select
              value={service.price_type}
              className='h-[31px] w-[229px] text-sm'
            >
              <Option value='FIXED'>Fixed</Option>
              <Option value='VARIES'>Varies</Option>
            </Select>
          </Form.Item>

          {service.price_type === 'VARIES' ? (
            <div className='grid grid-cols-2 gap-2 h-[90px]'>
              <Form.Item
                label={<span className='text-sm font-medium'>From</span>}
              >
                <Input
                  value={service.from_price}
                  className='h-[31px] w-[111px] text-sm'
                  readOnly
                />
              </Form.Item>
              <Form.Item
                label={<span className='text-sm font-medium'>To</span>}
              >
                <Input
                  value={service.to_price}
                  className='h-[31px] w-[111px] text-sm'
                  readOnly
                />
              </Form.Item>
            </div>
          ) : (
            <Form.Item
              label={<span className='text-sm font-medium'>Service Price</span>}
            >
              <Input
                value={service.fixed_price}
                className='h-[31px] w-[229px] text-sm'
                readOnly
              />
            </Form.Item>
          )}
        </div>
      </Form>

      <div className='flex justify-end space-x-2 mt-4'>
        <Button onClick={() => onEdit(service)} className='h-[31px] text-sm'>
          Edit
        </Button>
        <Button
          danger
          onClick={() => onRemove(service.key)}
          className='h-[31px] text-sm'
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default ServiceBlock;
