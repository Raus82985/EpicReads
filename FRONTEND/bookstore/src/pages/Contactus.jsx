import { createElement, useRef, useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";
import { GrMail, GrPhone} from "react-icons/gr";

const Contactus = () => {
  const form = useRef();

  // State to track input values
  const [inputs, setInputs] = useState({
    from_name: '',
    user_email: '',
    message: ''
  });

  // Sending Email
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_zv96xrk', 'template_m8t25rg', form.current, 'TIjVLsqruq8Ytgr85')
      .then(
        (result) => {
          console.log(result.text);
          // Clear all input field values
          setInputs({ from_name: '', user_email: '', message: '' });
          form.current.reset();
          // Success toast message
          toast.success("Email sent successfully");
        },
        (error) => {
          console.log(error.text);
          toast.error("Failed to send email. Please try again.");
        }
      );
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Call it initially
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value
    }));
  };

  return (
    <section className="bg-zinc-900 pb-10 text-white" id="contact">
      <Toaster />
      <div className="md:container mx-auto px-5 py-14">
        <h4
          className={`subtitle text-white text-3xl font-bold text-center hover:underline`}
          data-aos="fade-up"
        >
          CONTACT ME
        </h4>
        <br />
        <div className="flex justify-center">
          <form
            ref={form}
            onSubmit={sendEmail}
            className="w-full max-w-md flex flex-col gap-5 bg-zinc-800 p-8 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
          >
            <input
              type="text"
              name="from_name"
              value={inputs.from_name}
              onChange={handleChange}
              placeholder="Name"
              required
              className={`p-3 rounded-xl ${inputs.from_name ? 'bg-zinc-200 text-black' : 'bg-zinc-900'} focus:border-yellow-400 transition duration-200`}
            />
            <input
              type="email"
              name="user_email"
              value={inputs.user_email}
              onChange={handleChange}
              placeholder="Email Id"
              required
              className={`p-3 rounded-xl ${inputs.user_email ? 'bg-slate-200 text-black' : 'bg-zinc-900'} focus:border-yellow-400 transition duration-200`}
            />
            <textarea
              name="message"
              value={inputs.message}
              onChange={handleChange}
              placeholder="Message"
              className={`p-3 rounded-xl h-44 ${inputs.message ? 'bg-slate-200 text-black' : 'bg-zinc-900'} focus:border-yellow-400 transition duration-200`}
              required
            ></textarea>
            <button
              type="submit"
              className="border border-white px-7 py-2 rounded-lg bg-yellow-500 text-slate-800 hover:bg-yellow-400 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
        <div className="flex flex-col items-center mt-10">
          <div
            data-aos="fade-up"
            className="flex items-center gap-2 hover:underline hover:text-lg transition-colors duration-300"
          >
            <h4 className="text-yellow-400">{createElement(GrMail)}</h4>
            <a className="font-Poppins text-white" href="mailto:raushan829854@gmail.com" target="_blank" rel="noopener noreferrer">
              raushan829854@gmail.com
            </a>
          </div>
          <div
            data-aos="fade-up"
            className="flex items-center gap-2 hover:underline hover:text-lg transition-colors duration-300 mt-2"
          >
            <h4 className="text-yellow-400">{createElement(GrPhone)}</h4>
            <a className="font-Poppins text-white" href="tel:+918298542621" target="_blank" rel="noopener noreferrer">
              +91 82985 42621
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contactus;
