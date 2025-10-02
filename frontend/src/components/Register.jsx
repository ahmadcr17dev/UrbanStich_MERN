import { useRef, useEffect, useState } from "react";
import urbanstichlogo from "../images/urbanstichlogo.png";
import registerimage from "../images/registerimage.jpg";
import { useNavigate } from "react-router-dom";

const Register = ({ onClose, onSwitchToLogin }) => {
  const modalRef = useRef(null);
  const [formdata, setformdata] = useState({
    username: "",
    email: "",
    password: "",
    role: "user" // Always set default role
  });
  const [message, setmessage] = useState("");
  const [messagetype, setmessagetype] = useState("");
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_API_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata)
      });
      const data = await response.json();

      if (response.ok) {
        setmessagetype("success");
        setformdata({ username: "", email: "", password: "", role: "user" });
        navigate("./Login");
      } else {
        setmessagetype("failure");
      }
      setmessage(data.message);
    } catch (error) {
      console.error("Error: ", error.message);
      setmessagetype("failure");
      setmessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg font-montserrat
        w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-5xl
        flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left Image */}
        <div className="md:w-1/2 w-full h-40 md:h-auto">
          <img
            src={registerimage}
            alt="Register Visual"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 w-full p-6 sm:p-8">
          <div className="mb-4 flex justify-center">
            <img
              src={urbanstichlogo}
              alt="Site Logo"
              className="w-[140px] sm:w-[180px] lg:w-[200px] xl:w-[220px]"
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-green-700 text-center">
            Join us for free!
          </h2>

          <form className="space-y-4" onSubmit={handlesubmit}>
            <input
              type="text"
              placeholder="Username"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:border-green-500"
              required
              name="username"
              value={formdata.username}
              onChange={handlechange}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:border-green-500"
              required
              name="email"
              value={formdata.email}
              onChange={handlechange}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:border-green-500"
              required
              name="password"
              value={formdata.password}
              onChange={handlechange}
              onFocus={() => setShowPasswordHint(true)}
              onBlur={() => setShowPasswordHint(false)}
            />

            {/* Password Hint */}
            {showPasswordHint && (
              <p className="text-[12px] text-gray-500">
                Must be 7-15 chars, include uppercase, lowercase, number & special char.
              </p>
            )}

            {message && (
              <p
                className={
                  messagetype === "success"
                    ? "text-green-600 font-medium text-[13px]"
                    : "text-red-600 font-medium text-[13px]"
                }
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-none text-green-800 font-medium px-4 py-2 border border-green-700 rounded hover:bg-green-700 hover:text-white transition-colors hover:cursor-pointer"
            >
              Register
            </button>
          </form>

          <div className="flex justify-between text-[13px] mt-4">
            <span className="text-gray-500">Already have an account?</span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-green-700 font-medium hover:cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
