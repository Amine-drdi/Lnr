import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';

function  Souscription({ contrat, setContrat, setIsAdding }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [commercial, setcommercial] = useState('');
  const [email, setEmail] = useState('');
  const [signatureDate, setSignatureDate] = useState('');
  const [effetDate, setEffetDate] = useState('');
  const [signatureType, setSignatureType] = useState('');
  const [comment, setComment] = useState('');
  const [signatureType2, setSignatureType2] = useState('');
  const [contribution, setContribution] = useState('');
  const [num_ancien_contrat, setNum_ancien_contrat] = useState('');
  const [telephone, setTelephone] = useState('');
  const [managerComment, setManagerComment] = useState('');
  const textInput = useRef(null);

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !signatureDate || !effetDate || !signatureType || !comment || !signatureType2 || !contribution || !num_ancien_contrat || !telephone || !managerComment || !commercial) {
      return Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Tous les champs sont obligatoires.',
        showConfirmButton: true,
        timer: 1500,
      });
    }

    const newContrat = {
      firstName,
      lastName,
      email,
      signatureDate,
      effetDate,
      signatureType,
      comment,
      signatureType2,
      contribution,
      num_ancien_contrat,
      telephone ,
      managerComment,
      commercial
    };

    try {
      const response = await fetch('http://51.83.69.195:5000/api/contrats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContrat),
      });

      if (response.ok) {
        const result = await response.json();
        if (typeof setContrat === 'function') {
          setContrat((prevContrats) => [...prevContrats, result.contrat]);
        } else {
          console.error('setContrat n\'est pas une fonction');
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Ajouté',
          text: `Les données de ${firstName} ${lastName} ont été ajoutées.`,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        throw new Error('Erreur lors de l\'ajout du contrat');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible d\'ajouter le contrat.',
        showConfirmButton: true,
        timer: 1500,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 justify-center bg-blue-gray-200 rounded-md shadow-md">
      <form onSubmit={handleAdd} className="space-y-4">
        <h1 className="text-2xl font-semibold mb-4 text-blue-gray-600">Ajouter un Contrat</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-blue-gray-500">Nom</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-blue-gray-500">Prénom</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="Commercial" className="block text-sm font-medium text-blue-gray-500">Nom commercial</label>
            <input
              id="commercial"
              type="text"
              name="commercial"
              value={commercial}
              onChange={(e) => setcommercial(e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </div>
        </div>
        <label htmlFor="email" className="block text-sm font-medium text-blue-gray-500">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="signatureDate" className="block text-sm font-medium text-blue-gray-500">Date de Signature</label>
            <input
              id="signatureDate"
              type="date"
              name="signatureDate"
              value={signatureDate}
              onChange={(e) => setSignatureDate(e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="effetDate" className="block text-sm font-medium text-blue-gray-500">Date d'effet</label>
            <input
              id="effetDate"
              type="date"
              name="effetDate"
              value={effetDate}
              onChange={(e) => setEffetDate(e.target.value)}
              className="border rounded-md p-2 w-full"
            />
          </div>
        </div>
        <label htmlFor="signatureType" className="block text-sm font-medium text-blue-gray-500">Type de Signature</label>
        <select
          id="signatureType"
          name="signatureType"
          value={signatureType}
          onChange={(e) => setSignatureType(e.target.value)}
          className="border rounded-md p-2 w-full"
        >
          <option value="">Sélectionnez le type</option>
          <option value="Lead">Lead</option>
          <option value="RDV">RDV</option>
          <option value="RDV à chaud">RDV à chaud</option>
        </select>
        <label htmlFor="comment" className="block text-sm font-medium text-blue-gray-500">Commentaire</label>
        <textarea
          id="comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded-md p-2 w-full"
          rows="3"
        />
        <label htmlFor="signatureType2" className="block text-sm font-medium text-blue-gray-500">Compagnie</label>
        <select
          id="signatureType2"
          name="signatureType2"
          value={signatureType2}
          onChange={(e) => setSignatureType2(e.target.value)}
          className="border rounded-md p-2 w-full"
        >
          <option value="">Sélectionnez la compagnie</option>
          <option value="Neolyane">Néoliane</option>
          <option value="Assurema">Assurema</option>
          <option value="Alptis">Alptis</option>
          <option value="April">April</option>
          <option value="Malakoff Humanis">Malakoff Humanis</option>
          <option value="Cegema">Cegema</option>
          <option value="Swisslife">Swisslife</option>
        </select>
        <label htmlFor="contribution" className="block text-sm font-medium text-blue-gray-500">Cotisation</label>
        <input
          id="contribution"
          type="text"
          name="contribution"
          value={contribution}
          onChange={(e) => setContribution(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
        <label htmlFor="num_ancien_contrat" className="block text-sm font-medium text-blue-gray-500">Numéro ancien contrat</label>
        <input
          id="num_ancien_contrat"
          type="text"
          name="num_ancien_contrat"
          value={num_ancien_contrat}
          onChange={(e) => setNum_ancien_contrat(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
        <label htmlFor="telephone" className="block text-sm font-medium text-blue-gray-500">Numéro de Téléphone</label>
        <input
          id="telephone"
          type="tel"
          name="telephone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
        <label htmlFor="managerComment" className="block text-sm font-medium text-blue-gray-500">Commentaire pour le Gestionnaire</label>
        <textarea
          id="managerComment"
          name="managerComment"
          value={managerComment}
          onChange={(e) => setManagerComment(e.target.value)}
          className="border rounded-md p-2 w-full "
          rows="3"
        />
        <div className="mt-4 flex space-x-2">
          <button type="submit" className="px-4 py-2 bg-blue-gray-700 hover:bg-blue-600 text-white rounded-md">Ajouter</button>
          <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-800 hover:bg-red-600 text-white rounded-md">Annuler</button>
        </div>
      </form>
    </div>

    /*
    app.get('/api/contrats/months', async (req, res) => {
  try {
    const contrats = await Contrat.aggregate([
      {
        // Filtrer les documents avec une date valide au format DD/MM/YYYY
        $match: {
          signatureDate: {
            $regex: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
          }
        }
      },
      {
        // Convertir signatureDate en véritable objet Date (YYYY-MM-DD)
        $addFields: {
          signatureDateObject: {
            $dateFromString: {
              dateString: { $concat: [
                { $substr: ['$signatureDate', 6, 4] }, '-', // Année
                { $substr: ['$signatureDate', 3, 2] }, '-', // Mois
                { $substr: ['$signatureDate', 0, 2] } // Jour
              ] },
              format: "%Y-%m-%d"
            }
          }
        }
      },
      {
        // Extraire le mois et l'année
        $project: {
          month: { $month: "$signatureDateObject" },
          year: { $year: "$signatureDateObject" }
        }
      },
      {
        // Grouper par année et mois et compter les contrats
        $group: {
          _id: { year: "$year", month: "$month" },
          count: { $sum: 1 }
        }
      },
      {
        // Trier les résultats par année et mois
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    res.status(200).json(contrats);
  } catch (error) {
    console.error('Erreur lors de l\'agrégation des contrats par mois :', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
}); */
  );
}

export default Souscription;
