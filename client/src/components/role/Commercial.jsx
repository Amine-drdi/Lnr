import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Badge,
} from "@material-tailwind/react";
import { IoIosNotifications } from "react-icons/io";

import { FaFileContract, FaFileSignature } from "react-icons/fa6";
import { PowerIcon } from "@heroicons/react/24/solid";
import logo from "../../assets/logo.png";
import img from "../../assets/user.png";
import ListeContratsComm from '../contrat/ListeContratsComm';
import Souscription from '../contrat/Souscription';

function Commercial() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [contratUpdates, setContratUpdates] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(!open);

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
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        navigate('/');
      }
    };

    // Fonction pour récupérer les modifications des contrats
    const fetchContratUpdates = async () => {
      try {
        const response = await axios.get('http://51.83.69.195:5000/api/contrat-updates');
        setContratUpdates(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des mises à jour :", error);
      }
    };

    fetchProfile();
    fetchContratUpdates();

    // Configurer l'intervalle de polling
    const intervalId = setInterval(() => {
      fetchContratUpdates();
    }, 5000); // Actualiser toutes les 5 secondes

    // Nettoyer l'intervalle lorsqu'on démonte le composant
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Fonction pour formater et afficher les champs modifiés
  const renderUpdatedFields = () => {
    return contratUpdates.map((update, index) => (
      <div key={index} className="mb-4">
 
        <ul>
          {Object.keys(update.updatedFields).map((field, idx) => (
            <li key={idx}>
              <strong className='text-blue-800'>{field}</strong> : 
              <span> Ancien - {update.updatedFields[field].old} </span> {/* Ancienne valeur */}
              <span> | Nouveau - {update.updatedFields[field].new}</span> {/* Nouvelle valeur */}
            </li>
          ))}
        </ul>
        <Typography className='text-right text-lg text-black ' variant="h6">
          Modifié le {new Date(update.modificationDate).toLocaleDateString()}
        </Typography>
      </div>
    ));
  };

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  // Fonction pour rendre le bon composant selon l'état
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
      {/* Barre latérale */}

      <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl bg-blue-gray-500 shadow-blue-gray-900/5">
        {/* Logo */}
        <img
          className="object-cover w-auto h-24"
          src={logo}
          alt="Company Logo"
        />

        <div className="text-light-blue-900 pl-5 mb-4 pt-8 flex items-center space-x-2">
          <Typography variant="h6" className="flex items-center">
            <Badge content={contratUpdates.length} overlap="circular">
              <button onClick={handleOpen}>
                <img className="object-cover w-auto h-12" src={img} alt="User" />
              </button>
            </Badge>
            {userName}
          </Typography>
        </div>

        {/* Liste de menus */}
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
      



      <div className="flex-1 p-6">

        
        {renderComponent()}
              {/* Zone de contenu */}

      
      </div>

      {/* Boîte de dialogue pour les notifications */}
      <Dialog open={open} handler={handleOpen} className="max-h-[75vh]">
        <DialogHeader className='text-green-700'> <IoIosNotifications/>Notifications</DialogHeader>
        <DialogBody className="overflow-y-auto max-h-[50vh]">
          {contratUpdates.length > 0 ? (
            renderUpdatedFields() // Fonction qui affiche les champs modifiés
          ) : (
            <Typography>Aucune modification récente.</Typography>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Fermer</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Commercial;
