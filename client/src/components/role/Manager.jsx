import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Input, 
  IconButton
} from "@material-tailwind/react";

import { FaFileContract, FaFileSignature } from "react-icons/fa6";
import { PowerIcon } from "@heroicons/react/24/solid";
import logo from "../../assets/logo.png";
import img from "../../assets/manager.png";
import Souscription from '../contrat/Souscription';
import ListeContratsManager from '../contrat/ListeContratsManager';
import { CiBoxList } from "react-icons/ci";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Chat from '../Chat';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
function Manager() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [etat, setEtat] = useState('');
  const [Matricule, setMatricule] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [challenges, setChallenges] = useState([]);
  const [challengeId, setChallengeId] = useState('');
  const handleOpen = () => setOpen(!open);
  const replaceChallenge = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const challengeId = "6758006585dd042e03c8c56b"; // ID du challenge
  
      const response = await axios.put(
        `http://51.83.69.195:5000/api/challenges/${challengeId}`,
        { value }, // Envoyer la nouvelle valeur
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authentification
          },
        }
      );
  
      alert(response.data.message); // Message de succès
      handleOpen(false); // Fermer le modal
    } catch (error) {
      console.error("Erreur lors de l'écrasement du challenge :", error);
      alert("Une erreur est survenue lors de l'écrasement du challenge.");
    }
  };
  
  
  const saveChallenge = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Récupération du token pour l'authentification
      const response = await axios.post(
        'http://51.83.69.195:5000/api/challenges',
        {
          value,
         // Envoi du matricule de l'utilisateur
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authentification avec token
          },
        }
      );
      alert(response.data.message); // Message de confirmation
      
      handleOpen(false)
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du challenge:', error);
      alert('Une erreur est survenue lors de l\'enregistrement du challenge.');
    }
  };
  

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
          setMatricule(response.data.user.matricule);
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

  // Logout function
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

  // Function to render the correct component based on state
  const renderComponent = () => {
    if (etat === 0) return null;
    switch (activeComponent) {
      case 'listeContrats':
        return <ListeContratsManager />;
      case 'AjoutContrat':
        return <Souscription />;
        case 'Chat':
          return <Chat currentUser={{ matricule: Matricule, name: userName }} />;
      default:
        return <Souscription />;
    }
  };

 

  return (
    <div className="flex bg-blue-gray-100">
      {/* Sidebar */}
      <Card className="h-[calc(100vh-2rem)]  min-w-[20rem] p-4 shadow-xl bg-blue-gray-500 text-white">        {/* Logo */}
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
<div className='pt-6'>
<Button onClick={handleOpen} variant="gradient">
        Challenge
      </Button>
</div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Challenge</DialogHeader>
        <DialogBody>
        <div className="w-80">
    
      <div className="relative w-full">
      <Input
  type="number"
  value={value}
  onChange={(e) => setValue(Number(e.target.value))} // Assurez-vous que la valeur est bien un nombre
  className="!border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  labelProps={{
    className: "before:content-none after:content-none",
  }}
  containerProps={{
    className: "min-w-0",
  }}
/>

        <div className="absolute right-1 top-1 flex gap-0.5">
          <IconButton
            size="sm"
            className="rounded"
            onClick={() => setValue((cur) => (cur === 0 ? 0 : cur - 1))}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
            </svg>
          </IconButton>
          <IconButton
            size="sm"
            className="rounded"
            onClick={() => setValue((cur) => cur + 1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
            </svg>
          </IconButton>
        </div>
      </div>

    </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Annuler</span>
          </Button>
          <Button variant="gradient" color="green" onClick={replaceChallenge} >
            <span>Confirmer</span>
          </Button>
        </DialogFooter>
      </Dialog>
        {/* Menu List */}
        <List>
          <ListItem
            onClick={() => setActiveComponent('listeContrats')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <CiBoxList className="h-5 w-5" />
            </ListItemPrefix>
            Consulter la liste des contrats
          </ListItem>

          <ListItem
            onClick={() => setActiveComponent('AjoutContrat')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <FaFileSignature className="h-5 w-5" />
            </ListItemPrefix>
            Ajouter un Contrat
          </ListItem>
          <ListItem
            onClick={() => setActiveComponent('Chat')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <FaFileSignature className="h-5 w-5" />
            </ListItemPrefix>
           Chat
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
