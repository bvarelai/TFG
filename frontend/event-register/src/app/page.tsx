import Link from 'next/link';

export default async function Page() {        
 
  return (     
    <div>
    <h1>Página Principal</h1>
    <Link href="/login">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Ir a Dashboard
      </button>
    </Link>
  </div>
  );
}