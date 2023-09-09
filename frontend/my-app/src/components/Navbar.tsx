import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className='flex justify-center space-x-4'>
        <li>
          <Link href="/">Página Inicial</Link>
        </li>
        <li>
          <Link href="/bd">Dados banco</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;