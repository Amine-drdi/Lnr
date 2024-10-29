import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Gestionnaire from './components/role/Gestionnaire';
import Commercial from './components/role/Commercial';
import Signup from './components/Signup';
import ListeEmp from './components/ListeEmp';
import PrivateRoute from './components/PrivateRoute'; 
import { Direction } from './components/role/Direction';
import ListeContratsGestio from './components/contrat/ListeContratsGestio';
import ListeContratsComm from './components/contrat/ListeContratsComm';
import ListeContratsDirec from './components/contrat/ListeContratsDirec';
import Souscription from './components/contrat/Souscription';
import Manager from './components/role/Manager';
import ProfileSetting from './components/ProfileSetting';
import ListeContratsManager from './components/contrat/ListeContratsManager';
import ContratNonValide from './components/contrat/ContratNonValide';
import ContratNvalideGestio from './components/contrat/ContratNvalideGestio';
import Dashboard from './components/Dashboard';
import CommercialsToday from './components/CommercialsToday';
import ProgressionChart from './components/ProgressionChart';
import Chart from './components/Chart';
import CommercialChart from './components/CommercialChart';
import AddAgent from './components/AddAgent';
import SouscriptionOPCO from './components/Opco/SouscriptionOPCO';
import ManagerOPCO from './components/Opco/ManagerOPCO';
import CommercialOPCO from './components/Opco/CommercialOPCO';
import ListeRdv from './components/Opco/ListeRdv';
import ListeRdvManager from './components/Opco/ListeRdvManager';
import CommercialVente from './components/Opco/CommercialVente';
import ListeRdvCommVente from './components/Opco/ListeRdvCommVente';
import Formation from './components/Opco/Formation';
import ListeRdvDirection from './components/Opco/ListRdvDirection';
import RdvToday from './components/Opco/RdvToday';
import Devis from './components/contrat/Devis';
import ListeDevisComm from './components/contrat/ListeDevisComm';
import ListeDevisGestio from './components/contrat/ListeDevisGestio';
import ListeDevisDirec from './components/contrat/ListeDevisDirec';
import Agenda from './components/Agenda';
import Prise from './components/role/Prise';
import ListeContratsPrise from './components/contrat/ListeContratsPrise';
import 'react-notifications-component/dist/theme.css';





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        {/* Routes protégées */}
        <Route 
          path="/contratsGest" 
          element={<PrivateRoute element={<ListeContratsGestio />} allowedRoles={['Gestionnaire']} />} 
        />
        <Route 
          path="/contratsComm" 
          element={<PrivateRoute element={<ListeContratsComm />} allowedRoles={['Commercial']} />} 
        />

        <Route 
          path="/contratsPrise" 
          element={<PrivateRoute element={<ListeContratsPrise />} allowedRoles={['Prise']} />} 
        />
  
        <Route 
          path="/contratsDire" 
          element={<PrivateRoute element={<ListeContratsDirec />} allowedRoles={['Direction']} />} 
        />
        <Route 
          path="/contratsManager" 
          element={<PrivateRoute element={<ListeContratsManager />} allowedRoles={['Manager']} />} 
        />
        
        <Route 
          path="/ajouter-contrat" 
          element={<PrivateRoute element={<Souscription />} allowedRoles={['Gestionnaire', 'Commercial']} />} 
        />
                <Route 
          path="/ajouter-devis" 
          element={<PrivateRoute element={<Devis />} allowedRoles={['Gestionnaire', 'Commercial']} />} 
        />
        <Route 
          path="/Liste-employe" 
          element={<PrivateRoute element={<ListeEmp />} allowedRoles={['Manager']} />} 
        />
        <Route 
          path="/ajout-employe" 
          element={<PrivateRoute element={<AddAgent />} allowedRoles={['Manager']} />} 
        />
        <Route 
          path="/dashboard" 
          element={<PrivateRoute element={<Dashboard />} allowedRoles={['Gestionnaire', 'Commercial', 'Direction', 'Manager']} />} 
        />
        <Route 
          path="/commToday" 
          element={<PrivateRoute element={<CommercialsToday />} allowedRoles={['Commercial', 'Manager']} />} 
        />
        <Route 
          path="/commClassement" 
          element={<PrivateRoute element={<CommercialChart />} allowedRoles={['Commercial', 'Manager']} />} 
        />
        <Route 
          path="/chart" 
          element={<PrivateRoute element={<Chart />} allowedRoles={['Gestionnaire', 'Direction', 'Manager']} />} 
        />
        <Route 
          path="/Agenda" 
          element={<PrivateRoute element={<Agenda />} allowedRoles={['Commercial', 'Manager', 'Direction']} />} 
        />
        <Route 
          path="/profile-settings" 
          element={<PrivateRoute element={<ProfileSetting />} allowedRoles={['Gestionnaire', 'Commercial', 'Direction', 'Manager']} />} 
        />
        <Route 
          path="/contrats-non-valide" 
          element={<PrivateRoute element={<ContratNonValide />} allowedRoles={['Direction', 'Manager']} />} 
        />
        <Route 
          path="/contrats-non-valideGestio" 
          element={<PrivateRoute element={<ContratNvalideGestio />} allowedRoles={['Gestionnaire']} />} 
        />
        <Route 
          path="/souscription-OPCO" 
          element={<PrivateRoute element={<SouscriptionOPCO />} allowedRoles={['Gestionnaire', 'ManagerOPCO']} />} 
        />
        <Route 
          path="/liste-RDV" 
          element={<PrivateRoute element={<ListeRdv />} allowedRoles={['CommercialeOPCO', 'ManagerOPCO']} />} 
        />
        <Route 
          path="/liste-RDV-manager" 
          element={<PrivateRoute element={<ListeRdvManager />} allowedRoles={['ManagerOPCO']} />} 
        />
          <Route 
          path="/liste-RDV-direction" 
          element={<PrivateRoute element={<ListeRdvDirection />} allowedRoles={['Direction']} />} 
        />
        <Route 
          path="/liste-RDV-commercial" 
          element={<PrivateRoute element={<ListeRdvCommVente />} allowedRoles={['ManagerOPCO' ,'CommercialeVente']} />} 
        />
        
        <Route 
          path="/formation" 
          element={<PrivateRoute element={<Formation />} allowedRoles={['SouscriptionOPCO']} />} 
        />
        <Route 
          path="/rdv-today" 
          element={<PrivateRoute element={<RdvToday />} allowedRoles={['Direction']} />} 
        />
         <Route 
          path="/devis-Comm" 
          element={<PrivateRoute element={<ListeDevisComm />} allowedRoles={['Commercial']} />} 
        />

          <Route 
          path="/devis-Gest" 
          element={<PrivateRoute element={<ListeDevisGestio />} allowedRoles={['Gestionnaire']} />} 
        />
                <Route 
          path="/devi-Direction" 
          element={<PrivateRoute element={<ListeDevisDirec />} allowedRoles={['Direction']} />} 
        />
        {/* Rôles spécifiques */}
        <Route 
          path="/gestionnaire" 
          element={<PrivateRoute element={<Gestionnaire />} allowedRoles={['Gestionnaire']} />} 
        />
        <Route 
          path="/commerciale" 
          element={<PrivateRoute element={<Commercial />} allowedRoles={['Commerciale']} />} 
        />
          <Route 
          path="/Prise" 
          element={<PrivateRoute element={<Prise />} allowedRoles={['Prise']} />} 
        />
        <Route 
          path="/direction" 
          element={<PrivateRoute element={<Direction />} allowedRoles={['Direction']} />} 
        />
   
        <Route 
          path="/manager" 
          element={<PrivateRoute element={<Manager />} allowedRoles={['Manager']} />} 
        />
    
        <Route 
          path="/manager-OPCO" 
          element={<PrivateRoute element={<ManagerOPCO />} allowedRoles={['ManagerOPCO']} />} 
        />
        <Route 
          path="/Commercial-OPCO" 
          element={<PrivateRoute element={<CommercialOPCO />} allowedRoles={['CommercialeOPCO']} />} 
        />
                <Route 
          path="/Commercial-Vente" 
          element={<PrivateRoute element={<CommercialVente />} allowedRoles={['CommercialeVente']} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
