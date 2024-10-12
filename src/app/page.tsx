import { LoginButton } from "./auth/LoginButton";
import { getAuthSesion } from "../../lib/auth";
import { User } from "./auth/User";
import Header from "./auth/Header";

const Home = async() => {
  const session = await getAuthSesion();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-6">
        {session ? (
          <User />
        ) : (
          <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-5xl font-bold mb-6 text-center text-blue-800">Welcome to UserApp!</h1>
            <p className="mb-4 text-lg text-gray-700">Please log in to continue.</p>
            <LoginButton />
          </div>
        )}
      </main>
      <section className="bg-white p-6 mt-6 shadow rounded-lg">
        <h2 className="text-3xl font-bold mb-4 text-center">Upcoming Features</h2>
        <div className="flex flex-wrap justify-center">
          <div className="m-4 p-4 bg-blue-100 rounded-lg shadow-lg w-72">
            <h3 className="text-xl font-semibold">Google Maps Integration</h3>
            <p className="mt-2 text-gray-600">Plan to integrate Google Maps for better location tracking and management.</p>
          </div>
        </div>
      </section>
      <footer className="bg-gray-800 text-white py-4 mt-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Ghazi Bouzid. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
