/**
 * =========================================================
 *  PlutoAstro — Planetary Changes
 *
 *  Birth details are NOT part of the original user slice (which
 *  only carries auth: uid / displayName / email). To power the
 *  Planetary Changes page without forcing the user to re-type
 *  their birth data, this dedicated slice persists a single set
 *  of birth details to localStorage so it survives reloads and
 *  is reused across the session.
 *
 *  Persistence is intentionally simple: initialState is hydrated
 *  once from localStorage; every mutation is mirrored back there.
 *  Reducers stay pure (writes happen in the UI layer).
 * =========================================================
 */

import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "plutoastro:birthDetails";

const hydrate = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    /* corrupt JSON — ignore and start clean */
  }
  return null;
};

const birthDetailsSlice = createSlice({
  name: "birthDetails",
  initialState: hydrate(),
  reducers: {
    setBirthDetails: (state, action) => {
      return action.payload || null;
    },
    clearBirthDetails: () => {
      return null;
    },
  },
});

export const { setBirthDetails, clearBirthDetails } = birthDetailsSlice.actions;
export const STORAGE_KEY_BIRTH = STORAGE_KEY;

/** Persist a birth-details object to localStorage. */
export const persistBirthDetails = (details) => {
  try {
    if (!details) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
    }
  } catch (error) {
    /* storage unavailable (private mode etc.) — silently ignore */
  }
};

export default birthDetailsSlice.reducer;
