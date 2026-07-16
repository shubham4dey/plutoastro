import React, {
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

function AstrologersSlider() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const astrologers = [
    {
      id: 1,
      name: "Swami Ji",
      price: "₹17/min",
      experience: "10 Years",
      image:
        "https://i.pravatar.cc/300?img=1",
    },
    {
      id: 2,
      name: "Arjun Pandit",
      price: "₹11/min",
      experience: "7 Years",
      image:
        "https://i.pravatar.cc/300?img=2",
    },
    {
      id: 3,
      name: "Love Guru",
      price: "₹21/min",
      experience: "12 Years",
      image:
        "https://i.pravatar.cc/300?img=3",
    },
    {
      id: 4,
      name: "Astro Ananya",
      price: "₹11/min",
      experience: "6 Years",
      image:
        "https://i.pravatar.cc/300?img=4",
    },
    {
      id: 5,
      name: "Dr. Raman",
      price: "₹22/min",
      experience: "15 Years",
      image:
        "https://i.pravatar.cc/300?img=5",
    },
    {
      id: 6,
      name: "Guru Anil",
      price: "₹22/min",
      experience: "9 Years",
      image:
        "https://i.pravatar.cc/300?img=6",
    },
  ];

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  // Auto slider
  useEffect(() => {
    const slider =
      sliderRef.current;

    if (!slider) return;

    const interval =
      setInterval(() => {
        if (
          slider.scrollLeft +
            slider.clientWidth >=
          slider.scrollWidth - 10
        ) {
          slider.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          slider.scrollBy({
            // CHANGE 1: Mobile pe pura card width scroll karega, desktop pe 280
            left: window.innerWidth < 768 ? slider.clientWidth : 280,
            behavior: "smooth",
          });
        }
      }, 3500);

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        width: "100%",
        padding:
          "50px 20px",
      }}
    >
      {/* Heading */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom:
            "35px",
        }}
      >
        <div>
          <h2
            style={{
              color: "#fff",
              fontSize:
                "38px",
              fontWeight:
                "700",
            }}
          >
            🔮 Top Astrologers
          </h2>

          <p
            style={{
              color:
                "#d8b4fe",
              marginTop:
                "10px",
            }}
          >
            Connect with
            India's trusted
            astrologers
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <button
            onClick={
              scrollLeft
            }
            style={
              arrowStyle
            }
          >
            ←
          </button>

          <button
            onClick={
              scrollRight
            }
            style={
              arrowStyle
            }
          >
            →
          </button>
        </div>
      </div>

      {/* Cards */}
      <div
        ref={sliderRef}
        className="astro-slider" // CHANGE 2: Class add kiya style override ke liye
        style={{
          display: "flex",
          gap: "25px",
          overflowX:
            "auto",
          scrollBehavior:
            "smooth",
          paddingBottom:
            "15px",
        }}
      >
        {astrologers.map(
          (astro) => (
            <div
              key={astro.id}
              className="astro-card" // CHANGE 3: Class add kiya style override ke liye
              onClick={() =>
                navigate(
                  `/astroProfile/${astro.id}`
                )
              }
              style={{
                minWidth:
                  "220px",
                background:
                  "rgba(25,10,45,0.95)",
                borderRadius:
                  "30px",
                padding:
                  "30px 20px",
                textAlign:
                  "center",
                cursor:
                  "pointer",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                transition:
                  "0.4s",
              }}
              onMouseEnter={(
                e
              ) => {
                e.currentTarget.style.transform =
                  "translateY(-10px)";
              }}
              onMouseLeave={(
                e
              ) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  position:
                    "relative",
                  width:
                    "100px",
                  margin:
                    "0 auto",
                }}
              >
                <img
                  src={
                    astro.image
                  }
                  alt={
                    astro.name
                  }
                  style={{
                    width:
                      "100px",
                    height:
                      "100px",
                    borderRadius:
                      "50%",
                    objectFit:
                      "cover",
                    border:
                      "4px solid #a855f7",
                  }}
                />

                <span
                  style={{
                    position:
                      "absolute",
                    right:
                      "5px",
                    bottom:
                      "5px",
                    width:
                      "16px",
                    height:
                      "16px",
                    background:
                      "#22c55e",
                    borderRadius:
                      "50%",
                    border:
                      "2px solid #111",
                  }}
                />
              </div>

              {/* Name */}
              <h3
                style={{
                  color:
                    "#fff",
                  fontSize:
                    "20px",
                  marginTop:
                    "20px",
                  marginBottom:
                    "10px",
                }}
              >
                {
                  astro.name
                }
              </h3>

              {/* Experience */}
              <p
                style={{
                  color:
                    "#d8b4fe",
                  fontSize:
                    "14px",
                }}
              >
                ⭐{" "}
                {
                  astro.experience
                }
              </p>

              {/* Price */}
              <p
                style={{
                  color:
                    "#c084fc",
                  fontWeight:
                    "700",
                  fontSize:
                    "18px",
                  marginTop:
                    "12px",
                }}
              >
                {
                  astro.price
                }
              </p>

              <button
                style={{
                  marginTop:
                    "20px",
                  border:
                    "none",
                  padding:
                    "12px 22px",
                  borderRadius:
                    "30px",
                  background:
                    "linear-gradient(90deg,#7c3aed,#a855f7)",
                  color:
                    "#fff",
                  fontWeight:
                    "600",
                  cursor:
                    "pointer",
                }}
              >
                View Profile
              </button>
            </div>
          )
        )}
      </div>

      {/* CHANGE 4: Sirf mobile ke liye CSS override, desktop pe kuch nahi badlega */}
      <style>{`
        @media (max-width: 768px) {
          .astro-slider {
            scroll-snap-type: x mandatory !important;
          }
          .astro-card {
            min-width: 85vw !important;
            scroll-snap-align: center !important;
          }
        }
      `}</style>
    </section>
  );
}

const arrowStyle = {
  width: "50px",
  height: "50px",
  border: "none",
  borderRadius: "50%",
  background:
    "linear-gradient(90deg,#7c3aed,#a855f7)",
  color: "#fff",
  fontSize: "22px",
  cursor: "pointer",
};

export default AstrologersSlider;