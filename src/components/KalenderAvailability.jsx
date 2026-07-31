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
    <div className="glass-panel" style={{ padding: '20px', marginTop: '16px', background: 'rgba(15, 23, 42, 0.7)' }}>
      {/* Header Navigasi Bulan */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon size={18} color="var(--accent-secondary)" />
          <h4 style={{ margin: 0, fontSize: '0.95rem' }}>
            Jadwal Availability: <span style={{ color: 'var(--accent-secondary)' }}>{mobil.nama}</span>
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handlePrevMonth} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontWeight: 600, fontSize: '0.88rem', minWidth: '110px', textAlign: 'center' }}>
            {monthNames[month]} {year}
          </span>
          <button onClick={handleNextMonth} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Grid Nama Hari */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
        {daysOfWeek.map((day, idx) => (
          <span key={idx} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {day}
          </span>
        ))}
      </div>

      {/* Grid Tanggal Kalender */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {/* Blank Offset Days */}
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`blank-${i}`} style={{ height: '36px' }}></div>
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
                height: '36px',
                borderRadius: '6px',
                border: 'none',
                background: booked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                color: booked ? 'var(--status-rented)' : 'var(--status-available)',
                border: booked ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(16,185,129,0.3)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: booked ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              title={booked ? `Mobil ${mobil.nama} sudah dibooking pada tanggal ini` : `Klik untuk pilih tanggal ${dateStr}`}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>

      {/* Keterangan Warna Badges */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-available)', display: 'inline-block' }}></span>
          🟢 Tersedia (Bisa Sewa)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-rented)', display: 'inline-block' }}></span>
          🔴 Disewa (Booked)
        </span>
      </div>
    </div>
  );
}
