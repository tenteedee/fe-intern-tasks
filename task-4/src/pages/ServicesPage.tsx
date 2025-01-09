import { useState } from 'react';
import { Service } from '../types/service';
import { Button } from 'antd';
import ServiceBlock from '../component/ServiceBlock';
import AddEditServiceModal from '../component/AddEditServiceModal';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>(
    undefined
  );

  const handleSaveService = (service: Service) => {
    setServices((prev) => {
      const index = prev.findIndex((s) => s.key === service.key);
      // ì found existing service, update
      if (index >= 0) {
        const newArr = [...prev];
        newArr[index] = service;
        return newArr;
      } else {
        return [...prev, service];
      }
    });
    setIsModalVisible(false);
    setEditingService(undefined);
  };

  const handleRemoveService = (key: number) => {
    setServices((prev) => prev.filter((s) => s.key !== key));
  };

  const handleAddService = () => {
    setEditingService(undefined);
    setIsModalVisible(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsModalVisible(true);
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

      <AddEditServiceModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingService(undefined);
        }}
        onSave={handleSaveService}
        editingService={editingService}
      />
    </div>
  );
};
export default ServicesPage;
