import React, { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";

const Agenda = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [events, setEvents] = useState([
    {
      date: "2024-10-27",
      title: "Bonjour",
      subtitle: "Réunion de projet",
      time: "09:00 - 11:00",
      link: "",
      participants: [{ name: "faten" }, { name: "Anis" }],
    },
    {
      date: "2024-10-27",
      title: "Hello",
      subtitle: "Discussion",
      time: "12:00 - 13:00",
      link: "",
      participants: [{ name: "hanene" }, { name: "amel" }],
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    subtitle: "",
    time: "",
    date: format(selectedDay, "yyyy-MM-dd"),
    link: "",
    participants: [],
  });

  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }).map((_, idx) => addDays(startDate, idx));
  const formatDate = (date) => format(date, "yyyy-MM-dd");

  const handleAddEvent = () => {
    setIsAdding(true);
  };

  const handleSaveEvent = () => {
    setEvents([...events, { ...newEvent, date: formatDate(selectedDay) }]);
    setIsAdding(false);
    setNewEvent({ title: "", subtitle: "", time: "", date: formatDate(selectedDay), link: "", participants: [] });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-700">Agenda</h2>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">{"<"}</button>
          <button className="p-2 px-4 bg-blue-gray-500 text-white rounded-lg shadow">Aujourd'hui</button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">{">"}</button>
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
          .map((event, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-lg shadow-lg transition hover:bg-indigo-50">
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
                <button className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-800">+</button>
              </div>
            </div>
          ))}
      </div>

      <button onClick={handleAddEvent} className="mt-6 p-2 px-4 bg-green-600 text-white rounded-lg shadow">
        Ajouter un rendez-vous
      </button>

      {isAdding && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Nouveau rendez-vous</h3>
          <input
            type="text"
            placeholder="Heure "
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
            type="Textarea"
            placeholder="Sous-titre"
            value={newEvent.subtitle}
            onChange={(e) => setNewEvent({ ...newEvent, subtitle: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          />
       
          <button onClick={handleSaveEvent} className="p-2 px-4 bg-blue-600 text-white rounded-lg shadow">
            Enregistrer
          </button>
        </div>
      )}
    </div>
  );
};

export default Agenda;
