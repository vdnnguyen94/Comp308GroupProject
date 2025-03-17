import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './VitalSigns.css'; // Import the CSS file

const LIST_VITAL_SIGNS = gql`
  query ListVitalSigns {
    listVitalSigns {
      userId
      heartRate
      bloodPressure
      temperature
      timestamp
    }
  }
`;

const CREATE_VITAL_SIGN = gql`
  mutation CreateVitalSign($userId: String!, $heartRate: Int!, $bloodPressure: String!, $temperature: Float!) {
    createVitalSign(userId: $userId, heartRate: $heartRate, bloodPressure: $bloodPressure, temperature: $temperature) {
      userId
      heartRate
      bloodPressure
      temperature
      timestamp
    }
  }
`;

const UPDATE_VITAL_SIGN = gql`
  mutation UpdateVitalSign($userId: String!, $heartRate: Int!, $bloodPressure: String!, $temperature: Float!) {
    updateVitalSign(userId: $userId, heartRate: $heartRate, bloodPressure: $bloodPressure, temperature: $temperature) {
      userId
      heartRate
      bloodPressure
      temperature
      timestamp
    }
  }
`;

const DELETE_VITAL_SIGN = gql`
  mutation DeleteVitalSign($userId: String!) {
    deleteVitalSign(userId: $userId)
  }
`;

const VitalSigns = () => {
  const { loading, error, data, refetch } = useQuery(LIST_VITAL_SIGNS);
  const [createVitalSign] = useMutation(CREATE_VITAL_SIGN);
  const [updateVitalSign] = useMutation(UPDATE_VITAL_SIGN);
  const [deleteVitalSign] = useMutation(DELETE_VITAL_SIGN);

  const [form, setForm] = useState({ userId: '', heartRate: 0, bloodPressure: '', temperature: 0.0 });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCreate = async () => {
    await createVitalSign({ variables: { ...form } });
    refetch();
    setForm({ userId: '', heartRate: 0, bloodPressure: '', temperature: 0.0 });
  };

  const handleUpdate = async () => {
    await updateVitalSign({ variables: { ...form } });
    refetch();
    setForm({ userId: '', heartRate: 0, bloodPressure: '', temperature: 0.0 });
    setIsUpdating(false);
  };

  const handleEdit = (sign) => {
    setForm(sign);
    setIsUpdating(true);
  };

  const handleDelete = async (userId) => {
    await deleteVitalSign({ variables: { userId } });
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading vital signs</p>;

  return (
    <div className="vital-signs-container container">
      <h2 className="text-center mb-4">Vital Signs</h2>
      <div className="card p-4 mb-4">
        <div className="form-group row mb-3">
          <label className="col-sm-4 col-form-label">User ID</label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group row mb-3">
          <label className="col-sm-4 col-form-label">Heart Rate</label>
          <div className="col-sm-8">
            <input
              type="number"
              className="form-control"
              value={form.heartRate}
              onChange={(e) => setForm({ ...form, heartRate: parseInt(e.target.value) })}
            />
          </div>
        </div>
        <div className="form-group row mb-3">
          <label className="col-sm-4 col-form-label">Blood Pressure</label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control"
              value={form.bloodPressure}
              onChange={(e) => setForm({ ...form, bloodPressure: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group row mb-3">
          <label className="col-sm-4 col-form-label">Temperature</label>
          <div className="col-sm-8">
            <input
              type="number"
              step="0.1"
              className="form-control"
              value={form.temperature}
              onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })}
            />
          </div>
        </div>
        <button
          className="btn btn-primary w-100"
          onClick={isUpdating ? handleUpdate : handleCreate}
        >
          {isUpdating ? 'Update Vital Sign' : 'Add Vital Sign'}
        </button>
      </div>
      <ul className="list-group">
        {data.listVitalSigns.map((sign) => (
          <li key={sign.userId} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{sign.userId}</strong> - {sign.heartRate} bpm, {sign.bloodPressure}, {sign.temperature}°C
            </div>
            <div>
              <button className="btn btn-secondary btn-sm me-2" onClick={() => handleEdit(sign)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(sign.userId)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VitalSigns;