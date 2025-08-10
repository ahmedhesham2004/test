"use client";
import validator from "validator";
import { useState } from "react";
import Swal from "sweetalert2";

export default function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
    phone: "",
  };
  const [errors, setErrors] = useState({});
  const validateField = (name, value) => {
    let error = "";

    if (name === "firstName" || name === "lastName") {
      const nameRegex = /^[\p{L}\s-]{2,25}$/u;
      if (!nameRegex.test(value)) {
        error = "⚠️ يجب أن يحتوي الاسم على 2 إلى 25 حرفًا.";
      }
    }

    if (name === "email" && !validator.isEmail(value)) {
      error = "⚠️ البريد الإلكتروني غير صالح!";
    }
    if (name === "phone" && !validator.isMobilePhone(value, "ar-EG")) {
      error = "⚠️ يجب أن يكون رقم الهاتف 11 رقمًا ويبدأ بـ 01.";
    }

    if (
      name === "password" &&
      !validator.isStrongPassword(value, {
        minLength: 8,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      error =
        "⚠️ يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، وحرف كبير، وحرف صغير، ورقم، ورمز خاص.";
    }

    if (name === "confirmPassword" && value !== formData.password) {
      error = "⚠️ كلمتا المرور غير متطابقتين!";
    }

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "❌ خطأ!",
        text: "كلمتا المرور غير متطابقتين، يرجى التأكد قبل المتابعة.",
        confirmButtonText: "حسنًا، سأحاول مرة أخرى.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("FirstName", formData.firstName);
      formDataToSend.append("LastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("PhoneNumber", formData.phone);
      formDataToSend.append("sex", formData.gender);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("ConfirmPassword", formData.confirmPassword);

      console.log(formData.nationality);

      const res = await fetch(
        "https://itch-clinc.runasp.net/api/Auth/Register",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!res.ok) {
        throw new Error(res?.message || "❌ حدث خطأ غير متوقع!");
      }

      const responseData = await res.text();
      const partialResponse = responseData.substring(29);

      Swal.fire({
        icon: "success",
        title: "🎉 تم إنشاء الحساب بنجاح!",
        text: partialResponse,
        confirmButtonText: "ابدأ الآن",
        confirmButtonColor: "#28a745",
      });

      setFormData(initialState);
    } catch (error) {
      console.error("❌ Error:", error);
      Swal.fire({
        icon: "error",
        title: "❌ خطأ!",
        text:
          responseData || "حدث خطأ أثناء معالجة طلبك، يرجى المحاولة لاحقًا.",
        confirmButtonText: "حسنًا",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: " url('/back1.jpeg')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
      className="flex justify-center items-center text-white min-h-screen w-full px-4 py-8"
    >
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/95 p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-[550px] border border-blue-100 z-10"
      >
        <div className="flex justify-center mb-2 animate-bounce-slow">
          <svg
            width="60"
            height="60"
            viewBox="0 0 148.202 148.203"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <g>
                <path
                  d="M141.343,31.736c-2.917-12.577-11.417-21.793-24.606-26.677c-8.786-3.245-30.184-6.214-39.604,4.859C46.763-8.078,30.749,1.725,19.98,13.292c-23.769,25.532-12.894,51.253-2.731,62.42c7.347,8.087,9.472,12.763,10.662,18.104c0.268,1.175,0.874,4.646,0.904,5.389c1.878,44.476,17.043,48.287,20.669,48.555c1.057,0.305,2.098,0.444,3.105,0.444c1.848,0,3.599-0.493,5.188-1.467c7.532-4.616,9.853-18.986,11.893-31.64c0.742-4.579,1.434-8.902,2.243-11.417c1.403-4.354,2.563-5.347,2.552-5.498c1.011,0.45,2.716,3.708,2.904,4.992c0.28,1.918,0.481,4.402,0.706,7.186c1.163,14.285,2.898,35.828,18.091,37.388c1.078,0.231,3.642,0.469,6.79-1.431c7.161-4.348,12.464-16.801,15.746-37.017l0.493-3.233c1.182-8.104,2.819-19.211,9.512-26.25C136.441,71.742,145.775,50.859,141.343,31.736z M124.22,75.529c-8.062,8.477-9.938,21.215-11.167,29.654l-0.475,3.13c-3.782,23.255-9.408,30.275-12.416,32.395c-1.59,1.12-2.582,0.962-2.473,1.005l-0.706-0.141c-10.181-0.889-11.679-19.418-12.665-31.7c-0.244-2.947-0.457-5.571-0.749-7.599c-0.299-2.047-3.197-9.853-8.525-10.297c-5.729-0.384-8.217,7.252-9.033,9.797c-0.956,2.978-1.659,7.307-2.469,12.337c-1.559,9.633-3.909,24.198-9.006,27.328c-0.686,0.427-1.714,0.864-3.565,0.268l-0.941-0.146h-0.082c-0.155,0-13.149-1.571-14.885-42.612c-0.061-1.431-0.815-5.468-1.041-6.491c-1.638-7.318-4.923-12.994-12.133-20.922c-2.414-2.643-22.776-26.631,2.683-53.972C36.269,4.999,53.528-3.508,92.721,28.679c1.334,1.087,3.288,0.904,4.391-0.43c1.096-1.333,0.901-3.285-0.427-4.39c-5.023-4.113-9.736-7.611-14.157-10.538c7.222-7.252,24.266-5.279,32.065-2.387c11.296,4.177,18.256,11.651,20.697,22.229C139.011,49.293,131.259,68.143,124.22,75.529z"
                  fill="#fff"
                  stroke="#0288d1"
                  strokeWidth="2.5"
                />
              </g>
            </g>
          </svg>
        </div>
        <div className="text-center mb-8">
          <h2
            style={{ fontFamily: "'Cairo', sans-serif" }}
            className="text-cyan-400 mb-2 text-center text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text "
          >
            إنشاء حساب جديد
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                name="firstName"
                required
                placeholder="الاسم الأول"
                onChange={handleChange}
                value={formData.firstName}
                className="w-full h-[48px] text-right sm:h-[51px] bg-white/80 border border-cyan-200 placeholder:text-cyan-400 pr-[45px] sm:pr-[45px] pl-6 rounded-2xl outline-none text-[15px] sm:text-[17px] text-blue-900 shadow focus:ring-2 focus:ring-cyan-200"
              />
              {errors.firstName && (
                <div className="min-h-[20px]">
                  {" "}
                  {/* هذه المساحة الثابتة تمنع زحزحة العناصر */}
                  <p className="text-red-300 text-xs mt-2 w-full">
                    {errors.firstName}
                  </p>
                </div>
              )}
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                name="lastName"
                required
                placeholder="اسم العائلة"
                onChange={handleChange}
                value={formData.lastName}
                className="w-full h-[48px] text-right sm:h-[51px] bg-white/80 border border-cyan-200 placeholder:text-cyan-400 pr-[45px] sm:pr-[45px] pl-6 rounded-2xl outline-none text-[15px] sm:text-[17px] text-blue-900 shadow focus:ring-2 focus:ring-cyan-200"
              />
              {errors.lastName && (
                <div className="min-h-[20px]">
                  {" "}
                  {/* هذه المساحة الثابتة تمنع زحزحة العناصر */}
                  <p className="text-red-300 text-xs mt-2 w-full">
                    {errors.lastName}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              autoComplete="off"
              onChange={handleChange}
              value={formData.email}
              className="w-full h-[48px] text-right sm:h-[51px] bg-white/80 border border-cyan-200 placeholder:text-cyan-400 pr-[45px] sm:pr-[45px] pl-6 rounded-2xl outline-none text-[15px] sm:text-[17px] text-blue-900 shadow focus:ring-2 focus:ring-cyan-200"
            />
            {errors.email && (
              <p className=" relative  -bottom-1 left-0 text-red-300 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="w-full min-h-[48px] text-right bg-white/80 border border-cyan-200 placeholder:text-cyan-400 pr-[20px] pl-4 rounded-2xl text-[14px] sm:text-[17px] text-cyan-400 shadow focus:ring-2 focus:ring-cyan-200 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 sm:gap-4 p-3">
            <span className="text-cyan-400 font-semibold">الجنس</span>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  className="accent-cyan-400 w-5 h-5 focus:outline-none focus:ring-0"
                />
                <span className="text-cyan-400 font-medium">ذكر</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  className="accent-cyan-400 w-5 h-5 focus:outline-none focus:ring-0 border-0 outline-0"
                />
                <span className="text-cyan-400 font-medium">أنثى</span>
              </label>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <input
              type="tel"
              name="phone"
              required
              placeholder="رقم الهاتف"
              onChange={handleChange}
              value={formData.phone}
              className="w-full h-[48px] text-right sm:h-[51px] bg-white/80 border border-cyan-200 placeholder:text-cyan-400 pr-[45px] sm:pr-[45px] pl-6 rounded-2xl outline-none text-[15px] sm:text-[17px] text-blue-900 shadow focus:ring-2 focus:ring-cyan-200"
            />
            {errors.phone && (
              <p className=" relative  -bottom-1 left-0 text-red-300 text-xs mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="كلمة المرور"
              autoComplete="off"
              required
              onChange={handleChange}
              value={formData.password}
              className="w-full h-[48px] text-right sm:h-[51px] bg-white/80 border border-cyan-200 placeholder:text-cyan-400 pr-[45px] sm:pr-[45px] pl-12 rounded-2xl outline-none text-[15px] sm:text-[17px] text-blue-900 shadow focus:ring-2 focus:ring-cyan-200"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-[27px] transform -translate-y-1/2 cursor-pointer text-cyan-400 hover:text-cyan-600 transition-colors duration-200"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </span>
            {errors.password && (
              <div className="min-h-[20px]">
                {" "}
                <p className="text-red-300 text-xs mt-2 w-full">
                  {errors.password}
                </p>
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="تأكيد كلمة المرور"
              required
              onChange={handleChange}
              value={formData.confirmPassword}
              className="w-full h-[48px] text-right sm:h-[51px] bg-white/80 border border-cyan-200 placeholder:text-cyan-400 pr-[45px] sm:pr-[45px] pl-12 rounded-2xl outline-none text-[15px] sm:text-[17px] text-blue-900 shadow focus:ring-2 focus:ring-cyan-200"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-3 top-[27px] transform -translate-y-1/2 cursor-pointer text-cyan-400 hover:text-cyan-600 transition-colors duration-200"
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </span>
            {errors.confirmPassword && (
              <p className=" relative  -bottom-5 left-0 text-red-300 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#376c89] cursor-pointer text-white py-3 px-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  جاري المعالجة...
                </>
              ) : (
                "تسجيل الحساب"
              )}
            </button>
          </div>

          <div className="text-center mt-4 text-white/70">
            <a
              href="/login"
              className="text-blue-300 hover:text-blue-200 font-medium underline transition-colors duration-200"
            ></a>
          </div>
        </div>
      </form>
    </div>
  );
}
