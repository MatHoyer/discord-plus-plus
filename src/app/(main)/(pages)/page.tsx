import { redirect } from 'next/navigation';

const MainPage = () => {
  redirect('/channels/me');
};

export default MainPage;
