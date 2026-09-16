import React, { useEffect, useRef, useState } from "react";

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

import ProfileDropdown from "./ProfileDropdown"; // ✅ NEW

import { toast, Bounce } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { MULTI_LANG } from "../utils/constants";

import lang from "../utils/langConstants";

const Header = () => {

  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  const form = useSelector((store) => store.configApp.form);

  const Langkey = useSelector((store) => store.configApp.lang);

  const [mobileMenu, setMobileMenu] = useState(false);

  const [contactOpen, setContactOpen] = useState(false);

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

        toast.success("Logged out successfully.", {

          position: "top-center",

          autoClose: 1000,

          theme: "dark",

          transition: Bounce,

        });

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

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {

      if (firebaseUser) {

        const { uid, displayName, email } = firebaseUser;

        dispatch(addUser({ uid, displayName, email }));

        dispatch(removeForm());

      } else {

        dispatch(removeUser());

      }

    });

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
        {/* min-h keeps the header band exactly the same height as before the logo swap */}
        <div className="flex items-center justify-between px-4 lg:px-10 py-3 min-h-[86px] md:min-h-[104px] lg:min-h-[122px] 2xl:min-h-[149px]">

          {/* Logo */}
          <Link to="/">
            <img

              src={Logo}

              alt="PlutoAstro"

              className="h-10 md:h-12 lg:h-14 2xl:h-16 w-auto shrink-0 object-contain"

            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 text-white">
            <Link to="/" className={liCSS}>

              HOME
            </Link>

            <Link to="/about" className={liCSS}>

              {lang[Langkey].ABOUT}
            </Link>

            {/* ✅ Contact Us — premium dropdown (Chat + Call merged) */}
            <div
              className="relative"
              onMouseEnter={() => setContactOpen(true)}
              onMouseLeave={() => setContactOpen(false)}
            >
              <button
                onClick={() => setContactOpen((o) => !o)}
                className={`${liCSS} flex items-center gap-1.5`}
              >
                CONTACT US
                <i
                  className={`ri-arrow-down-s-line text-sm transition-transform duration-300 ${
                    contactOpen ? "rotate-180" : ""
                  }`}
                ></i>
              </button>

              {/* Elegantly revealed panel — smooth fade + slide, closes on outside click */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-300 ease-out ${
                  contactOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="min-w-[250px] rounded-2xl border border-purple-500/30 bg-[#14141f]/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden">
                  {/* Premium gradient hairline */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600"></div>

                  <div className="p-2 flex flex-col gap-1">
                    <Link
                      to="/chat"
                      onClick={() => setContactOpen(false)}
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-600/15 transition-all duration-200"
                    >
                      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform duration-200">
                        <i className="ri-chat-1-line"></i>
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                      </span>
                      <span className="flex flex-col leading-tight text-left">
                        <span className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors duration-200">
                          Chat with Astrologer
                        </span>
                        <span className="text-[11px] text-purple-300/70 uppercase tracking-wide">
                          Live & Online
                        </span>
                      </span>
                    </Link>

                    <Link
                      to="/call"
                      onClick={() => setContactOpen(false)}
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-600/15 transition-all duration-200"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform duration-200">
                        <i className="ri-phone-line"></i>
                      </span>
                      <span className="flex flex-col leading-tight text-left">
                        <span className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors duration-200">
                          Call with Astrologer
                        </span>
                        <span className="text-[11px] text-purple-300/70 uppercase tracking-wide">
                          Talk 1-on-1
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

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

            <Link to="/horoscope" className={liCSS}>

              HOROSCOPE
            </Link>

            <Link to="/tarot" className={liCSS}>

              TAROT
            </Link>

            <Link to="/zodiac" className={liCSS}>

              ZODIAC
            </Link>

            <Link to="/calculators" className={liCSS}>

              CALCULATORS

            </Link>

            <Link to="/planetary-changes" className={liCSS}>

              PLANETARY CHANGES

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

          <Link to="/kundligpt" className={liCSS}>

            {lang[Langkey].KUNDLIGPT}
          </Link>
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

            {MULTI_LANG.map((item) => (
              <option key={item.identifier} value={item.identifier}>

                {item.name}
              </option>

            ))}
          </select>

          {/* ✅ NEW: Profile Dropdown (desktop) */}

          {user ? (
            <ProfileDropdown onLogout={handleSignOut} />

          ) : (
            <span

              onClick={handleForm}

              className="hidden lg:block px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-105 transition-all cursor-pointer"
            >

              SIGN IN
            </span>

          )}

          {/* Mobile Menu */}
          <button

            onClick={() => setMobileMenu(!mobileMenu)}

            className="lg:hidden text-white text-3xl"
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

              gap-4

              text-white

            "
        >
          <Link to="/" onClick={() => setMobileMenu(false)}>

            HOME
          </Link>

          <Link to="/about" onClick={() => setMobileMenu(false)}>

            {lang[Langkey].ABOUT}
          </Link>

          {/* ✅ Contact Us — merged Chat + Call (mobile accordion) */}
          <button
            onClick={() => setContactOpen((o) => !o)}
            className="flex items-center justify-between w-full font-semibold"
          >
            <span className="uppercase tracking-wide text-sm">CONTACT US</span>
            <i
              className={`ri-arrow-down-s-line text-lg transition-transform duration-300 ${
                contactOpen ? "rotate-180" : ""
              }`}
            ></i>
          </button>

          <div
            className={`flex flex-col gap-3 pl-3 border-l border-purple-500/30 overflow-hidden transition-all duration-300 ease-out ${
              contactOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <Link
              to="/chat"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-2 text-sm text-purple-200 hover:text-white transition-colors duration-200"
            >
              <i className="ri-chat-1-line text-fuchsia-400"></i>
              Chat with Astrologer
            </Link>

            <Link
              to="/call"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-2 text-sm text-purple-200 hover:text-white transition-colors duration-200"
            >
              <i className="ri-phone-line text-fuchsia-400"></i>
              Call with Astrologer
            </Link>
          </div>

          <Link

            to="/ai-astro"

            onClick={() => setMobileMenu(false)}

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

          <Link to="/horoscope" onClick={() => setMobileMenu(false)}>

            HOROSCOPE
          </Link>

          <Link to="/tarot" onClick={() => setMobileMenu(false)}>

            TAROT READING
          </Link>

          <Link to="/zodiac" onClick={() => setMobileMenu(false)}>

            ZODIAC SIGNS
          </Link>

          <Link to="/calculators" onClick={() => setMobileMenu(false)}>

            CALCULATORS

          </Link>

          <Link to="/planetary-changes" onClick={() => setMobileMenu(false)}>

            PLANETARY CHANGES

          </Link>

          <Link to="/become-astrologer" onClick={() => setMobileMenu(false)}>

            Become Astrologer
          </Link>

          <Link to="/kundligpt" onClick={() => setMobileMenu(false)}>

            {lang[Langkey].KUNDLIGPT}
          </Link>

          {/* ✅ Profile-related links in mobile menu */}

          {user ? (
            <>
              <div className="border-t border-purple-800/30 my-2"></div>

              <Link

                to="/wallet"

                onClick={() => setMobileMenu(false)}

                className="flex items-center justify-between"
              >
                <span>💰 Wallet</span>
                <span className="text-emerald-400 text-sm">Open</span>
              </Link>

              <Link

                to="/messages"

                onClick={() => setMobileMenu(false)}

                className="flex items-center justify-between"
              >
                <span>💬 My Chats</span>
                <span className="text-purple-400 text-sm">Open</span>
              </Link>

              <Link

                to="/following"

                onClick={() => setMobileMenu(false)}

                className="flex items-center justify-between"
              >
                <span>⭐ Following</span>
                <span className="text-purple-400 text-sm">Open</span>
              </Link>

              <button

                onClick={handleSignOut}

                className="mt-3 py-3 rounded-xl bg-red-900/30 text-red-400 font-semibold"
              >

                🚪 Sign Out ({user.displayName})
              </button>
            </>

          ) : (
            <span onClick={handleForm} className="font-semibold">

              SIGN IN
            </span>

          )}
        </div>

      )}
    </header >

      {/* Login Popup */ }

  {
    form && (
      <div className="z-[1000] absolute top-0 w-full">
        <LoginForm />
      </div>

    )
  }
</>

  );

};

export default Header;
