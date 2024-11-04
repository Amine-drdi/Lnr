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
import { GiNotebook } from "react-icons/gi";
import { CiBoxList } from "react-icons/ci";
import { PowerIcon } from "@heroicons/react/24/solid";
import { IoCalendarNumber } from "react-icons/io5";
import logo from "../../assets/logo.png";
import img from "../../assets/user.png";
import Agenda from "../Agenda";
import ListeContratsPrise from '../contrat/ListeContratsPrise';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import BlocNotes from '../BlocNotes';
function Prise() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [etat, setEtat] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fonction pour récupérer les informations du profil
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('http://51.83.69.195:5000/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserName(response.data.user.name);
          setEtat(response.data.user.etat);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        navigate('/');
      }
    };
    fetchProfile();

    const intervalId = setInterval(async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('http://51.83.69.195:5000/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setEtat(response.data.user.etat);
        }
      } catch (error) {
        console.error("Erreur lors de l'actualisation de l'état :", error);
      }
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [navigate]);
  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    navigate('/');
  };
 // Fonction pour gérer le changement de statut
const handleStatusChange = async () => {
  const newStatus = isOnline ? "hors ligne" : "en ligne"; // Définir le statut sous forme de texte
  setIsOnline(!isOnline); // Changer l'état local du bouton

  try {
    const token = localStorage.getItem("authToken");
    if (token) {
      await axios.post(
        "http://51.83.69.195:5000/api/status",
        { username: userName, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
  }
};

  // Fonction pour rendre le bon composant selon l'état
  const renderComponent = () => {
    if (etat === 0) return null;
    switch (activeComponent) {
      case 'listeContrats':
        return <ListeContratsPrise />;
        case 'BlocNote':
          return <BlocNotes />;
            case 'Agenda':
              return <Agenda />;
      default:
        return <Agenda/>;
    }
  };

  return (
    
    <div className="flex ">
      {/* Barre latérale */}

      <Card className="h-[calc(100vh-2rem)]  min-w-[20rem] p-4 shadow-xl bg-blue-gray-500 text-white">
        {/* Logo */}
        <img
          className="object-cover w-auto h-24"
          src={logo}
          alt="Company Logo"
        />
      <div className="text-light-blue-900 pl-5 mb-4 pt-8 flex items-center space-x-2">
          <Typography variant="h6" className="flex items-center">

              <button>
                <img className="object-cover w-auto h-12" src={img} alt="User" />
              </button>
           
            {userName}
          </Typography>
        </div>
        <button
  onClick={handleStatusChange}
  className={`flex items-center px-4 py-2 mt-4 font-semibold text-white rounded-full shadow-md transition-colors duration-200 ease-in-out
    ${isOnline ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'}
  `}
>
  {isOnline ? (
    <>
      <CheckCircleIcon className="w-5 h-5 mr-2" />
      <span>En ligne</span>
    </>
  ) : (
    <>
      <XCircleIcon className="w-5 h-5 mr-2" />
      <span>Hors ligne</span>
    </>
  )}
</button>

        {/* Liste de menus */}
        <List>
          <ListItem
            onClick={() => setActiveComponent('listeContrats')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <CiBoxList className="h-5 w-5" />
            </ListItemPrefix>
            Liste des contrats
          </ListItem>

          <ListItem onClick={() => setActiveComponent('Agenda')} 
          className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}>
            <ListItemPrefix>
              <IoCalendarNumber className="h-5 w-5 text-white" />
            </ListItemPrefix>
           Agenda
          </ListItem>
          <ListItem onClick={() => setActiveComponent('BlocNote')} 
          className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}>
            <ListItemPrefix>
              <GiNotebook className="h-5 w-5 text-white" />
            </ListItemPrefix>
           Bloc note
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
      <div className="flex-1 p-6">
        {renderComponent()}
              {/* Zone de contenu */}
      </div>
    </div>
  );
}

export default Prise; 