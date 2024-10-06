import { defineStore } from 'pinia'

type SelectedDate = string // Assuming each date is a string
type SelectedDates = SelectedDate[]

// composition type of store
export const useDatesStore = defineStore('dates', () => {
  const selectedDates: Ref<SelectedDates> = ref([])

  function addSelectedDate(date: SelectedDate) {
    if (!selectedDates.value.includes(date)) {
      selectedDates.value.push(date)
      console.log('Date added:', date)
      console.log('Selected dates are now:', selectedDates.value)
    } else {
      console.log('Date already selected:', date)
    }
  }

  function removeSelectedDate(date: SelectedDate) {
    const index = selectedDates.value.indexOf(date)
    if (index > -1) {
      selectedDates.value.splice(index, 1)
      console.log('Date removed:', date)
      console.log('Selected dates are now:', selectedDates.value)
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

  function clearSelectedDates() {
    selectedDates.value = []
    console.log('All selected dates cleared')
  }

  async function makeBooking() {
    try {
      // Assuming you're using fetch API, adjust as needed for your setup
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

  return { selectedDates, makeBooking, addSelectedDate, removeSelectedDate, toggleSelectedDate, clearSelectedDates }
})
