import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './creatorcss/DonorList.css'

export default function DonorList() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const API_URL = `${import.meta.env.VITE_API_URL}/campaign`

  const getStoredDonations = () => {
    try {
      const raw = localStorage.getItem('donations')
      return raw ? JSON.parse(raw) : {}
    } catch { 
      return {} 
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        const storedCreator = localStorage.getItem('creator')
        const creatorId = storedCreator ? JSON.parse(storedCreator).id : null
        if (!creatorId) { 
          setError('Creator not logged in.') 
          return 
        }

        const res = await axios.get(`${API_URL}/by-creator/${creatorId}`)
        const donationsMap = getStoredDonations()

        const list = (res.data || [])
          .map(c => ({
            id: c.id,
            title: c.title,
            donated: Number(donationsMap[c.id] || 0),
            goal: c.goalAmount,
            startDate: c.startDate,
            endDate: c.endDate,
          }))
          .filter(r => r.donated > 0)

        setRows(list)
        setError('')
      } catch (e) {
        setError('Failed to load donor list')
      }
    }
    load()
  }, [])

  return (
    <div className="mycampaigns-container">
      <h2>Donations</h2>
      {error && <p className="error-message">{error}</p>}
      {rows.length === 0 ? (
        <p>No donations recorded in this browser.</p>
      ) : (
        <div className="campaign-table-wrap">
          <table className="campaign-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Donated</th>
                <th>Goal</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td className="collected">₹{r.donated}</td>
                  <td>₹{r.goal}</td>
                  <td>{r.startDate}</td>
                  <td>{r.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
