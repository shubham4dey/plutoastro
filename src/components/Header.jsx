import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../image/Logo text.png";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../store/userSlice";
import { clearFollow } from "../store/followSlice";
import {
  addForm,
  addLang,
  removeForm,
} from "../store/configAppSlice";

import LoginForm from "./LoginForm";

import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { MULTI_LANG } from "../utils/constants";
import lang from "../utils/langConstants";

const Header = () => {
  const dispatch = useDispatch();

  const user = useSelector(
    (store) => store.user
  );

  const form = useSelector(
    (store) => store.configApp.form
  );

  const Langkey = useSelector(
    (store) => store.configApp.lang
  );

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const liCSS =
    "font-semibold hover:text-purple-300 transition-all duration-300 uppercase tracking-wide text-sm cursor-pointer";

  /* =========================
     LOGIN POPUP
  ========================= */

  const handleForm = () => {
    dispatch(addForm());
    setMobileMenu(false);
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        toast.success(
          "Logged out successfully.",
          {
            position: "top-center",
            autoClose: 1000,
            theme: "dark",
            transition: Bounce,
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });

    dispatch(clearFollow());
    setMobileMenu(false);
  };

  /* =========================
     FIREBASE AUTH
  ========================= */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {
          if (firebaseUser) {
            const {
              uid,
              displayName,
              email,
            } = firebaseUser;

            dispatch(
              addUser({
                uid,
                displayName,
                email,
              })
            );

            dispatch(removeForm());
          } else {
            dispatch(removeUser());
          }
        }
      );

    return () => unsubscribe();
  }, [dispatch]);

  /* =========================
     LANGUAGE
  ========================= */

  const handleLang = (e) => {
    dispatch(addLang(e.target.value));
  };

  return (
    <>
      <header
        className="
          fixed
          top-0
          left-0
          w-full
          z-[999]
          bg-gradient-to-b
          from-black
          via-black/80
          to-transparent
          backdrop-blur-sm
        "
      >
        <div className="flex items-center justify-between px-4 lg:px-10 py-3">

          {/* Logo */}
          <Link to="/">
            <img
              src={Logo}
              alt="PlutoAstro"
              className="
                w-28
                md:w-36
                lg:w-44
                2xl:w-56
              "
            />
          </Link>

          {/* Desktop Menu */}
          <div
            className="
              hidden
              lg:flex
              items-center
              gap-6
              text-white
            "
          >
            {/* HOME Button */}
            <Link
              to="/"
              className={liCSS}
            >
              HOME
            </Link>

            {/* Chat with Astrologers - WITH GREEN BLINKING DOT */}
            <Link
              to="/chat"
              className="relative flex items-center gap-2 font-semibold hover:text-purple-300 transition-all duration-300 uppercase tracking-wide text-sm cursor-pointer"
            >
              <span className="relative">
                CHAT
                <span className="absolute -top-1 -right-3 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
              </span>
            </Link>

            <Link
              to="/call"
              className={liCSS}
            >
              {lang[Langkey].CALL}
            </Link>

            {/* AI ASTRO with Green Blinking Dot */}
            <Link
              to="/ai-astro"
              className="relative flex items-center gap-2 font-semibold hover:text-purple-300 transition-all duration-300 uppercase tracking-wide text-sm cursor-pointer"
            >
              <span className="relative">
                AI ASTRO
                <span className="absolute -top-1 -right-3 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
              </span>
            </Link>

            <Link
              to="/horoscope"
              className={liCSS}
            >
              HOROSCOPE
            </Link>

            <Link
              to="/tarot"
              className={liCSS}
            >
              TAROT
            </Link>

            <Link
              to="/zodiac"
              className={liCSS}
            >
              ZODIAC
            </Link>

            <Link
              to="/following"
              className={liCSS}
            >
              {lang[Langkey].FOLLOWING}
            </Link>

            <Link
              to="/about"
              className={liCSS}
            >
              {lang[Langkey].ABOUT}
            </Link>

            <Link
              to="/become-astrologer"
              className="
                px-4
                py-2
                rounded-full
                bg-gradient-to-r
                from-fuchsia-600
                to-purple-700
                text-white
                text-sm
                font-semibold
                hover:scale-105
                transition-all
                duration-300
              "
            >
              Become Astrologer
            </Link>

            <Link
              to="/kundligpt"
              className={liCSS}
            >
              {lang[Langkey].KUNDLIGPT}
            </Link>

            {!user ? (
              <span
                onClick={handleForm}
                className={liCSS}
              >
                SIGN IN
              </span>
            ) : (
              <span
                onClick={handleSignOut}
                className={liCSS}
              >
                SIGN OUT
              </span>
            )}

            {user && (
              <span className="text-purple-300 text-sm">
                {user.displayName}
              </span>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Language */}
            <select
              className="
                text-sm
                px-3
                py-2
                rounded-lg
                bg-purple-800/90
                text-purple-100
                outline-none
              "
              onChange={handleLang}
            >
              {MULTI_LANG.map(
                (item) => (
                  <option
                    key={
                      item.identifier
                    }
                    value={
                      item.identifier
                    }
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>

            {/* Mobile Menu */}
            <button
              onClick={() =>
                setMobileMenu(
                  !mobileMenu
                )
              }
              className="
                lg:hidden
                text-white
                text-3xl
              "
            >
              <i className="ri-menu-line"></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div
            className="
              lg:hidden
              bg-black/95
              backdrop-blur-md
              px-6
              py-5
              flex
              flex-col
              gap-5
              text-white
            "
          >
            {/* HOME */}
            <Link
              to="/"
              onClick={() =>
                setMobileMenu(false)
              }
            >
              HOME
            </Link>

            {/* Chat with Astrologers */}
            <Link
              to="/chat"
              onClick={() =>
                setMobileMenu(false)
              }
              className="flex items-center gap-2"
            >
              <span className="relative">
                CHAT WITH ASTROLOGERS
                <span className="absolute -top-1 -right-3 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
              </span>
            </Link>

            <Link
              to="/call"
              onClick={() =>
                setMobileMenu(false)
              }
            >
              {lang[Langkey].CALL}
            </Link>

            <Link
              to="/ai-astro"
              onClick={() =>
                setMobileMenu(false)
              }
              className="flex items-center gap-2"
            >
              <span className="relative">
                AI ASTRO
                <span className="absolute -top-1 -right-3 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
              </span>
            </Link>

            <Link
              to="/horoscope"
              onClick={() =>
                setMobileMenu(false)
              }
            >
              HOROSCOPE
            </Link>

            <Link
              to="/tarot"
              onClick={() =>
                setMobileMenu(false)
              }
            >
              TAROT READING
            </Link>

            <Link
              to="/zodiac"
              onClick={() =>
                setMobileMenu(false)
              }
            >
              ZODIAC SIGNS
            </Link>

            <Link
              to="/following"
              onClick={() =>
                setMobileMenu(false)
              }
            >
              {lang[Langkey].FOLLOWING}
            </Link>

            <Link
              to="/about"
              onClick={() =>
                setMobileMenu(false)
              }
            >
              {lang[Langkey].ABOUT}
            </Link>

            <Link
              to="/become-astrologer"
              onClick={() =>
                setMobileMenu(false)
              }
            >
              Become Astrologer
            </Link>

            <Link
              to="/kundligpt"
              onClick={() =>
                setMobileMenu(false)
              }
            >
              {lang[Langkey].KUNDLIGPT}
            </Link>

            {!user ? (
              <span
                onClick={handleForm}
              >
                SIGN IN
              </span>
            ) : (
              <span
                onClick={
                  handleSignOut
                }
              >
                SIGN OUT
              </span>
            )}
          </div>
        )}
      </header>

      {/* Login Popup */}
      {form && (
        <div className="z-[1000] absolute top-0 w-full">
          <LoginForm />
        </div>
      )}
    </>
  );
};

export default Header;