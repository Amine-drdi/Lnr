import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import frLocale from '@fullcalendar/core/locales/fr';
// Fonction pour convertir une date au format "DD/MM/YYYY" ou "YYYY-MM-DD" en objet Date
const parseDate = (dateString) => {
  if (!dateString) return null;

  let parts;
  if (dateString.includes('/')) {
    parts = dateString.split('/');
    if (parts[2].length === 4) {
      // Format "DD/MM/YYYY"
      return new Date(parts[2], parts[1] - 1, parts[0]);
    } else if (parts[0].length === 4) {
      // Format "YYYY/MM/DD"
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
  } else if (dateString.includes('-')) {
    parts = dateString.split('-');
    if (parts[0].length === 4) {
      // Format "YYYY-MM-DD"
      return new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      // Format "DD-MM-YYYY"
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
  }
  
  console.error("Date invalide :", dateString);
  return null;
};

const CalendarDevis = () => {
    const [devis, setDevis] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Name, setName] = useState('');
  const navigate = useNavigate();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Nouveau modal pour afficher les détails
  const [selectedDevis, setSelectedDevis] = useState(null);  // Pour stocker les détails du devis sélectionné
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    dob: '',
    address: '',
    profession: '',
    devisDate: '',
    cotisation: '',
    compagnie: '',
    effetDate: '',
    formulePropose: '',
    fraisDossier: '',
    niveauPropose: '',
    apporteurAffaire: '',
    commentaireAgent: '',
    ancienneMutuelle: ''
  });

   // Fonction pour récupérer les devis depuis le backend
   const fetchDevis = async () => {
    try {
      const response = await axios.get('/api/devis-recup');
      const devisData = response.data.map((devis) => ({
        id: devis._id,
        title: `${devis.nom.toLocaleUpperCase()} ${devis.prenom.toLocaleUpperCase()}`,
        start: parseDate(devis.devisDate),
        ...devis,
      })).filter((devis) => devis.start);
      setDevis(devisData);
    } catch (error) {
      console.error('Erreur lors de la récupération des devis', error);
    }
  };

  useEffect(() => {
    fetchDevis();
  }, []);

  const handleSelectEvent = (info) => {
    const selectedDevis = devis.find(d => d.id === info.event.id);
    setSelectedDevis(selectedDevis);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedDevis(null);
  };
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
          setName(response.data.user.name);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDevis = async () => {
    try {
      const response = await fetch('/api/calend-devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Envoie des données en JSON
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du devis');
      }
  
      const result = await response.json();
      console.log(result.message); // Afficher un message de succès ou d'erreur
  
      // Ajoutez le devis au calendrier si nécessaire
      setDevis([...devis, { title: `${formData.nom} ${formData.prenom}`, start: new Date(formData.devisDate) }]);
      
      setIsModalOpen(false);
      setFormData({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        dob: '',
        address: '',
        profession: '',
        devisDate: '',
        cotisation: '',
        compagnie: '',
        effetDate: '',
        formulePropose: '',
        fraisDossier: '',
        niveauPropose: '',
        apporteurAffaire: '',
        commentaireAgent: '',
        ancienneMutuelle: ''
      });
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue lors de l\'ajout du devis');
    }
  };
  
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
  }, [isModalOpen]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-blue-gray-700 mb-4">Agenda des devis</h1>
      
      <Button onClick={() => setIsModalOpen(true)} color="green" size="lg">
        Ajouter un Devis  
      </Button>

      <Dialog open={isModalOpen} handler={() => setIsModalOpen(false)} portal container={document.body}>
        <DialogHeader>Ajouter un Devis</DialogHeader>
        <DialogBody divider className="max-h-[60vh] overflow-y-auto">
          <form className="space-y-4">
            {/* Ligne Nom et Prénom */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            {/* Ligne Téléphone et Email */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Téléphone</label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            {/* Ligne Date de naissance et Adresse */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Date de Naissance</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            {/* Ligne Profession et Date de Devis */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            {/* Ligne cotisation et Date de Devis */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Date de Devis</label>
                <input
                  type="date"
                  name="devisDate"
                  value={formData.devisDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Montant vp</label>
                <input
                  type="number"
                  name="cotisation"
                  value={formData.cotisation}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Date d'effet</label>
                <input
                  type="date"
                  name="effetDate"
                  value={formData.effetDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Compagnie</label>
                <input
                  type="text"
                  name="compagnie"
                  value={formData.compagnie}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">formule Proposé</label>
                <input
                  type="text"
                  name="formulePropose"
                  value={formData.formulePropose}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Frais de dossier</label>
                <input
                  type="number"
                  name="fraisDossier"
                  value={formData.fraisDossier}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Niveau proposé</label>
                <input
                  type="text"
                  name="niveauPropose"
                  value={formData.niveauPropose}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Ancienne mutuelle</label>
                <input
                  type="text"
                  name="ancienneMutuelle"
                  value={formData.ancienneMutuelle}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
          </div>
          <div className="flex space-x-4">
          <div className="flex-1">
          <label className="text-sm font-medium">Apporteur d'affaire</label>
                <input
                  type="text"
                  name="apporteurAffaire"
                  value={formData.apporteurAffaire}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full "
                />
          </div>
          </div>

          <div >
          <label className="text-sm font-medium">Commentaire</label>
          <textarea
                  type="text"
                  name="commentaireAgent"
                  value={formData.commentaireAgent}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full "
                  rows="4"
          ></textarea>
          </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setIsModalOpen(false)} className="mr-2">
            Annuler
          </Button>
          <Button color="green" onClick={handleAddDevis}>
            Ajouter
          </Button>
        </DialogFooter>
      </Dialog>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
      <FullCalendar
          locale={frLocale}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={devis}
          eventClick={handleSelectEvent}  // Capture le clic sur l'événement (devis)
          height="auto"
          contentHeight="auto"
          aspectRatio={1.35}
          buttonText={{
            today: "Aujourd'hui",
          }}
        />
      </div>
        {/* Modal de détails du devis */}
        {selectedDevis && (
        <Dialog
          open={Boolean(selectedDevis)}
          handler={handleCloseDetailsModal}
          className="relative bg-white m-4 rounded-lg shadow-2xl text-blue-gray-500 "
          style={{
          opacity: isDetailsModalOpen ? 1 : 0, // Affiche la modal si `isDetailsModalOpen` est `true`
          transform: isDetailsModalOpen ? 'translateY(0)' : 'translateY(-50px)', // Positionne la modal correctement
          transition: 'opacity 0.3s ease, transform 0.3s ease' // Ajoute une transition
          }}
        >
        <DialogHeader>Détails du Devis</DialogHeader>
        <DialogBody divider>
      <div>
      <h3 className="font-semibold">Nom et Prénom:</h3>
      <p >{selectedDevis.nom.toUpperCase()} {selectedDevis.prenom.toUpperCase()}</p>
      </div>
      <div>
       <h3 className="font-semibold">Téléphone: </h3>
       <p>{selectedDevis.telephone}</p>
      </div>
      <div>
      <h3 className="font-semibold">Email:</h3>
      <p>{selectedDevis.email}</p>
      </div>
      <div>
      <h3 className="font-semibold">Profession:</h3>
      <p>{selectedDevis.profession}</p>
      </div>
      <div>
      <h3 className="font-semibold">Date du Devis:</h3>
      <p>{selectedDevis.devisDate}</p>
      </div>
      <div>
      <h3 className="font-semibold">Compagnie:</h3>
      <p>{selectedDevis.compagnie}</p>
      </div>
      <div>
      <h3 className="font-semibold">Formule Proposée:</h3>
      <p>{selectedDevis.formulePropose}</p>
      </div>
      <div>
      <h3 className="font-semibold">Montant Cotisation:</h3>
      <p>{selectedDevis.cotisation}</p>
      </div>
      <div>
      <h3 className="font-semibold">Commentaire de l'Agent:</h3>
      <p>{selectedDevis.commentaireAgent}</p>
      </div>
      </DialogBody>

      <DialogFooter>
      <Button variant="text" color="red" onClick={handleCloseDetailsModal} className="mr-2">
       Fermer
      </Button>
    </DialogFooter>
    </Dialog>
)}


    </div>
  );
};

export default CalendarDevis;
