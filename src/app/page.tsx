import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const Home = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <section className="h-screen w-screen layout"></section>;
};

export default Home;
