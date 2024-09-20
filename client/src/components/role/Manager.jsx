import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { FaFileContract, FaFileSignature } from "react-icons/fa6";
import { SlEarphonesAlt } from "react-icons/sl";
import { PowerIcon } from "@heroicons/react/24/solid";
import logo from "../../assets/logo.png";
import img from "../../assets/manager.png";
import ListeContratsComm from '../contrat/ListeContratsComm';
import Souscription from '../contrat/Souscription';

function Manager() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fonction pour récupérer les informations du profil
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserName(response.data.user.name);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        navigate('/');
      }
    };

    fetchProfile();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  // Function to render the correct component based on state
  const renderComponent = () => {
    switch (activeComponent) {
      case 'listeContrats':
        return <ListeContratsComm />;
      case 'AjoutContrat':
        return <Souscription />;
      default:
        return <Souscription />;
    }
  };

  return (
    <div className="flex bg-blue-gray-100">
      {/* Sidebar */}
      <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl bg-blue-gray-500 shadow-blue-gray-900/5">
        {/* Logo */}
        <img
          className="object-cover w-auto h-24"
          src={logo}
          alt="Company Logo"
        />

          <div className="text-light-blue-900 pl-5 mb-4 pt-8 flex items-center space-x-2">
          <Typography variant="h6" className="flex items-center">
            <img className="object-cover w-auto h-12" src={img} alt="User" />
            {userName}
          </Typography>
        </div>

        {/* Menu List */}
        <List>
          <ListItem
            onClick={() => setActiveComponent('listeContrats')}
            className="hover:bg-blue-600 text-white"
          >
            <ListItemPrefix>
              <FaFileContract className="h-5 w-5" />
            </ListItemPrefix>
            Consulter la liste des contrats
          </ListItem>

          <ListItem
            onClick={() => setActiveComponent('AjoutContrat')}
            className="hover:bg-blue-600 text-white"
          >
            <ListItemPrefix>
              <FaFileSignature className="h-5 w-5" />
            </ListItemPrefix>
            Ajouter un Contrat
          </ListItem>

          <ListItem
            onClick={handleLogout}
            className="hover:bg-blue-600 text-white"
          >
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Se déconnecter
          </ListItem>
        </List>
      </Card>

      {/* Content Area */}
      <div className="flex-1 p-6">
        {renderComponent()}
      </div>
    </div>
  );
}

export default Manager;
