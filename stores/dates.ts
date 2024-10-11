import { defineStore } from 'pinia'

type SelectedDate = string
type SelectedDates = SelectedDate[]

// composition type of store
export const useDatesStore = defineStore('dates', () => {
  const selectedDates: Ref<SelectedDates> = ref([])
  const selectedDatesForUnbooking = ref<SelectedDates>([])

  function addSelectedDate(date: SelectedDate) {
    if (!selectedDates.value.includes(date)) {
      selectedDates.value.push(date)
    } else {
      console.log('Date already selected:', date)
    }
  }

  function removeSelectedDate(date: SelectedDate) {
    const index = selectedDates.value.indexOf(date)
    if (index > -1) {
      selectedDates.value.splice(index, 1)
    } else {
      console.log('Date not found in selection:', date)
    }
  }

  function toggleSelectedDate(date: SelectedDate) {
    if (selectedDates.value.includes(date)) {
      removeSelectedDate(date)
    } else {
      addSelectedDate(date)
    }
  }

  function toggleSelectedDateForUnbooking(date: SelectedDate) {
    const index = selectedDatesForUnbooking.value.indexOf(date)
    if (index > -1) {
      selectedDatesForUnbooking.value.splice(index, 1)
    } else {
      selectedDatesForUnbooking.value.push(date)
    }
  }

  function clearSelectedDatesForUnbooking() {
    selectedDatesForUnbooking.value = []
  }

  function clearSelectedDates() {
    selectedDates.value = []
  }

  async function deleteBookings(userId: string) {
    try {
      const response = await $fetch('/api/bookings', {
        method: 'DELETE',
        body: JSON.stringify({
          user_id: userId,
          booking_dates: selectedDatesForUnbooking.value
        })
      })

      if (response.status === 200) {
        clearSelectedDatesForUnbooking()
        return true
      } else {
        throw new Error('Booking deletion failed')
      }
    } catch (error) {
      console.error('Error deleting bookings:', error)
      return false
    }
  }

  async function makeBooking() {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dates: selectedDates.value }),
      })

      if (!response.ok) {
        throw new Error('Booking failed')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error making booking:', error)
      throw error
    }
  }

  return { selectedDates, makeBooking, addSelectedDate, removeSelectedDate, toggleSelectedDate, clearSelectedDates, deleteBookings, selectedDatesForUnbooking, toggleSelectedDateForUnbooking, clearSelectedDatesForUnbooking }
})
