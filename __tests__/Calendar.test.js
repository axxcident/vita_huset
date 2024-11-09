import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Calendar from '../components/Calendar.vue';
import { createTestingPinia } from '@pinia/testing';

// Mock child components
vi.mock('../components/MySelectedDates.vue', () => ({
  default: {
    template: '<div>MySelectedDates</div>'
  }
}));

vi.mock('../components/SelectedDates.vue', () => ({
  default: {
    template: '<div>SelectedDates</div>'
  }
}));

vi.mock('../components/Date.vue', () => ({
  default: {
    props: ['year', 'month', 'day', 'isBooked', 'visitorsAllowed', 'bookingInfo'],
    template: '<div>Date Component</div>'
  }
}));

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
);

describe('Calendar', () => {
  let wrapper = null;
  let mockCurrentDate;

  beforeEach(() => {
    // Create a real Date object
    mockCurrentDate = new Date('2024-04-15T12:00:00Z');

    // Setup fake timers
    vi.useFakeTimers();
    vi.setSystemTime(mockCurrentDate);

    // Mount component with necessary mocks
    wrapper = mount(Calendar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              dates: {
                selectedDates: [],
                selectedDatesForUnbooking: []
              },
              user: {
                currentUser: null,
                currentUserInfo: null
              }
            }
          })
        ],
        stubs: {
          'MySelectedDates': true,
          'SelectedDates': true,
          'Date': true
        }
      }
    });
  });

  it('should correctly identify current date on initial load', async () => {
    await nextTick();

    expect(wrapper.vm.year).toBe(2024);
    expect(wrapper.vm.month).toBe(3); // April (0-based)
  });

  it('should maintain correct current date after month navigation', async () => {
    await nextTick();

    const initialMonth = wrapper.vm.month;

    // Navigate to next month
    await wrapper.find('#next').trigger('click');
    await nextTick();

    expect(wrapper.vm.month).toBe((initialMonth + 1) % 12);

    // Navigate back
    await wrapper.find('#prev').trigger('click');
    await nextTick();

    expect(wrapper.vm.month).toBe(initialMonth);
  });

  it('should update current date when day changes', async () => {
    await nextTick();

    // Move to next day
    const newDate = new Date('2024-04-16T12:00:00Z');
    vi.setSystemTime(newDate);

    await wrapper.vm.$forceUpdate();
    await nextTick();

    // Check if date properties are correct
    const displayedDate = new Date(wrapper.vm.year, wrapper.vm.month);
    expect(displayedDate.getMonth()).toBe(3); // April
    expect(displayedDate.getFullYear()).toBe(2024);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
    vi.useRealTimers();
  });
});
