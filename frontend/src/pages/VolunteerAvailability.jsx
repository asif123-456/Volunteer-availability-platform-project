import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  Sparkles,
  RotateCcw,
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

const VolunteerAvailability = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch current user availability slots
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const res = await api.get('/volunteer/availability');
        if (res.data.success && res.data.data.length > 0) {
          setSlots(res.data.data);
        } else {
          // Default initial recommendation: Sunday morning
          setSlots([
            {
              dayOfWeek: 'Sunday',
              startTime: '09:00',
              endTime: '13:00',
              notes: 'Weekend community service & drives',
            },
          ]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  // Preset Configurations
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
        {
          dayOfWeek: 'Saturday',
          startTime: '14:00',
          endTime: '18:00',
          notes: 'Saturday Afternoon',
        },
      ]);
    }
    setSuccess('Preset applied! Remember to click "Save Schedule" below.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const addSlot = () => {
    // Find first day of week not already added, or default to Sunday
    const existingDays = slots.map((s) => s.dayOfWeek);
    const availableDay = DAYS_OF_WEEK.find((d) => !existingDays.includes(d)) || 'Sunday';

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
      const res = await api.post('/volunteer/availability', { slots });
      if (res.data.success) {
        setSuccess('Your availability schedule was saved! Opportunities will now match your free hours.');
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 block mb-1">
          Availability Engine
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Define Your Free Volunteer Schedule
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Tell NGOs exactly when you are available to help. When an NGO posts a cleanliness drive
          or camp on your chosen day and time window, our system automatically highlights you.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 p-5 rounded-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Quick Schedule Presets:
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => applyPreset('weekend')}
            className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100/80 rounded-xl border border-emerald-300 shadow-sm transition-all"
          >
            🌟 Weekend Warrior (Sat & Sun Mornings)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('sunday-only')}
            className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100/80 rounded-xl border border-emerald-300 shadow-sm transition-all"
          >
            🧹 Sunday Cleanliness Dedicated (8:30 AM - 1:30 PM)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('evenings')}
            className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100/80 rounded-xl border border-emerald-300 shadow-sm transition-all"
          >
            📚 Weekday Afternoons & Evenings
          </button>
        </div>
      </div>

      {/* Feedback alerts */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-700" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Slots Form */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading your schedule...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Day selector */}
                <div className="w-full sm:w-44">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Day of the Week
                  </label>
                  <select
                    value={slot.dayOfWeek}
                    onChange={(e) =>
                      handleSlotChange(index, 'dayOfWeek', e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time range */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      From
                    </label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) =>
                        handleSlotChange(index, 'startTime', e.target.value)
                      }
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <span className="text-slate-400 font-bold mt-5">—</span>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Until
                    </label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        handleSlotChange(index, 'endTime', e.target.value)
                      }
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Optional note */}
                <div className="flex-1 w-full sm:w-auto">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Activity Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={slot.notes || ''}
                    onChange={(e) =>
                      handleSlotChange(index, 'notes', e.target.value)
                    }
                    placeholder="e.g. Cleanliness, Teaching, Physical effort"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-2 sm:mt-5 self-end sm:self-center"
                  title="Remove this slot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={addSlot}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Another Day Slot
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Availability Schedule'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default VolunteerAvailability;
