import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase'; // Import Firebase configuration
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

const Calendar = () => {
  const { user } = useAuth();
  const currentDate = new Date();

  // Helper function to get the start of the week (Monday) for a given date
  function getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diffToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Adjust to Monday
    startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
    return startOfWeek;
  }

  // Get the correct days for the current week
  const getWeekDays = (startOfWeek) => {
    const days = [];
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    for (let i = 0; i < 5; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push({ dayName: weekDays[i], dayNumber: day });
    }
    return days;
  };

  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(currentDate));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lessonSchedule, setLessonSchedule] = useState([]);
  const [isWeekend, setIsWeekend] = useState(false);
  const [weekDays, setWeekDays] = useState(getWeekDays(currentWeekStart));

  // New state for user input
  const [newLessonSubject, setNewLessonSubject] = useState('');
  const [newLessonDay, setNewLessonDay] = useState('');
  const [newLessonTime, setNewLessonTime] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLessonIndex, setEditingLessonIndex] = useState(null);

  // Time slots from 5:00 to 4:00
  const timeSlots = [
    "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
    "21:00", "22:00", "23:00", "00:00", "1:00", "2:00", "3:00", "4:00"
  ];

  // Fetch lessons from Firebase
useEffect(() => {
  const fetchLessons = async () => {
    if (user) { // Check if user is authenticated
      const lessonsCollection = collection(db, 'classes');
      const lessonsQuery = query(lessonsCollection, where("user", "==", user.uid)); // Filter by user ID
      const lessonSnapshot = await getDocs(lessonsQuery);
      const lessonList = lessonSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLessonSchedule(lessonList);
    }
  };

  fetchLessons();
}, [user]); // Depend on user

  // Update the displayed days when the week changes
  const handleWeekChange = (direction) => {
    const newStartOfWeek = new Date(currentWeekStart);
    newStartOfWeek.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newStartOfWeek);
    setWeekDays(getWeekDays(newStartOfWeek));
    setCurrentMonth(newStartOfWeek.getMonth());
    setCurrentYear(newStartOfWeek.getFullYear());
  };

  // Track the current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute to keep the time accurate
    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  // Check if it's the weekend (Saturday/Sunday)
  useEffect(() => {
    const dayOfWeek = currentDate.getDay();
    setIsWeekend(dayOfWeek === 6 || dayOfWeek === 0); // Saturday (6) or Sunday (0)
  }, [currentDate]);

  // Highlight the current day
  const isToday = (date) => {
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  // Get the current time slot position within the grid
  const getCurrentTimeSlotPosition = () => {
    const startHour = 5; // Calendar starts at 5:00
    const totalSlots = timeSlots.length; // Total time slots

    let hour = currentTime.getHours();
    let minute = currentTime.getMinutes();

    // Adjust for time wrapping (past midnight)
    if (hour < startHour) {
      hour += 24;
    }

    // Calculate fractional slot based on current time
    const fractionalSlot = (hour - startHour) + minute / 60;

    // Return percentage of the height based on the grid slots
    return (fractionalSlot / totalSlots) * 100;
  };

  const currentTimeSlotPosition = getCurrentTimeSlotPosition();

  // Function to handle adding or editing a lesson
  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (newLessonSubject) {
      const newLesson = {
        subject: newLessonSubject,
        day: newLessonDay,
        time: newLessonTime,
        user: user.uid, // Add user ID to the lesson
        date: new Date(), // Add date or any other necessary fields
      };
      try {
        if (editingLessonIndex !== null) {
          // Update existing lesson
          const lessonId = lessonSchedule[editingLessonIndex].id;
          const lessonDoc = doc(db, 'classes', lessonId);
          await updateDoc(lessonDoc, newLesson);
          const updatedSchedule = [...lessonSchedule];
          updatedSchedule[editingLessonIndex] = { ...newLesson, id: lessonId }; // Update local state
          setLessonSchedule(updatedSchedule);
          setEditingLessonIndex(null); // Reset editing index
        } else {
          // Add new lesson
          const docRef = await addDoc(collection(db, 'classes'), newLesson);
          setLessonSchedule([...lessonSchedule, { ...newLesson, id: docRef.id }]); // Update local state with new ID
        }
        setNewLessonSubject('');
        setShowForm(false);
      } catch (error) {
        console.error("Error adding/updating lesson: ", error);
      }
    }
  };

  const handleDeleteLesson = async () => {
    const lessonId = lessonSchedule[editingLessonIndex].id;
    const lessonDoc = doc(db, 'classes', lessonId);
    await deleteDoc(lessonDoc);
    const updatedSchedule = lessonSchedule.filter((_, index) => index !== editingLessonIndex);
    setLessonSchedule(updatedSchedule);
    setNewLessonSubject('');
    setShowForm(false);
    setEditingLessonIndex(null); // Reset editing index
  };

  // Function to open the form for editing a lesson
  const handleEditLesson = (lesson, index) => {
    setNewLessonSubject(lesson.subject);
    setNewLessonDay(lesson.day);
    setNewLessonTime(lesson.time);
    setShowForm(true);
    setEditingLessonIndex(index);
  };

  return (
    <div>
      {user && user.emailVerified ? (
        <div className="grid grid-cols-12 gap-4 w-full mx-auto">
          {/* Main Calendar View */}
          <div className="col-span-10 bg-white p-6 rounded-lg shadow-md w-full relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 cursor-pointer">
                {new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="space-x-2">
                <button
                  onClick={() => handleWeekChange('previous')}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  &larr; Previous Week
                </button>
                <button
                  onClick={() => handleWeekChange('next')}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Next Week &rarr;
                </button>
              </div>
            </div>

            {/* Calendar Layout */}
            <div className="grid grid-cols-6 border bg-gray-50 w-full relative">
              <div className="col-span-1 border-r bg-gray-100 p-2 text-sm font-bold text-center">
                Time
              </div>

              {/* Render the weekdays (Mon, Tue, etc.) */}
              {weekDays.map((weekDay, index) => (
                <div key={weekDay.dayName} className="border-r bg-gray-100 p-2 text-sm font-bold text-center">
                  {weekDay.dayName}
                  <div
                    className={`text-xs font-normal ${
                      isToday(weekDay.dayNumber) ? 'text-red-500' : 'text-gray-500'
                    }`}
                  >
                    {weekDay.dayNumber.getDate()}
                  </div>
                </div>
              ))}

              {/* Render time slots */}
              {timeSlots.map((time, timeIndex) => (
                <React.Fragment key={timeIndex}>
                  <div className="col-span-1 border-t border-r bg-gray-50 p-2 text-xs text-gray-500 text-center">
                    {time}
                  </div>
                  {weekDays.map((_, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="border-t border-r bg-white p-2 min-h-12 max-h-24 hover:bg-gray-100 flex-1"
                      onClick={() => {
                        const lesson = lessonSchedule.find(
                          lesson => lesson.day === weekDays[dayIndex].dayName && lesson.time === time
                        );
                        if (lesson) {
                          handleEditLesson(lesson, lessonSchedule.indexOf(lesson));
                        } else {
                          // Set the new lesson day and time based on the clicked cell
                          setNewLessonDay(weekDays[dayIndex].dayName);
                          setNewLessonTime(time);
                          setShowForm(true); // Open the form
                        }
                      }}
                    >
                      {lessonSchedule.some(
                        lesson => lesson.day === weekDays[dayIndex].dayName && lesson.time === time
                      ) && (
                        <div className="text-xs font-semibold text-blue-500">
                          {lessonSchedule.find(
                            lesson => lesson.day === weekDays[dayIndex].dayName && lesson.time === time
                          ).subject}
                        </div>
                      )}
                    </div>
                  ))}
                </React.Fragment>
              ))}

              {/* Current time red line */}
              <div
                className="absolute left-0 right-0 z-10"
                style={{
                  top: `calc(${currentTimeSlotPosition}% + 2rem)`, // Adjusted to account for the header row
                  height: "2px",
                  backgroundColor: "red",
                }}
              />
            </div>
          </div>

          {/* Right Schedule Panel */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-md min-w-[250px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Today's Schedule</h2>
            <div className="space-y-2">
              {isWeekend ? (
                <div className="bg-white p-2 rounded border border-gray-200 text-center text-sm font-medium text-gray-600">
                  It's the weekend! No classes today!
                </div>
              ) : (
                lessonSchedule
                  .filter(lesson => lesson.day === currentDate.toLocaleString('en-US', { weekday: 'short' }))
                  .sort((a, b) => {
                    const timeA = parseInt(a.time.split(':')[0]);
                    const timeB = parseInt(b.time.split(':')[0]);
                    return timeA - timeB;
                  })
                  .map((lesson, idx) => (
                    <div key={idx} className="bg-white p-2 rounded border border-gray-200 text-sm flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-600">{lesson.subject}</p>
                        <p className="text-gray-500">{lesson.time} - {parseInt(lesson.time.split(':')[0]) + 1}:00</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-12">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Calendar App</h1>
          <p className="text-gray-600 mt-2">Please verify your email to access the calendar.</p>
        </div>
      )}

      {/* Lesson Form Popup */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{editingLessonIndex !== null ? 'Edit Lesson' : 'Add New Lesson'}</h2>
            <form onSubmit={handleAddLesson}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  value={newLessonSubject}
                  onChange={(e) => setNewLessonSubject(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingLessonIndex(null); // Reset editing index
                    setNewLessonSubject(''); // Reset lesson subject
                  }}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  {editingLessonIndex !== null ? 'Update Lesson' : 'Add Lesson'}
                </button>
                {editingLessonIndex !== null && (
                  <button
                    type="button"
                    onClick={handleDeleteLesson}
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Delete Lesson
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
