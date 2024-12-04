import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

const Calendrier = () => {
  const [events, setEvents] = useState([]);

  // Charger les rendez-vous depuis le backend
  useEffect(() => {
    axios.get("/api/appointments").then((response) => {
      setEvents(response.data);
    });
  }, []);

  // Ajouter un rendez-vous
  const handleDateClick = (info) => {
    const title = prompt("Titre du rendez-vous :");
    const subtitle = prompt("Sous-titre :");
    const time = prompt("Heure (HH:mm) :");
    const participants = prompt("Participants (séparés par des virgules) :");

    if (title && time) {
      const newEvent = {
        title,
        subtitle,
        time,
        start: info.dateStr + "T" + time,
        participants: participants.split(","),
      };

      axios.post("/api/appointments", newEvent).then((response) => {
        setEvents([...events, response.data]);
      });
    }
  };

  return (
    <div className="px-6 py-20">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        events={events}
        dateClick={handleDateClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />
    </div>
  );
};

export default Calendrier;
