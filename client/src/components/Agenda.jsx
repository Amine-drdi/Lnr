import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, addDays, startOfWeek } from "date-fns";

const Agenda = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    subtitle: "",
    time: "",
    date: format(selectedDay, "yyyy-MM-dd"),
    participants: [],
  });
  const [eventToEdit, setEventToEdit] = useState(null);

  // Liste d'options de participants
  const availableParticipants = [
    { id: 1003, name: "Faten" },
    { id: 1004, name: "Hanene" },
    { id: 1005, name: "Anis" },
    { id: 1006, name: "Basma" },
    { id: 1007, name: "Felix" },
    { id: 1008, name: "Saliha" },
    { id: 1009, name: "Sabrine" },
    { id: 1010, name: "Amel" },
    { id: 1011, name: "Sami" },
    { id: 1012, name: "Mohamed" },
    { id: 1013, name: "Najeh" },
    { id: 1014, name: "Aymen" },
    { id: 1015, name: "Cyrine" },
    { id: 1016, name: "Refka" },
    { id: 1017, name: "Dhekra" },
    { id: 1018, name: "Olfa" },
    { id: 1018, name: "Imen Bouazizi" },
  ];

  useEffect(() => {
    axios.get("http://51.83.69.195:5000/events")
      .then((response) => setEvents(response.data))
      .catch((error) => console.error(error));
  }, []);

  const startDate = startOfWeek(selectedDay, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }).map((_, idx) => addDays(startDate, idx));
  const formatDate = (date) => format(date, "yyyy-MM-dd");

  const handlePreviousWeek = () => setSelectedDay(addDays(selectedDay, -7));
  const handleNextWeek = () => setSelectedDay(addDays(selectedDay, 7));

  const handleAddEvent = () => {
    setIsAdding(true);
    setIsEditing(false);
  };

  const handleSaveEvent = () => {
    if (isEditing) {
      axios.put(`http://51.83.69.195:5000/events/${eventToEdit._id}`, newEvent)
        .then((response) => {
          setEvents(events.map((e) => (e._id === eventToEdit._id ? response.data : e)));
          setIsEditing(false);
        })
        .catch((error) => console.error(error));
    } else {
      axios.post("http://51.83.69.195:5000/events", newEvent)
        .then((response) => {
          setEvents([...events, response.data]);
          setIsAdding(false);
        })
        .catch((error) => console.error(error));
    }
    setNewEvent({ title: "", subtitle: "", time: "", date: format(selectedDay, "yyyy-MM-dd"), participants: [] });
  };

  const handleEditEvent = (event) => {
    setIsEditing(true);
    setIsAdding(true);
    setNewEvent(event);
    setEventToEdit(event);
  };

  const handleDeleteEvent = (id) => {
    axios.delete(`http://51.83.69.195:5000/events/${id}`)
      .then(() => setEvents(events.filter((event) => event._id !== id)))
      .catch((error) => console.error(error));
  };

  const handleSelectParticipant = (e) => {
    const participantId = e.target.value;
    const participant = availableParticipants.find((p) => p.id.toString() === participantId);
    if (participant && !newEvent.participants.includes(participant)) {
      setNewEvent({ ...newEvent, participants: [...newEvent.participants, participant] });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-700">Agenda</h2>
        <div className="flex items-center space-x-4">
          <button onClick={handlePreviousWeek} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">{"<"}</button>
          <button onClick={handleAddEvent} className="p-2 px-4 bg-green-600 text-white rounded-lg shadow">Ajouter un RDV</button>
          <button onClick={handleNextWeek} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">{">"}</button>
        </div>
      </div>

      <div className="flex justify-between mb-8">
        {daysOfWeek.map((day, index) => (
          <button
            key={index}
            className={`flex flex-col items-center p-4 w-16 rounded-lg transition ${
              formatDate(day) === formatDate(selectedDay)
                ? "bg-blue-gray-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedDay(day)}
          >
            <div className="font-bold text-lg">{format(day, "E")}</div>
            <div className="text-sm">{format(day, "dd MMM")}</div>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {events
          .filter((event) => event.date === formatDate(selectedDay))
          .map((event) => (
            <div key={event._id} className="p-6 bg-gray-50 rounded-lg shadow-lg transition hover:bg-indigo-50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.time}</p>
              </div>
              <p className="text-gray-600 mb-2">{event.subtitle}</p>

              <div className="flex space-x-2">
                {event.participants.map((participant, idx) => (
                  <div key={idx} className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-800">
                    {participant.name.charAt(0)}
                  </div>
                ))}
                <button onClick={() => handleEditEvent(event)} className="text-blue-600">Modifier</button>
                <button onClick={() => handleDeleteEvent(event._id)} className="text-red-600">Supprimer</button>
              </div>
            </div>
          ))}
      </div>

      {isAdding && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{isEditing ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}</h3>
          <input
            type="text"
            placeholder="Heure"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="text"
            placeholder="Titre"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="text"
            placeholder="Sous-titre"
            value={newEvent.subtitle}
            onChange={(e) => setNewEvent({ ...newEvent, subtitle: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          />
          <select onChange={handleSelectParticipant} className="w-full p-2 mb-4 border rounded">
            <option value="">Sélectionner un participant</option>
            {availableParticipants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
          <div className="flex space-x-2 mb-4">
            {newEvent.participants.map((participant, idx) => (
              <span key={idx} className="p-2 bg-gray-300 rounded-full">{participant.name}</span>
            ))}
          </div>
          <button onClick={handleSaveEvent} className="p-2 px-4 bg-blue-600 text-white rounded-lg shadow">Enregistrer</button>
          <button onClick={() => setIsAdding(false)} className="p-2 px-4 bg-gray-400 text-white rounded-lg shadow">Fermer</button>
        </div>
      )}
    </div>
  );
};

export default Agenda;
