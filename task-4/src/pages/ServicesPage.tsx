import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { Service } from '../types/service';
import ServiceBlock from '../components/ServiceBlock';
import AddEditServiceModal from '../components/AddEditServiceModal';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  const modalRef = useRef<{
    open: (service?: Service) => void;
    close: () => void;
  }>(null);

  const handleSaveService = (service: Service) => {
    setServices((prev) => {
      const index = prev.findIndex((s) => s.key === service.key);
      if (index >= 0) {
        const newArr = [...prev];
        newArr[index] = service;
        return newArr;
      } else {
        return [...prev, service];
      }
    });
    modalRef.current?.close();
  };

  const handleRemoveService = (key: number) => {
    setServices((prev) => prev.filter((s) => s.key !== key));
  };

  const handleAddService = () => {
    modalRef.current?.open();
  };

  const handleEditService = (service: Service) => {
    modalRef.current?.open(service);
  };

  const handleSubmitAll = () => {
    console.log('Services: ', services);
  };

  return (
    <div className='w-[528px] mx-auto min-h-screen p-4'>
      <div className='flex justify-between mb-4'>
        <div>
          <h1 className='text-2xl font-semibold'>Service Page</h1>
        </div>
        <Button className='h-[31px]' onClick={handleSubmitAll}>
          Submit
        </Button>
      </div>

      {services.map((s) => (
        <ServiceBlock
          key={s.key}
          service={s}
          onEdit={handleEditService}
          onRemove={handleRemoveService}
        />
      ))}

      <div className='flex justify-center mt-8'>
        <Button
          type='primary'
          className='h-[31px] text-sm'
          onClick={handleAddService}
        >
          Add Service
        </Button>
      </div>

      <AddEditServiceModal ref={modalRef} onSave={handleSaveService} />
    </div>
  );
};

export default ServicesPage;
