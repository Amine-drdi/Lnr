import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';

const Calendrier = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Récupérer les événements depuis le serveur
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/appointments'); // Adapter l'URL de votre API
        console.log('Données récupérées du serveur :', response.data);

        // Formater les événements pour FullCalendar
        const formattedEvents = response.data.map((event) => {
          if (!event.date || !event.time) {
            console.error("La date ou l'heure est manquante pour l'événement :", event);
            return null; // Si la date ou l'heure est manquante, on ignore cet événement
          }

          // Convertir la date en objet Date
          const eventDate = new Date(event.date);

          // Extraire la date (yyyy-mm-dd) et l'heure (hh:mm)
          const eventDateString = eventDate.toISOString().split('T')[0]; // Format: yyyy-mm-dd
          const eventTimeString = event.time.replace('h', ':00'); // Format: hh:mm

          // Créer la chaîne de date + heure pour FullCalendar
          const eventStart = `${eventDateString}T${eventTimeString}`;

          // Formater l'événement
          const formattedEvent = {
            title: event.title,
            start: eventStart, // Formaté comme yyyy-mm-ddThh:mm
            extendedProps: {
              subtitle: event.subtitle,
              participants: event.participants,
            },
          };

          return formattedEvent;
        }).filter(event => event !== null); // Filtrer les événements invalides

        console.log("Événements formatés pour FullCalendar :", formattedEvents);
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements :', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Calendrier des Rendez-vous</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth" // Vue initiale (peut être modifiée selon le besoin)
        events={events} // Liste des événements formatés
        eventClick={(info) => {
          console.log('Événement cliqué :', info.event);
        }}
      />
    </div>
  );
};

export default Calendrier;
