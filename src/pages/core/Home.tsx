import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { useState, useEffect } from "react";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Trigger load animation
    const timer = setTimeout(() => setIsLoaded(true), 100);

    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center 
                 px-4 md:px-8 lg:px-12 
                 bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/dashboard.jpg')",
        backgroundAttachment: isMobile ? "scroll" : "fixed",
        backgroundSize: "cover",
        backgroundPosition: isMobile ? "center center" : "center",
      }}
    >
      <div
        className="absolute inset-0 
                      bg-gradient-to-br from-black/70 via-blue-900/50 to-black/80"
      ></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {!isMobile && (
          <>
            <div
              className="absolute top-1/4 left-1/4 
                            w-24 h-24 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 
                            lg:w-56 lg:h-56 xl:w-64 xl:h-64 
                            bg-blue-500/8 rounded-full blur-3xl animate-pulse"
            ></div>
            <div
              className="absolute bottom-1/4 right-1/4 
                            w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 
                            lg:w-72 lg:h-72 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 
                            bg-yellow-400/8 rounded-full blur-3xl animate-pulse delay-1000"
            ></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 
                            lg:w-40 lg:h-40 xl:w-48 xl:h-48 
                            bg-white/4 rounded-full blur-2xl animate-bounce"
            ></div>
          </>
        )}
        {isMobile && (
          <>
            <div
              className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            w-24 h-24 xs:w-28 xs:h-28 
                            bg-blue-500/6 rounded-full blur-2xl animate-pulse"
            ></div>
            <div
              className="absolute bottom-1/3 right-1/4 
                            w-20 h-20 xs:w-24 xs:h-24 
                            bg-yellow-400/5 rounded-full blur-xl animate-pulse delay-500"
            ></div>
          </>
        )}
      </div>

      <div
        className={`max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl 
                    mx-auto text-center relative z-10 w-full 
                    transition-all duration-1000 ${
                      isLoaded
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
      >
        <div className="mb-8 md:mb-16 py-4 md:py-8">
          <div className="flex flex-col items-center gap-6 md:gap-10 mb-8 md:mb-12">
            <div className="flex flex-row justify-center items-center gap-4 md:gap-8 lg:gap-12 w-full">
              {/* PEA Logo */}
              <div
                className="group relative transform transition-all duration-500 
                              hover:scale-105 active:scale-95"
              >
                <div
                  className="absolute -inset-0.5 xs:-inset-0.5 sm:-inset-1 md:-inset-1.5 
                                lg:-inset-2 xl:-inset-3 2xl:-inset-4 
                                bg-gradient-to-r from-yellow-400 to-orange-500 
                                rounded-full blur-sm xs:blur-sm sm:blur-md md:blur-lg lg:blur-xl 
                                opacity-20 group-hover:opacity-40 transition-all duration-500"
                ></div>
                <div
                  className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64
                                bg-white rounded-full flex items-center justify-center 
                                shadow-lg md:shadow-xl ring-2 ring-white/30 transition-all duration-500 
                                hover:shadow-yellow-400/25 hover:ring-white/50"
                >
                  <div className="w-4/5 h-4/5 relative overflow-hidden rounded-full">
                    <img
                      src="/images/pea_logo.png"
                      alt="Provincial Electricity Authority"
                      className="w-full h-full object-contain object-center 
                                 filter drop-shadow-sm md:drop-shadow-lg"
                      loading="lazy"
                      sizes="(max-width: 768px) 128px, (max-width: 1024px) 192px, 256px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                  <div
                    className="absolute inset-0 
                                  bg-gradient-to-tr from-transparent via-white/15 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                                  rounded-full"
                  ></div>
                </div>
              </div>

              {/* PWA Logo */}
              <div
                className="group relative transform transition-all duration-500 
                              hover:scale-105 active:scale-95"
              >
                <div
                  className="absolute -inset-0.5 xs:-inset-0.5 sm:-inset-1 md:-inset-1.5 
                                lg:-inset-2 xl:-inset-3 2xl:-inset-4 
                                bg-gradient-to-r from-blue-400 to-cyan-500 
                                rounded-full blur-sm xs:blur-sm sm:blur-md md:blur-lg lg:blur-xl 
                                opacity-20 group-hover:opacity-40 transition-all duration-500"
                ></div>
                <div
                  className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64
                                bg-white rounded-full flex items-center justify-center 
                                shadow-lg md:shadow-xl ring-2 ring-white/30 transition-all duration-500 
                                hover:shadow-blue-400/25 hover:ring-white/50"
                >
                  <div className="w-4/5 h-4/5 relative overflow-hidden rounded-full">
                    <img
                      src="/images/pwa_logo.png"
                      alt="PWA - Solar Energy Partner"
                      className="w-full h-full object-contain object-center 
                                 filter drop-shadow-sm md:drop-shadow-lg"
                      loading="lazy"
                      sizes="(max-width: 768px) 128px, (max-width: 1024px) 192px, 256px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                  <div
                    className="absolute inset-0 
                                  bg-gradient-to-tr from-transparent via-white/15 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                                  rounded-full"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Partnership Badge */}
          <div className="flex justify-center px-4 md:px-8">
            <div className="relative group w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
              <div
                className="absolute -inset-2 bg-gradient-to-r from-white/15 to-blue-200/15 
                              rounded-2xl sm:rounded-full blur-lg 
                              opacity-40 group-hover:opacity-60 transition-all duration-500"
              ></div>
              <div
                className="relative bg-white/10 hover:bg-white/15 backdrop-blur-md 
                              rounded-2xl sm:rounded-full px-6 py-4 md:px-12 md:py-6 
                              border border-white/25 shadow-xl hover:shadow-2xl 
                              transition-all duration-300"
              >
                <p
                  className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl 
                              font-medium tracking-wide text-center leading-snug 
                              drop-shadow-xl"
                >
                  โครงการจัดการพลังงานไฟฟ้าจากระบบผลิตไฟฟ้าพลังงานแสงอาทิตย์
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="mb-6 space-y-4 md:space-y-6 px-4 md:px-8">
          {/* Subtitle */}
          <div className="relative space-y-2 mt-6 sm:mt-0 mb-6 sm:mb-0">
            <p
              className="text-base sm:text-2xl md:text-3xl lg:text-3xl 
                         text-gray-100 drop-shadow-xl font-light tracking-wide leading-relaxed"
            >
              ระบบจัดการโครงการก่อสร้างภายในองค์กร
            </p>
            <p
              className="text-base sm:text-xl md:text-2xl lg:text-2xl 
                         text-blue-200 drop-shadow-lg font-medium"
            >
              Internal Construction Management System
            </p>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col gap-4 md:gap-6 justify-center items-center pt-4 md:pt-8">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="group relative inline-flex items-center justify-center 
                           w-full max-w-xs md:max-w-md lg:max-w-lg 
                           px-4 md:px-6 py-2 md:py-3 
                           text-sm md:text-base font-bold rounded-xl text-white 
                           bg-gradient-to-r from-slate-600 to-slate-700 
                           hover:from-slate-700 hover:to-slate-800 
                           focus:outline-none focus:ring-2 focus:ring-slate-500/50 
                           transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] 
                           shadow-lg hover:shadow-xl border border-slate-500/30
                           cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ touchAction: "manipulation" }}
                type="button"
              >
                <div
                  className="absolute inset-0 
                                bg-gradient-to-r from-white/8 to-transparent 
                                rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <span className="relative flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 21V5a2 2 0 012-2h6a2 2 0 012 2v16"
                    />
                  </svg>
                  <span className="text-center font-bold leading-tight">
                    เข้าสู่ระบบจัดการโครงการ
                  </span>
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="group relative inline-flex items-center justify-center 
                           w-full max-w-xs md:max-w-md lg:max-w-lg 
                           px-4 md:px-6 py-2 md:py-3 
                           text-sm md:text-base font-bold rounded-xl text-white 
                           bg-gradient-to-r from-indigo-600 to-indigo-700 
                           hover:from-indigo-700 hover:to-indigo-800 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                           transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] 
                           shadow-lg hover:shadow-xl 
                           border border-indigo-500/30 hover:text-indigo-100
                           cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ touchAction: "manipulation" }}
                type="button"
              >
                <div
                  className="absolute inset-0 
                                bg-gradient-to-r from-white/8 to-transparent 
                                rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <span className="relative flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="text-center font-bold leading-tight">
                    เข้าสู่ระบบ
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
