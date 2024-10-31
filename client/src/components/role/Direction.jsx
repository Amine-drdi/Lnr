import React, { useState, useEffect } from "react";
import axios from 'axios';

import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { IoIosAddCircle } from "react-icons/io";
import { IoCalendarNumber } from "react-icons/io5";
import { ImUsers } from "react-icons/im";
import { MdOutlinePriceChange } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { VscError } from "react-icons/vsc";
import { FaFileContract, FaUsers } from "react-icons/fa6";
import { FaHeartbeat } from "react-icons/fa";
import { GiDiploma } from "react-icons/gi";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { FaListCheck } from "react-icons/fa6";
import logo from "../../assets/logo.png";
import img from "../../assets/direction.png";
import ListeContratsDirec from "../contrat/ListeContratsDirec";
import Souscription from "../contrat/Souscription";
import ContratNonValide from "../contrat/ContratNonValide";
import ListeRdvDirection from "../Opco/ListRdvDirection";
import ListeEmp from "../ListeEmp";
import Dashboard from "../Dashboard";
import Devis from "../contrat/Devis";
import ListeDevisDirec from "../contrat/ListeDevisDirec";
import ProfileSetting from "../ProfileSetting";
import SouscriptionOPCO from '../Opco/SouscriptionOPCO';
import { FaPlusCircle } from "react-icons/fa";
import Agenda from "../Agenda";
import AddAgent from "../AddAgent";
import { CiLogin } from "react-icons/ci";
import TablePointage from "../TablePointage";
import BlocNotes from "../BlocNotes";
import { GiNotebook } from "react-icons/gi";
export function Direction() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(0); // State for accordion
  const [showModal, setShowModal] = useState(false);
  const [previousNotificationCount, setPreviousNotificationCount] = useState(0);
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
    localStorage.removeItem('authToken');
    navigate('/');
  };
  
  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard />;
      case 'listeContrats':
        return <ListeContratsDirec/>;
        case 'listeDevis':
          return <ListeDevisDirec/>;
      case 'AjoutContrat':
        return <Souscription />;
        case 'AjoutDevis':
          return <Devis />;
      case 'listeEmployes':
        return <ListeEmp/>;
      case 'Addcomm':
        return <AddAgent/>
      case 'NonValide':
        return <ContratNonValide />;
      case 'RDV':
        return <ListeRdvDirection />;
      case 'profile':
        return <ProfileSetting/>;
        case 'AjoutRDV':
          return <SouscriptionOPCO />;
          case 'Agenda':
            return <Agenda />;
            case 'BlocNote':
              return <BlocNotes />;
            case 'Pointage':
              return <TablePointage/>;
      default:
        return <DashboardContent />;
    }
  };

  const handleAccordionOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };



  return (
    <div className="flex">
      
      <Card className="h-full min-w-[20rem] p-4 shadow-xl bg-blue-gray-500 text-white">
     
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

      
  
        <List>
      
        <ListItem onClick={() => setActiveComponent('dashboard')} className="hover:bg-blue-600 text-white ">
                  <ListItemPrefix>
                    <PresentationChartBarIcon className="h-5 w-5 text-white" />
                  </ListItemPrefix>
                  Tableau de Bord
                </ListItem>
          <Accordion open={open === 1} icon={<RiArrowDropDownLine  className="h-7 w-7 text-white " />}>
            <ListItem className="p-0">
              <AccordionHeader onClick={() => handleAccordionOpen(1)} className="border-b-0 p-3">
                <ListItemPrefix>
                  <FaHeartbeat  className="text-white h-5 w-5" />
                </ListItemPrefix>
                <Typography color="white" className="mr-auto font-normal">
                  Mutuelle
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                
                <ListItem onClick={() => setActiveComponent('listeContrats')} className="hover:bg-blue-600 text-white pl-10">
                  <ListItemPrefix>
                    <FaListCheck className="h-5 w-5 text-white" />
                  </ListItemPrefix>
                  Consulter la liste des contrats
                </ListItem>
                <ListItem onClick={() => setActiveComponent('AjoutContrat')} className="hover:bg-blue-600 text-white pl-10">
                  <ListItemPrefix>
                    <FaFileContract className="h-5 w-5 text-white" />
                  </ListItemPrefix>
                  Souscription
                </ListItem>

                <ListItem onClick={() => setActiveComponent('AjoutDevis')} className="hover:bg-blue-600 text-white pl-10" >
                <ListItemPrefix>
                <MdOutlinePriceChange className="h-5 w-5" />
                </ListItemPrefix>
                Devis
               </ListItem>
               <ListItem onClick={() => setActiveComponent('listeDevis')} className="hover:bg-blue-600 text-white pl-10">
                  <ListItemPrefix>
                    <FaListCheck className="h-5 w-5 text-white" />
                  </ListItemPrefix>
                  Liste des Devis
                </ListItem>
                <ListItem onClick={() => setActiveComponent('Agenda')} className="hover:bg-blue-600 text-white pl-10 ">
            <ListItemPrefix>
              <IoCalendarNumber className="h-5 w-5 text-white" />
            </ListItemPrefix>
           Agenda
          </ListItem>

                <ListItem onClick={() => setActiveComponent('NonValide')} className="hover:bg-blue-600 text-white pl-10">
                  <ListItemPrefix>
                    <VscError className="h-5 w-5 text-white" />
                  </ListItemPrefix>
                  Contrats non finalisés
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>

          <Accordion open={open === 2} icon={<RiArrowDropDownLine className="h-7 w-7 text-white" />}>
            <ListItem className="p-0">
              <AccordionHeader onClick={() => handleAccordionOpen(2)} className="border-b-0 p-3">
                <ListItemPrefix>
                  <GiDiploma className="h-5 w-5 text-white" />
                </ListItemPrefix>
                <Typography color="white" className="mr-auto font-normal">
                  OPCO
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem onClick={() => setActiveComponent('RDV')} className="hover:bg-blue-600 text-white pl-10">
                  <ListItemPrefix>
                    <FaListCheck className="h-5 w-5 text-white " />
                  </ListItemPrefix>
                  Liste des RDV opco
                </ListItem>
                <ListItem onClick={() => setActiveComponent('AjoutRDV')} className="hover:bg-blue-600 text-white pl-10">
                  <ListItemPrefix>
                    <FaPlusCircle className="h-5 w-5 text-white " />
                  </ListItemPrefix>
                  ajouter un RDV
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>
        </List>

        {/* Paramètres et déconnexion */}
        <List>
        <ListItem onClick={() => setActiveComponent('BlocNote')} className="hover:bg-blue-600 text-white  ">
            <ListItemPrefix>
              <GiNotebook className="h-5 w-5 text-white" />
            </ListItemPrefix>
           Bloc note
          </ListItem>
        <ListItem onClick={() => setActiveComponent('Pointage')} className="hover:bg-blue-600 text-white">
            <ListItemPrefix>
              <CiLogin className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Tableau de pointage 
          </ListItem>
        <ListItem onClick={() => setActiveComponent('listeEmployes')} className="hover:bg-blue-600 text-white">
            <ListItemPrefix>
              <ImUsers className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Liste des agents
          </ListItem>
          <ListItem onClick={() => setActiveComponent('Addcomm')} className="hover:bg-blue-600 text-white">
            <ListItemPrefix>
              <IoIosAddCircle className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Ajouter un agent
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
        {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative transform transition-all duration-500 overflow-y-auto max-h-screen">
      <button 
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition duration-150"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Nouvelles Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="bg-blue-100 p-3 rounded-md text-blue-900 flex items-start space-x-2"
          >
            <span className="text-lg">🔔</span>
            <p className="text-sm">
            <span className="font-bold"> {notification.userName}</span> est connecté sur LNR, et il/elle veut activé son compte {" "}

            </p>
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowModal(false)}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-150"
      >
        Fermer
      </button>
    </div>
  </div>
)}


      </div>
    
 
    </div>
  );
}