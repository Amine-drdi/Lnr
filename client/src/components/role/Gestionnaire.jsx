import React, { useState , useEffect} from "react";
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
import { FaFileContract, FaUsers, FaRegCalendarCheck } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { RiUserAddLine } from "react-icons/ri";
import { FaRegCopyright } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png";
import img from "../../assets/gestionnaire.png";
import ListeEmp from "../ListeEmp";
import ListeContratsGestio from "../contrat/ListeContratsGestio";
import Addcommerciale from "../Addcommerciale";
import Souscription from "../contrat/Souscription";
import ProfileSetting from "../ProfileSetting";



// Les composants pour chaque section de la dashboard
function DashboardContent() {
  return <div></div>;
}

function ListeContrats() {
  return <div><ListeContratsGestio /></div>;
}

function ListeEmployes() {
  return <div><ListeEmp/></div>;
}

function AjouterEmploye() {
  return <div><Addcommerciale/></div>;
}

function Calendrier() {
  return <div><Calend/></div>;
}

export default function Gestionnaire() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [notifications, setNotifications] = useState([]); 
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
          
          // Vérifiez les données du profil
          console.log("Profil de l'utilisateur:", response.data.user);

          setUserName(response.data.user.name);

          // Vérifiez si les notifications existent
          if (response.data.user.notifications) {
            setNotifications(response.data.user.notifications);
          } else {
            setNotifications([]); // Assurez-vous que c'est un tableau vide par défaut
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
        return ;
      case 'listeContrats':
        return <ListeContrats />;
        case 'AjoutContrat':
          return <Souscription />;
      case 'listeEmployes':
        return <ListeEmployes />;
      case 'ajouterEmploye':
        return <AjouterEmploye />;
     case 'profile':
        return <ProfileSetting />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl bg-blue-gray-500 text-white">
        <img
          className="object-cover w-auto h-24"
          src={logo}
          alt=""
        />


        <List>

        <div className="text-light-blue-900 pl-5 mb-4 pt-8 flex items-center space-x-2">
          <Typography variant="h6" className="flex items-center">
            <img className="object-cover w-auto h-12" src={img} alt="User" />
            {userName}
          </Typography>
        </div>

                {/* Affichage des notifications */}
                <List>
          {notifications.map((notification, index) => (
            <ListItem key={index} className="hover:bg-blue-600 text-white">
              {notification}
            </ListItem>
          ))}
        </List>
          <ListItem onClick={() => setActiveComponent('dashboard')} className="hover:bg-blue-600 text-white">
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Tableau de Bord
          </ListItem>
          <ListItem onClick={() => setActiveComponent('listeContrats')} className="hover:bg-blue-600 text-white">
            <ListItemPrefix>
              <FaFileContract className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Consulter la liste des contrats
          </ListItem>
          <ListItem onClick={() => setActiveComponent('AjoutContrat')} className="hover:bg-blue-600 text-white">
            <ListItemPrefix>
              <FaFileContract className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Souscription
          </ListItem>

          <ListItem onClick={() => setActiveComponent('listeEmployes')} className="hover:bg-blue-600 text-white">
            <ListItemPrefix>
              <FaUsers className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Liste des employés
          </ListItem>
          <ListItem onClick={() => setActiveComponent('ajouterEmploye')} className="hover:bg-blue-600 text-white">
            <ListItemPrefix>
              <RiUserAddLine className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Ajouter un employé
          </ListItem>
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