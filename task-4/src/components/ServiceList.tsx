import React from 'react';
import { Button } from 'antd';
import { Service } from '../types/service';

interface ServiceListProps {
  services: Service[];
  onRemove: (key: number) => void;
  onEditClick: (service: Service) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onRemove,
  onEditClick,
}) => {
  return (
    <div className='flex flex-col space-y-4'>
      {services.map((service) => (
        <div
          key={service.key}
          className='bg-white rounded shadow p-4 flex flex-col space-y-2'
        >
          {/* Thông tin cơ bản */}
          <div className='flex justify-between'>
            <div>
              <div className='font-medium'>
                Service Name: {service.service_name}
              </div>
              <div className='text-gray-600'>Duration: {service.duration}</div>
            </div>
            <div className='text-sm'>
              <span className='font-medium'>Price Type: </span>
              {service.price_type}
            </div>
          </div>

          {/* Thông tin giá */}
          {service.price_type === 'FIXED' ? (
            <div className='text-gray-700 text-sm'>
              Fixed Price:{' '}
              <span className='font-bold'>{service.fixed_price}</span>
            </div>
          ) : (
            <div className='text-gray-700 text-sm'>
              From: <span className='font-bold'>{service.from_price}</span> –
              To: <span className='font-bold'>{service.to_price}</span>
            </div>
          )}

          {/* Nút hành động */}
          <div className='flex justify-end space-x-2 pt-2'>
            <Button onClick={() => onEditClick(service)}>Edit</Button>
            <Button danger onClick={() => onRemove(service.key)}>
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
