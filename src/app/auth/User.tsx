import { getRequiredAuthSesion } from "../../../lib/auth";
import { UpdateUserForm } from "./UpdateUserForm";
import Head from 'next/head';

export const User = async () => {
  const session = await getRequiredAuthSesion();

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="card bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <div className="card-body flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
            <div className="avatar mb-4">
              <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={session.user.image ?? ''} alt="User Avatar" className="object-cover rounded-full" />
              </div>
            </div>
            <h2 className="text-gray-600 mb-4">{session?.user?.name}</h2>
            <p className="text-gray-600 mb-4">{session?.user?.email}</p>
            <UpdateUserForm userId={session?.user?.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
