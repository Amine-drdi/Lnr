import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import  Gestionnaire  from './components/role/Gestionnaire';
import Commercial from './components/role/Commercial';
import Signup from './components/Signup';
import Addcommerciale from './components/Addcommerciale';
import ListeEmp from './components/ListeEmp';
import Calend from './components/Calend';
import PrivateRoute from './components/PrivateRoute'; // Importez le composant PrivateRoute
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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/contratsGest" element={<ListeContratsGestio />} />
        <Route path="/contratsComm" element={<ListeContratsComm />} />
        <Route path="/contratsDire" element={<ListeContratsDirec/>} />
        <Route path="/contratsManager" element={<ListeContratsManager />} />
        <Route path="/ajouter-contrat" element={<Souscription />} />
        <Route path="/Liste-employe" element={<ListeEmp />} />
        <Route path="/ajout-employe" element={<Addcommerciale />} />
       {/* <Route path="/gestionnaire-contrats" element={<ContratsGestionnaire />} />*/}
        <Route path="/calendrier" element={<Calend />} />
        <Route path="/profile-settings" element={<ProfileSetting/>} />
        <Route path="/contrats-non-valide" element={<ContratNonValide />} />
        <Route path="/contrats-non-valide" element={<ContratNvalideGestio />} />
        {/* Routes protégées */}
        <Route 
          path="/gestionnaire" 
          element={<PrivateRoute element={<Gestionnaire />} allowedRoles={['Gestionnaire']} />} 
        />

        <Route 
          path="/commerciale" 
          element={<PrivateRoute element={<Commercial />} allowedRoles={['Commerciale']} />} 
        />
         <Route 
          path="/direction" 
          element={<PrivateRoute element={<Direction/>} allowedRoles={['Direction']} />} 
        />
                 <Route 
          path="/manager" 
          element={<PrivateRoute element={<Manager/>} allowedRoles={['Manager']} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
