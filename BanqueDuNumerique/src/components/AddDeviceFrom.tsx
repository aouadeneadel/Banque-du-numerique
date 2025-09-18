import React, { useState } from 'react';

export default function AddDeviceForm() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost/BanqueDuNumerique/backend/add_device.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessage('Appareil ajouté avec succès !');
          setName('');
          setType('');
        } else {
          setMessage('Erreur : ' + data.error);
        }
      })
      .catch(() => setMessage('Erreur de connexion au backend'));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Nom de l'appareil"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{ marginRight: 10 }}
      />
      <input
        type="text"
        placeholder="Type"
        value={type}
        onChange={e => setType(e.target.value)}
        required
        style={{ marginRight: 10 }}
      />
      <button type="submit">Ajouter</button>
      {message && (
        <div style={{ marginTop: 10, color: message.startsWith('Erreur') ? 'red' : 'green' }}>
          {message}
        </div>
      )}
    </form>
  );
}