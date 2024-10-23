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
import { VscError } from "react-icons/vsc";
import Calend from "../Calend";
import { FaFileContract , FaUsers } from "react-icons/fa6";
import { FaFileSignature } from "react-icons/fa";
import { RiUserAddLine } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png";
import ListeEmp from "../ListeEmp";
import ListeContratsDirec from "../contrat/ListeContratsDirec";
import Souscription from "../contrat/Souscription";
import img from "../../assets/direction.png"
import ProfileSetting from "../ProfileSetting";
import ContratNonValide from "../contrat/ContratNonValide";
import { CiBoxList } from "react-icons/ci";
import Dashboard from "../Dashboard";
import AddAgent from "../AddAgent";
import ListeRdvManager from "../Opco/ListeRdvManager";



// Les composants pour chaque section de la dashboard
function DashboardContent() {
  return <div><Dashboard/></div>;
}

function ListeContrats() {
  return <div><ListeContratsDirec/></div>;
}

function ListeEmployes() {
  return <div><ListeEmp/></div>;
}
function Addcomm() {
  return <div><AddAgent/></div>;
}



function Calendrier() {
  return <div><Calend/></div>;
}

export function Direction() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
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


  const handleLogout = () => {
    // Supprimer le token de l'utilisateur
    localStorage.removeItem('authToken');
    // Rediriger vers la page de login
    navigate('/');
  };

  // Fonction pour rendre le composant en fonction de l'état actif
  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard/> ;
      case 'listeContrats':
        return <ListeContrats />;
        case 'AjoutContrat':
          return <Souscription />;
      case 'listeEmployes':
        return <ListeEmployes />;
      case 'Addcomm':
        return <AddAgent/> ;
        case 'NonValide':
          return <ContratNonValide />;
          case 'RDV':
            return <ListeRdvManager />;
     case 'profile':
        return <ProfileSetting />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Card className="h-full  min-w-[20rem] p-4 shadow-xl bg-blue-gray-500 text-white">
  <img className="object-cover w-auto h-24" src={logo} alt="Logo" />

 
  <List>
    <ListItem onClick={() => setActiveComponent('dashboard')} className="hover:bg-blue-600 text-white">
      <ListItemPrefix>
        <PresentationChartBarIcon className="h-5 w-5 text-white" />
      </ListItemPrefix>
      Tableau de Bord
    </ListItem>
    <ListItem onClick={() => setActiveComponent('listeContrats')} className="hover:bg-blue-600 text-white">
      <ListItemPrefix>
        <CiBoxList className="h-5 w-5 text-white" />
      </ListItemPrefix>
      Consulter la liste des contrats
    </ListItem>
    <ListItem onClick={() => setActiveComponent('AjoutContrat')} className="hover:bg-blue-600 text-white">
      <ListItemPrefix>
        <FaFileContract className="h-5 w-5 text-white" />
      </ListItemPrefix>
      Souscription
    </ListItem>
  </List>

  <List>
    <ListItem onClick={() => setActiveComponent('NonValide')} className="hover:bg-blue-600 text-white">
      <ListItemPrefix>
        <VscError className="h-5 w-5 text-white" />
      </ListItemPrefix>
      Contrats non finalisés
    </ListItem>
    <ListItem onClick={() => setActiveComponent('RDV')} className="hover:bg-blue-600 text-white">
      <ListItemPrefix>
        <CiBoxList className="h-5 w-5 text-white" />
      </ListItemPrefix>
      Liste des RDV opco
    </ListItem>
    <ListItem onClick={() => setActiveComponent('listeEmployes')} className="hover:bg-blue-600 text-white">
      <ListItemPrefix>
        <FaUsers className="h-5 w-5 text-white" />
      </ListItemPrefix>
      Liste des employés
    </ListItem>
    <ListItem onClick={() => setActiveComponent('Addcomm')} className="hover:bg-blue-600 text-white">
      <ListItemPrefix>
        <RiUserAddLine className="h-5 w-5 text-white" />
      </ListItemPrefix>
      Ajouter un employé
    </ListItem>
  </List>

  {/* Paramètres et déconnexion */}
  <List>
    <ListItem onClick={() => setActiveComponent('profile')} className="hover:bg-blue-600 text-white">
      <ListItemPrefix>
        <IoSettingsSharp className="h-5 w-5 text-white" />
      </ListItemPrefix>
      Paramètres du profil
    </ListItem>
    <ListItem onClick={handleLogout} className="hover:bg-blue-600 text-white">
      <ListItemPrefix>
        <PowerIcon className="h-5 w-5 text-white" />
      </ListItemPrefix>
      Se déconnecter
    </ListItem>
  </List>
</Card>

     

      {/* Contenu affiché */}
      <div className="flex-1 p-6">
        {renderComponent()}
      </div>
    </div>
  );
}