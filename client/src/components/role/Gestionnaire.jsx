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
import { IoCalendarNumber } from "react-icons/io5";
import { MdOutlinePriceChange } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { FaFileContract} from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png";
import img from "../../assets/gestionnaire.png";
import ListeEmp from "../ListeEmp";
import ListeContratsGestio from "../contrat/ListeContratsGestio";
import Souscription from "../contrat/Souscription";
import ProfileSetting from "../ProfileSetting";
import ContratNvalideGestio from "../contrat/ContratNvalideGestio";
import Dashboard from "../Dashboard";
import { CiBoxList } from "react-icons/ci";
import Devis from "../contrat/Devis";
import ListeDevisGestio from "../contrat/ListeDevisGestio";
import Agenda from "../Agenda";

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
  const [isOnline, setIsOnline] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const renderComponent = () => {
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
      case 'profile':
        return <ProfileSetting />;
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
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 mt-4 font-semibold rounded-md  ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {isOnline ? 'En ligne' : 'Hors ligne'}
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
