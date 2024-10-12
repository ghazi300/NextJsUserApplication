// src/app/auth/Header.tsx
import { getAuthSesion } from "../../../lib/auth"; 
import HeaderClient from "./HeaderClient"; 

const Header = async () => {
  const session = await getAuthSesion();

  return (
    <HeaderClient session={session} /> 
  );
};

export default Header;
