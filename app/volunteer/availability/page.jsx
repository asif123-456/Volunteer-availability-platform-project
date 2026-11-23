'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  Sparkles,
  Plus,
  Trash2,
} from 'lucide-react';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function VolunteerAvailabilityPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/volunteer/availability');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setSlots(data.data);
        } else {
          setSlots([
            {
              dayOfWeek: 'Sunday',
              startTime: '09:00',
              endTime: '13:00',
              notes: 'Cleanliness & outdoor drives',
            },
          ]);
        }
      } catch (err) {
        setError('Failed to fetch schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const applyPreset = (type) => {
    if (type === 'weekend') {
      setSlots([
        {
          dayOfWeek: 'Saturday',
          startTime: '09:00',
          endTime: '13:00',
          notes: 'Saturday Morning Drive',
        },
        {
          dayOfWeek: 'Sunday',
          startTime: '09:00',
          endTime: '14:00',
          notes: 'Sunday Cleanup / Plantation',
        },
      ]);
    } else if (type === 'sunday-only') {
      setSlots([
        {
          dayOfWeek: 'Sunday',
          startTime: '08:30',
          endTime: '13:30',
          notes: 'Sunday Community Drive Free Hours',
        },
      ]);
    } else if (type === 'evenings') {
      setSlots([
        {
          dayOfWeek: 'Tuesday',
          startTime: '17:00',
          endTime: '20:00',
          notes: 'Evening Tutoring',
        },
        {
          dayOfWeek: 'Thursday',
          startTime: '17:00',
          endTime: '20:00',
          notes: 'Evening Tutoring',
        },
      ]);
    }
    setSuccess('Preset loaded! Click "Save Availability Schedule" below.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const addSlot = () => {
    const existingDays = slots.map((s) => s.dayOfWeek);
    const availableDay =
      DAYS_OF_WEEK.find((d) => !existingDays.includes(d)) || 'Sunday';

    setSlots([
      ...slots,
      {
        dayOfWeek: availableDay,
        startTime: '09:00',
        endTime: '13:00',
        notes: '',
      },
    ]);
  };

  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/volunteer/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Schedule saved! NGO drives will now match your free hours.');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(data.message || 'Failed to save');
      }
    } catch (err) {
      setError(err.message || 'Error saving availability');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
          Volunteer Schedule Engine
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Define Your Free Volunteer Hours
        </h1>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Tell NGOs exactly when you are available. When an NGO posts a cleanliness drive or teaching camp during your chosen slot, our system automatically highlights the match.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 p-5 rounded-3xl space-y-3 transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Quick Schedule Presets:
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => applyPreset('weekend')}
            className="px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-sm transition-all"
          >
            🌟 Weekend Warrior (Sat & Sun Mornings)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('sunday-only')}
            className="px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-sm transition-all"
          >
            🧹 Sunday Cleanliness Dedicated (8:30 AM - 1:30 PM)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('evenings')}
            className="px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-sm transition-all"
          >
            📚 Weekday Afternoons & Evenings
          </button>
        </div>
      </div>

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-700 dark:text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading your schedule...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-3">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="w-full sm:w-40">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Day of the Week
                  </label>
                  <select
                    value={slot.dayOfWeek}
                    onChange={(e) =>
                      handleSlotChange(index, 'dayOfWeek', e.target.value)
                    }
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 transition-colors"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      From
                    </label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) =>
                        handleSlotChange(index, 'startTime', e.target.value)
                      }
                      className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 transition-colors"
                    />
                  </div>
                  <span className="text-slate-400 dark:text-slate-500 font-bold mt-4">—</span>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Until
                    </label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        handleSlotChange(index, 'endTime', e.target.value)
                      }
                      className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex-1 w-full sm:w-auto">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Activity Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={slot.notes || ''}
                    onChange={(e) =>
                      handleSlotChange(index, 'notes', e.target.value)
                    }
                    placeholder="e.g. Beach cleanup, tutoring"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg mt-1 sm:mt-4 transition-colors"
                  title="Remove slot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={addSlot}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Another Day Slot
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Availability Schedule'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
