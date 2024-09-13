import { Outlet } from 'react-router-dom';
import { MessageCircle } from 'react-feather';

function App() {
  return (
    <div className='h-screen flex flex-col gap-1'>
      <header className='flex-shrink-0'>
        <h1 className='text-3xl font-mono flex justify-center items-center text-blue-600 py-1 border-b border-blue-600'>
          <span><MessageCircle size={30} color='blue' /></span> U-Chat
        </h1>
      </header>

      <main className='flex-grow overflow-y-auto'>
        <Outlet />
      </main>
      
      <footer className='flex-shrink-0 text-center text-gray-500 pb-2'>
        © 2024 U-Chat. Created by Emon. All Rights Reserved.
      </footer>
    </div>
  )
}

export default App;
