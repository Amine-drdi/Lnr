import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { MdOutlinePriceChange } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { FaFileContract} from "react-icons/fa6";
import { GiNotebook } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png";
import img from "../../assets/gestionnaire.png";
import ListeEmp from "../ListeEmp";
import ListeContratsGestio from "../contrat/ListeContratsGestio";
import Souscription from "../contrat/Souscription";
import ContratNvalideGestio from "../contrat/ContratNvalideGestio";
import Dashboard from "../Dashboard";
import { CiBoxList } from "react-icons/ci";
import Devis from "../contrat/Devis";
import ListeDevisGestio from "../contrat/ListeDevisGestio";
import Agenda from "../Agenda";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import BlocNotes from "../BlocNotes";
// Les composants pour chaque section de la dashboard
function DashboardContent() {
  return <div><Dashboard/></div>;
}

function ListeContrats() {
  return <div><ListeContratsGestio /></div>;
}

function ListeEmployes() {
  return <div><ListeEmp/></div>;
}

export default function Gestionnaire() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [etat, setEtat] = useState('');
  const [notifications, setNotifications] = useState([]); 
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
          setEtat(response.data.user.etat);
          if (response.data.user.notifications) {
            setNotifications(response.data.user.notifications);
          } else {
            setNotifications([]);
          }
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
          const response = await axios.get('http://localhost:5000/api/profile', {
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
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
        "http://localhost:5000/api/status",
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

  const renderComponent = () => {
    if (etat === 0) return null;
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard /> ;
      case 'listeContrats':
        return <ListeContratsGestio />;
      case 'AjoutContrat':
        return <Souscription />;
      case 'AjoutDevis':
        return <Devis />;
      case 'listeDevis':
        return <ListeDevisGestio />;
      case 'Agenda':
        return <Agenda />;
      case 'NonValide':
        return <ContratNvalideGestio />;
      case 'BlocNote':
        return <BlocNotes />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex">
      <Card className="h-[calc(100vh-2rem)]  min-w-[20rem] p-4 shadow-xl bg-blue-gray-500 text-white">
        <img className="object-cover w-auto h-24" src={logo} alt="" />
        <List>
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
          <ListItem onClick={() => setActiveComponent('dashboard')} className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}>
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Tableau de Bord
          </ListItem>
          <ListItem onClick={() => setActiveComponent('listeContrats')} className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}>
            <ListItemPrefix>
              <CiBoxList className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Liste des contrats
          </ListItem>
          <ListItem onClick={() => setActiveComponent('AjoutContrat')} className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}>
            <ListItemPrefix>
              <FaFileContract className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Souscription
          </ListItem>
          <ListItem onClick={() => setActiveComponent('AjoutDevis')} className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}>
            <ListItemPrefix>
              <MdOutlinePriceChange className="h-5 w-5" />
            </ListItemPrefix>
            Devis
          </ListItem>
          <ListItem onClick={() => setActiveComponent('listeDevis')} className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}>
            <ListItemPrefix>
              <CiBoxList className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Liste des Devis
          </ListItem>
          <ListItem onClick={() => setActiveComponent('BlocNote')} className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}>
            <ListItemPrefix>
              <GiNotebook className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Bloc note
          </ListItem>
          <ListItem onClick={() => setActiveComponent('NonValide')} className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}>
            <ListItemPrefix>
              <VscError className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Contrats non finalisé
          </ListItem>
          <ListItem onClick={handleLogout} className="hover:bg-blue-600 text-white">
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Se déconnecter
          </ListItem>
        </List>
      </Card>
      <div className="flex-1 p-6">
        {renderComponent()}
      </div>
    </div>
  );
}
