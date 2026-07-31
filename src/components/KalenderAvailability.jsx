import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, XCircle } from 'lucide-react';

export default function KalenderAvailability({ mobil, jadwalList = [], onSelectRange }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!mobil) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Nama Bulan Indonesia
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Hitung jumlah hari dalam bulan & hari pertama
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Filter jadwal sewa khusus untuk mobil ini
  const mobilJadwal = (Array.isArray(jadwalList) ? jadwalList : []).filter(
    j => j && (j.armadaId === mobil.id || j.namaMobil === mobil.nama)
  );

  // Helper untuk mengecek apakah suatu tanggal booked/terisi
  const isDateBooked = (day) => {
    const checkDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const checkTime = new Date(checkDateStr).getTime();

    return mobilJadwal.some(j => {
      if (!j.tanggalSewa || !j.tanggalKembali) return false;
      const startTime = new Date(j.tanggalSewa).getTime();
      const endTime = new Date(j.tanggalKembali).getTime();
      return checkTime >= startTime && checkTime <= endTime;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div style={{ padding: '12px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', margin: '14px 0' }}>
      {/* Header Navigasi Bulan */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CalendarIcon size={16} color="var(--accent-primary)" />
          <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 700 }}>
            {mobil.nama || 'Vehicle'} Availability
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button onClick={handlePrevMonth} className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '0.75rem' }}>
            <ChevronLeft size={14} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '0.8rem', minWidth: '100px', textAlign: 'center', color: 'var(--text-main)' }}>
            {monthNames[month]} {year}
          </span>
          <button onClick={handleNextMonth} className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '0.75rem' }}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Grid Nama Hari */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center', marginBottom: '6px' }}>
        {daysOfWeek.map((day, idx) => (
          <span key={idx} style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            {day}
          </span>
        ))}
      </div>

      {/* Grid Tanggal Kalender Light Mode */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {/* Blank Offset Days */}
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`blank-${i}`} style={{ height: '30px' }}></div>
        ))}

        {/* Days in Month */}
        {[...Array(daysInMonth)].map((_, i) => {
          const dayNumber = i + 1;
          const booked = isDateBooked(dayNumber);
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;

          return (
            <button
              key={dayNumber}
              disabled={booked}
              onClick={() => onSelectRange && onSelectRange(dateStr)}
              style={{
                height: '30px',
                borderRadius: '4px',
                border: booked ? '1px solid #fecaca' : '1px solid #a7f3d0',
                background: booked ? '#fee2e2' : '#d1fae5',
                color: booked ? '#991b1b' : '#065f46',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: booked ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              title={booked ? `Mobil ${mobil.nama} sudah dibooking` : `Pilih tanggal ${dateStr}`}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}
