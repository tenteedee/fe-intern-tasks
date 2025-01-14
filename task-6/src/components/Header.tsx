import React from 'react';
import { Button, Dropdown } from 'antd';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { userAtom } from '../atoms/userAtom';
import { useAtom } from 'jotai';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languageItems = [
    {
      key: 'en',
      label: (
        <div onClick={() => changeLanguage('en')}>
          <img
            src='https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg'
            alt='English'
            className='w-5 mr-[10px]'
          />
          English
        </div>
      ),
    },
    {
      key: 'vi',
      label: (
        <div onClick={() => changeLanguage('vi')}>
          <img
            src='https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg'
            alt='Tiếng Việt'
            className='w-5 mr-[10px]'
          />
          Tiếng Việt
        </div>
      ),
    },
  ];

  // Hiển thị ngôn ngữ hiện tại
  const currentLanguageLabel =
    i18n.language === 'en' ? (
      <>
        <img
          src='https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg'
          alt='English'
          className='w-5 mr-[10px]'
        />
        English
      </>
    ) : (
      <>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg'
          alt='Tiếng Việt'
          className='w-5 mr-[10px]'
        />
        Tiếng Việt
      </>
    );

  return (
    <div className='w-full max-w-5xl flex justify-between items-center mb-4 bg-white p-4 shadow'>
      <div className='flex space-x-2'>
        <User />
        <span>{user?.username}</span>
      </div>
      <div className='flex items-center space-x-4'>
        <Dropdown menu={{ items: languageItems }} trigger={['click']}>
          <Button>{currentLanguageLabel}</Button>
        </Dropdown>
        <Button danger onClick={handleLogout}>
          {t('logout')}
        </Button>
      </div>
    </div>
  );
};

export default Header;
