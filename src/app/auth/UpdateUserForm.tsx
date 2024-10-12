"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface UpdateUserFormProps {
  userId: string;
}

export const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ userId }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        const userData = response.data;

        if (userData) {
          setName(userData.name || '');
          setAddress(userData.address || '');
          setBirthDate(userData.birthDate ? userData.birthDate.split('T')[0] : '');
          setPhoneNumber(userData.phoneNumber || '');
          setEmail(userData.email || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(`Failed to load user data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    fetchUserData();
  }, [userId]);

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const isAddressWithinDistance = async (address: string): Promise<boolean> => {
    try {
      const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`);
      const results = response.data.features;

      if (results.length > 0) {
        const { coordinates } = results[0].geometry;
        setCoordinates([coordinates[1], coordinates[0]]);

        const userLat = coordinates[1];
        const userLon = coordinates[0];
        const parisLat = 48.8566;
        const parisLon = 2.3522;

        const distance = calculateDistance(userLat, userLon, parisLat, parisLon);
        return distance <= 50;
      }

      return false;
    } catch (error) {
      console.error('Error validating address:', error);
      setError('Failed to validate address');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Invalid phone number. Please enter a 10-digit phone number.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email address. Please enter a valid email.');
      return;
    }

    const isValidAddress = await isAddressWithinDistance(address);
    if (!isValidAddress) {
      setError('The address must be within 50 km of Paris.');
      return;
    }

    try {
      const response = await axios.put('/api/user/update', {
        name,
        address,
        birthDate,
        phoneNumber,
        email,
      });
      setSuccess('User updated successfully!');
      console.log(response.data);
    } catch (error: unknown) { // Change any to unknown
      const errorMessage = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to update user';
      setError(errorMessage);
      console.error('Error updating user:', error);
    }
  };

  const defaultPosition: [number, number] = [48.8566, 2.3522];
  const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="form-control mb-4">
        <label className="label">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Address</span>
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <small className="text-gray-600">
          The address must be within 50 km of Paris.
        </small>
      </div>
      <div className="mb-4">
        <MapContainer
          center={coordinates || defaultPosition}
          zoom={coordinates ? 13 : 6}
          style={{ height: '300px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {coordinates && (
            <Marker position={coordinates}>
              <Popup>Your address</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="form-control mb-4">
        <label className="label">Birth Date</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="input input-bordered w-full"
          max={today} // Set max to today
          required
        />
      </div>
      <div className="form-control mb-4">
        <label className="label">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="form-control mb-4">
        <label className="label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button type="submit" className="btn btn-primary w-full">
        Update User
      </button>
    </form>
  );
};

export default UpdateUserForm;
